// Copyright 2021 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, {Suspense, lazy} from "react";
import {Button, Checkbox, Col, Form, Input, Result, Spin, Tabs} from "antd";
import {ArrowLeftOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {withRouter} from "react-router-dom";
import * as UserWebauthnBackend from "../backend/UserWebauthnBackend";
import OrganizationSelect from "../common/select/OrganizationSelect";
import * as Conf from "../Conf";
import * as AuthBackend from "./AuthBackend";
import * as OrganizationBackend from "../backend/OrganizationBackend";
import * as ApplicationBackend from "../backend/ApplicationBackend";
import * as Provider from "./Provider";
import * as ProviderButton from "./ProviderButton";
import * as Util from "./Util";
import * as Setting from "../Setting";
import * as AgreementModal from "../common/modal/AgreementModal";
import SelfLoginButton from "./SelfLoginButton";
import i18next from "i18next";
import CustomGithubCorner from "../common/CustomGithubCorner";
import {SendCodeInput} from "../common/SendCodeInput";
import LanguageSelect from "../common/select/LanguageSelect";
import {CaptchaModal, CaptchaRule} from "../common/modal/CaptchaModal";
import RedirectForm from "../common/RedirectForm";
import {MfaAuthVerifyForm, NextMfa, RequiredMfa} from "./mfa/MfaAuthVerifyForm";
import {GoogleOneTapLoginVirtualButton} from "./GoogleLoginButton";
const FaceRecognitionModal = lazy(() => import("../common/modal/FaceRecognitionModal"));

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      type: props.type,
      applicationName: props.applicationName ?? (props.match?.params?.applicationName ?? null),
      owner: props.owner ?? (props.match?.params?.owner ?? null),
      mode: props.mode ?? (props.match?.params?.mode ?? null), // "signup" or "signin"
      msg: null,
      username: null,
      validEmailOrPhone: false,
      validEmail: false,
      enableCaptchaModal: CaptchaRule.Never,
      openCaptchaModal: false,
      openFaceRecognitionModal: false,
      verifyCaptcha: undefined,
      samlResponse: "",
      relayState: "",
      redirectUrl: "",
      isTermsOfUseVisible: false,
      termsOfUseContent: "",
      orgChoiceMode: new URLSearchParams(props.location?.search).get("orgChoiceMode") ?? null,
    };

    if (this.state.type === "cas" && props.match?.params.casApplicationName !== undefined) {
      this.state.owner = props.match?.params?.owner;
      this.state.applicationName = props.match?.params?.casApplicationName;
    }

    localStorage.setItem("signinUrl", window.location.href);

    this.form = React.createRef();
  }

  componentDidMount() {
    if (this.getApplicationObj() === undefined) {
      if (this.state.type === "login" || this.state.type === "saml") {
        this.getApplication();
      } else if (this.state.type === "code" || this.state.type === "cas") {
        this.getApplicationLogin();
      } else {
        Setting.showMessage("error", `Unknown authentication type: ${this.state.type}`);
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.loginMethod === undefined && this.state.loginMethod === undefined) {
      const application = this.getApplicationObj();
      this.setState({loginMethod: this.getDefaultLoginMethod(application)});
    }
    if (prevProps.application !== this.props.application) {
      this.setState({loginMethod: this.getDefaultLoginMethod(this.props.application)});

      const captchaProviderItems = this.getCaptchaProviderItems(this.props.application);
      if (captchaProviderItems) {
        if (captchaProviderItems.some(providerItem => providerItem.rule === "Always")) {
          this.setState({enableCaptchaModal: CaptchaRule.Always});
        } else if (captchaProviderItems.some(providerItem => providerItem.rule === "Dynamic")) {
          this.setState({enableCaptchaModal: CaptchaRule.Dynamic});
        } else {
          this.setState({enableCaptchaModal: CaptchaRule.Never});
        }
      }
    }

    if (prevProps.account !== this.props.account && this.props.account !== undefined) {
      if (this.props.account && this.props.account.owner === this.props.application?.organization) {
        const params = new URLSearchParams(this.props.location.search);
        const silentSignin = params.get("silentSignin");
        if (silentSignin !== null) {
          this.sendSilentSigninData("signing-in");

          const values = {};
          values["application"] = this.props.application.name;
          this.login(values);
        }

        if (params.get("popup") === "1") {
          window.addEventListener("beforeunload", () => {
            this.sendPopupData({type: "windowClosed"}, params.get("redirect_uri"));
          });
        }

        if (this.props.application.enableAutoSignin) {
          const values = {};
          values["application"] = this.props.application.name;
          this.login(values);
        }
      }
    }
  }

  checkCaptchaStatus(values) {
    AuthBackend.getCaptchaStatus(values)
      .then((res) => {
        if (res.status === "ok") {
          if (res.data) {
            this.setState({
              openCaptchaModal: true,
              values: values,
            });
            return null;
          }
        }
        this.login(values);
      });
  }

  getApplicationLogin() {
    const loginParams = (this.state.type === "cas") ? Util.getCasLoginParameters("admin", this.state.applicationName) : Util.getOAuthGetParameters();
    AuthBackend.getApplicationLogin(loginParams)
      .then((res) => {
        if (res.status === "ok") {
          const application = res.data;
          this.onUpdateApplication(application);
        } else {
          this.onUpdateApplication(null);
          this.setState({
            msg: res.msg,
          });
        }
      });
  }

  getApplication() {
    if (this.state.applicationName === null) {
      return null;
    }

    if (this.state.owner === null || this.state.type === "saml") {
      ApplicationBackend.getApplication("admin", this.state.applicationName)
        .then((res) => {
          if (res.status === "error") {
            this.onUpdateApplication(null);
            this.setState({
              msg: res.msg,
            });
            return ;
          }
          this.onUpdateApplication(res.data);
        });
    } else {
      OrganizationBackend.getDefaultApplication("admin", this.state.owner)
        .then((res) => {
          if (res.status === "ok") {
            const application = res.data;
            this.onUpdateApplication(application);
            this.setState({
              applicationName: res.data.name,
            });
          } else {
            this.onUpdateApplication(null);
            Setting.showMessage("error", res.msg);

            this.props.history.push("/404");
          }
        });
    }
  }

  getApplicationObj() {
    return this.props.application;
  }

  getDefaultLoginMethod(application) {
    if (application?.signinMethods?.length > 0) {
      switch (application?.signinMethods[0].name) {
      case "Password": return "password";
      case "Verification code": {
        switch (application?.signinMethods[0].rule) {
        case "All": return "verificationCode"; // All
        case "Email only": return "verificationCodeEmail";
        case "Phone only": return "verificationCodePhone";
        }
        break;
      }
      case "WebAuthn": return "webAuthn";
      case "LDAP": return "ldap";
      case "Face ID": return "faceId";
      }
    }

    return "password";
  }

  getPlaceholder() {
    switch (this.state.loginMethod) {
    case "verificationCode": return i18next.t("login:Email or phone");
    case "verificationCodeEmail": return i18next.t("login:Email");
    case "verificationCodePhone": return i18next.t("login:Phone");
    case "ldap": return i18next.t("login:LDAP username, Email or phone");
    default: return i18next.t("login:username, Email or phone");
    }
  }

  onUpdateAccount(account) {
    this.props.onUpdateAccount(account);
  }

  onUpdateApplication(application) {
    this.props.onUpdateApplication(application);
  }

  parseOffset(offset) {
    if (offset === 2 || offset === 4 || Setting.inIframe() || Setting.isMobile()) {
      return "0 auto";
    }
    if (offset === 1) {
      return "0 10%";
    }
    if (offset === 3) {
      return "0 60%";
    }
  }

  populateOauthValues(values) {
    if (this.getApplicationObj()?.organization) {
      values["organization"] = this.getApplicationObj().organization;
    }

    if (this.state.loginMethod === "password") {
      values["signinMethod"] = "Password";
    } else if (this.state.loginMethod?.includes("verificationCode")) {
      values["signinMethod"] = "Verification code";
    } else if (this.state.loginMethod === "webAuthn") {
      values["signinMethod"] = "WebAuthn";
    } else if (this.state.loginMethod === "ldap") {
      values["signinMethod"] = "LDAP";
    } else if (this.state.loginMethod === "faceId") {
      values["signinMethod"] = "Face ID";
    }
    const oAuthParams = Util.getOAuthGetParameters();

    values["type"] = oAuthParams?.responseType ?? this.state.type;

    if (oAuthParams?.samlRequest) {
      values["samlRequest"] = oAuthParams.samlRequest;
      values["type"] = "saml";
      values["relayState"] = oAuthParams.relayState;
    }
  }

  sendPopupData(message, redirectUri) {
    const params = new URLSearchParams(this.props.location.search);
    if (params.get("popup") === "1") {
      window.opener.postMessage(message, redirectUri);
    }
  }

  postCodeLoginAction(resp) {
    const application = this.getApplicationObj();
    const ths = this;
    const oAuthParams = Util.getOAuthGetParameters();
    const code = resp.data;
    const concatChar = oAuthParams?.redirectUri?.includes("?") ? "&" : "?";
    const noRedirect = oAuthParams.noRedirect;
    const redirectUrl = `${oAuthParams.redirectUri}${concatChar}code=${code}&state=${oAuthParams.state}`;
    if (resp.data === RequiredMfa) {
      this.props.onLoginSuccess(window.location.href);
      return;
    }

    if (resp.data2) {
      sessionStorage.setItem("signinUrl", window.location.href);
      Setting.goToLinkSoft(ths, `/forget/${application.name}`);
      return;
    }

    if (Setting.hasPromptPage(application)) {
      AuthBackend.getAccount()
        .then((res) => {
          if (res.status === "ok") {
            const account = res.data;
            account.organization = res.data2;
            this.onUpdateAccount(account);

            if (Setting.isPromptAnswered(account, application)) {
              Setting.goToLink(redirectUrl);
            } else {
              Setting.goToLinkSoft(ths, `/prompt/${application.name}?redirectUri=${oAuthParams.redirectUri}&code=${code}&state=${oAuthParams.state}`);
            }
          } else {
            Setting.showMessage("error", `${i18next.t("application:Failed to sign in")}: ${res.msg}`);
          }
        });
    } else {
      if (noRedirect === "true") {
        window.close();
        const newWindow = window.open(redirectUrl);
        if (newWindow) {
          setInterval(() => {
            if (!newWindow.closed) {
              newWindow.close();
            }
          }, 1000);
        }
      } else {
        Setting.goToLink(redirectUrl);
        this.sendPopupData({type: "loginSuccess", data: {code: code, state: oAuthParams.state}}, oAuthParams.redirectUri);
      }
    }
  }

  onFinish(values) {
    if (this.state.loginMethod === "webAuthn") {
      let username = this.state.username;
      if (username === null || username === "") {
        username = values["username"];
      }

      this.signInWithWebAuthn(username, values);
      return;
    }
    if (this.state.loginMethod === "faceId") {
      let username = this.state.username;
      if (username === null || username === "") {
        username = values["username"];
      }
      const application = this.getApplicationObj();
      fetch(`${Setting.ServerUrl}/api/faceid-signin-begin?owner=${application.organization}&name=${username}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept-Language": Setting.getAcceptLanguage(),
        },
      }).then(res => res.json())
        .then((res) => {
          if (res.status === "error") {
            Setting.showMessage("error", res.msg);
            return;
          }
          this.setState({
            openFaceRecognitionModal: true,
            values: values,
          });
        });
      return;
    }
    if (this.state.loginMethod === "password" || this.state.loginMethod === "ldap") {
      if (this.state.enableCaptchaModal === CaptchaRule.Always) {
        this.setState({
          openCaptchaModal: true,
          values: values,
        });
        return;
      } else if (this.state.enableCaptchaModal === CaptchaRule.Dynamic) {
        this.checkCaptchaStatus(values);
        return;
      }
    }
    this.login(values);
  }

  login(values) {
    // here we are supposed to determine whether Casdoor is working as an OAuth server or CAS server
    if (this.state.type === "cas") {
      // CAS
      const casParams = Util.getCasParameters();
      values["type"] = this.state.type;
      AuthBackend.loginCas(values, casParams).then((res) => {
        const loginHandler = (res) => {
          let msg = "Logged in successfully. ";
          if (casParams.service === "") {
            // If service was not specified, Casdoor must display a message notifying the client that it has successfully initiated a single sign-on session.
            msg += "Now you can visit apps protected by Casdoor.";
          }
          Setting.showMessage("success", msg);

          if (casParams.service !== "") {
            const st = res.data;
            const newUrl = new URL(casParams.service);
            newUrl.searchParams.append("ticket", st);
            window.location.href = newUrl.toString();
          }
        };

        if (res.status === "ok") {
          if (res.data === NextMfa) {
            this.setState({
              getVerifyTotp: () => {
                return (
                  <MfaAuthVerifyForm
                    mfaProps={res.data2}
                    formValues={values}
                    authParams={casParams}
                    application={this.getApplicationObj()}
                    onFail={() => {
                      Setting.showMessage("error", i18next.t("mfa:Verification failed"));
                    }}
                    onSuccess={(res) => loginHandler(res)}
                  />);
              },
            });
          } else {
            loginHandler(res);
          }
        } else {
          Setting.showMessage("error", `${i18next.t("application:Failed to sign in")}: ${res.msg}`);
        }
      });
    } else {
      // OAuth
      const oAuthParams = Util.getOAuthGetParameters();
      this.populateOauthValues(values);
      AuthBackend.login(values, oAuthParams)
        .then((res) => {
          const loginHandler = (res) => {
            const responseType = values["type"];

            if (responseType === "login") {
              if (res.data2) {
                sessionStorage.setItem("signinUrl", window.location.href);
                Setting.goToLink(this, `/forget/${this.state.applicationName}`);
              }
              Setting.showMessage("success", i18next.t("application:Logged in successfully"));
              this.props.onLoginSuccess();
            } else if (responseType === "code") {
              this.postCodeLoginAction(res);
            } else if (responseType === "token" || responseType === "id_token") {
              if (res.data2) {
                sessionStorage.setItem("signinUrl", window.location.href);
                Setting.goToLink(this, `/forget/${this.state.applicationName}`);
              }
              const amendatoryResponseType = responseType === "token" ? "access_token" : responseType;
              const accessToken = res.data;
              Setting.goToLink(`${oAuthParams.redirectUri}#${amendatoryResponseType}=${accessToken}&state=${oAuthParams.state}&token_type=bearer`);
            } else if (responseType === "saml") {
              if (res.data2.needUpdatePassword) {
                sessionStorage.setItem("signinUrl", window.location.href);
                Setting.goToLink(this, `/forget/${this.state.applicationName}`);
              }
              if (res.data2.method === "POST") {
                this.setState({
                  samlResponse: res.data,
                  redirectUrl: res.data2.redirectUrl,
                  relayState: oAuthParams.relayState,
                });
              } else {
                const SAMLResponse = res.data;
                const redirectUri = res.data2.redirectUrl;
                Setting.goToLink(`${redirectUri}?SAMLResponse=${encodeURIComponent(SAMLResponse)}&RelayState=${oAuthParams.relayState}`);
              }
            }
          };

          if (res.status === "ok") {
            if (res.data === NextMfa) {
              this.setState({
                getVerifyTotp: () => {
                  return (
                    <MfaAuthVerifyForm
                      mfaProps={res.data2}
                      formValues={values}
                      authParams={oAuthParams}
                      application={this.getApplicationObj()}
                      onFail={() => {
                        Setting.showMessage("error", i18next.t("mfa:Verification failed"));
                      }}
                      onSuccess={(res) => loginHandler(res)}
                    />);
                },
              });
            } else if (res.data === "SelectPlan") {
              // paid-user does not have active or pending subscription, go to application default pricing page to select-plan
              const pricing = res.data2;
              Setting.goToLink(`/select-plan/${pricing.owner}/${pricing.name}?user=${values.username}`);
            } else if (res.data === "BuyPlanResult") {
              // paid-user has pending subscription, go to buy-plan/result apge to notify payment result
              const sub = res.data2;
              Setting.goToLink(`/buy-plan/${sub.owner}/${sub.pricing}/result?subscription=${sub.name}`);
            } else {
              loginHandler(res);
            }
          } else {
            Setting.showMessage("error", `${i18next.t("application:Failed to sign in")}: ${res.msg}`);
          }
        });
    }
  }

  isProviderVisible(providerItem) {
    if (this.state.mode === "signup") {
      return Setting.isProviderVisibleForSignUp(providerItem);
    } else {
      return Setting.isProviderVisibleForSignIn(providerItem);
    }
  }

  renderOtherFormProvider(application) {
    if (Setting.inIframe()) {
      return null;
    }

    for (const providerConf of application.providers) {
      if (providerConf.provider?.type === "Google" && providerConf.rule === "OneTap" && this.props.preview !== "auto") {
        return (
          <GoogleOneTapLoginVirtualButton application={application} providerConf={providerConf} />
        );
      }
    }

    return null;
  }

  renderFormItem(application, signinItem) {
    if (!signinItem.visible && signinItem.name !== "Forgot password?") {
      return null;
    }

    if (signinItem.name === "Logo") {
      return (
        <div className="login-logo-box">
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          {
            Setting.renderHelmet(application)
          }
          {
            Setting.renderLogo(application)
          }
        </div>
      );
    } else if (signinItem.name === "Back button") {
      return (
        <div className="back-button">
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          {
            this.renderBackButton()
          }
        </div>
      );
    } else if (signinItem.name === "Languages") {
      const languages = application.organizationObj.languages;
      if (languages.length <= 1) {
        const language = (languages.length === 1) ? languages[0] : "en";
        if (Setting.getLanguage() !== language) {
          Setting.setLanguage(language);
        }
        return null;
      }

      return (
        <div className="login-languages">
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          <LanguageSelect languages={application.organizationObj.languages} />
        </div>
      );
    } else if (signinItem.name === "Signin methods") {
      return (
        <div>
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          {this.renderMethodChoiceBox()}
        </div>
      )
      ;
    } else if (signinItem.name === "Username") {
      return (
        <div>
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          <Form.Item
            name="username"
            className="login-username"
            label={signinItem.label ? signinItem.label : null}
            rules={[
              {
                required: true,
                message: () => {
                  switch (this.state.loginMethod) {
                  case "verificationCodeEmail":
                    return i18next.t("login:Please input your Email!");
                  case "verificationCodePhone":
                    return i18next.t("login:Please input your Phone!");
                  case "ldap":
                    return i18next.t("login:Please input your LDAP username!");
                  default:
                    return i18next.t("login:Please input your Email or Phone!");
                  }
                },
              },
              {
                validator: (_, value) => {
                  if (value === "") {
                    return Promise.resolve();
                  }

                  if (this.state.loginMethod === "verificationCode") {
                    if (!Setting.isValidEmail(value) && !Setting.isValidPhone(value)) {
                      this.setState({validEmailOrPhone: false});
                      return Promise.reject(i18next.t("login:The input is not valid Email or phone number!"));
                    }

                    if (Setting.isValidEmail(value)) {
                      this.setState({validEmail: true});
                    } else {
                      this.setState({validEmail: false});
                    }
                  } else if (this.state.loginMethod === "verificationCodeEmail") {
                    if (!Setting.isValidEmail(value)) {
                      this.setState({validEmail: false});
                      this.setState({validEmailOrPhone: false});
                      return Promise.reject(i18next.t("login:The input is not valid Email!"));
                    } else {
                      this.setState({validEmail: true});
                    }
                  } else if (this.state.loginMethod === "verificationCodePhone") {
                    if (!Setting.isValidPhone(value)) {
                      this.setState({validEmailOrPhone: false});
                      return Promise.reject(i18next.t("login:The input is not valid phone number!"));
                    }
                  }

                  this.setState({validEmailOrPhone: true});
                  return Promise.resolve();
                },
              },
            ]}
          >

            <Input
              id="input"
              className="login-username-input"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={this.getPlaceholder()}
              onChange={e => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />
          </Form.Item>
        </div>
      );
    } else if (signinItem.name === "Password") {
      return (
        <div>
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          {this.renderPasswordOrCodeInput(signinItem)}
        </div>
      );
    } else if (signinItem.name === "Forgot password?") {
      return (
        <div>
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          <div className="login-forget-password">
            <Form.Item name="autoSignin" valuePropName="checked" noStyle>
              <Checkbox style={{float: "left"}}>
                {i18next.t("login:Auto sign in")}
              </Checkbox>
            </Form.Item>
            {
              signinItem.visible ? Setting.renderForgetLink(application, signinItem.label ? signinItem.label : i18next.t("login:Forgot password?")) : null
            }
          </div>
        </div>
      );
    } else if (signinItem.name === "Agreement") {
      return AgreementModal.isAgreementRequired(application) ? AgreementModal.renderAgreementFormItem(application, true, {}, this) : null;
    } else if (signinItem.name === "Login button") {
      return (
        <Form.Item className="login-button-box">
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
          >
            {
              this.state.loginMethod === "webAuthn" ? i18next.t("login:Sign in with WebAuthn") :
                this.state.loginMethod === "faceId" ? i18next.t("login:Sign in with Face ID") :
                  signinItem.label ? signinItem.label : i18next.t("login:Sign In")
            }
          </Button>
          {
            this.state.loginMethod === "faceId" ?
              <Suspense fallback={null}>
                <FaceRecognitionModal
                  visible={this.state.openFaceRecognitionModal}
                  onOk={(faceId) => {
                    const values = this.state.values;
                    values["faceId"] = faceId;

                    this.login(values);
                    this.setState({openFaceRecognitionModal: false});
                  }}
                  onCancel={() => this.setState({openFaceRecognitionModal: false})}
                />
              </Suspense>
              :
              <>
              </>
          }
          {
            this.renderCaptchaModal(application)
          }
        </Form.Item>
      );
    } else if (signinItem.name === "Providers") {
      const showForm = Setting.isPasswordEnabled(application) || Setting.isCodeSigninEnabled(application) || Setting.isWebAuthnEnabled(application) || Setting.isLdapEnabled(application);
      if (signinItem.rule === "None" || signinItem.rule === "") {
        signinItem.rule = showForm ? "small" : "big";
      }

      return (
        <div>
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          <Form.Item>
            {
              application.providers.filter(providerItem => this.isProviderVisible(providerItem)).map(providerItem => {
                return ProviderButton.renderProviderLogo(providerItem.provider, application, null, null, signinItem.rule, this.props.location);
              })
            }
            {
              this.renderOtherFormProvider(application)
            }
          </Form.Item>
        </div>
      );
    } else if (signinItem.name.startsWith("Text ") || signinItem?.isCustom) {
      return (
        <div dangerouslySetInnerHTML={{__html: signinItem.customCss}} />
      );
    } else if (signinItem.name === "Signup link") {
      return (
        <div style={{width: "100%"}} className="login-signup-link">
          <div dangerouslySetInnerHTML={{__html: ("<style>" + signinItem.customCss?.replaceAll("<style>", "").replaceAll("</style>", "") + "</style>")}} />
          {this.renderFooter(application, signinItem)}
        </div>
      );
    }
  }

  renderForm(application) {
    if (this.state.msg !== null) {
      return Util.renderMessage(this.state.msg);
    }

    if (this.state.mode === "signup" && !application.enableSignUp) {
      return (
        <Result
          status="error"
          title={i18next.t("application:Sign Up Error")}
          subTitle={i18next.t("application:The application does not allow to sign up new account")}
          extra={[
            <Button type="primary" key="signin"
              onClick={() => Setting.redirectToLoginPage(application, this.props.history)}>
              {
                i18next.t("login:Sign In")
              }
            </Button>,
          ]}
        >
        </Result>
      );
    }

    const showForm = Setting.isPasswordEnabled(application) || Setting.isCodeSigninEnabled(application) || Setting.isWebAuthnEnabled(application) || Setting.isLdapEnabled(application) || Setting.isFaceIdEnabled(application);
    if (showForm) {
      let loginWidth = 320;
      if (Setting.getLanguage() === "fr") {
        loginWidth += 20;
      } else if (Setting.getLanguage() === "es") {
        loginWidth += 40;
      } else if (Setting.getLanguage() === "ru") {
        loginWidth += 10;
      }

      return (
        <Form
          name="normal_login"
          initialValues={{

            organization: application.organization,
            application: application.name,
            autoSignin: true,
            username: Conf.ShowGithubCorner ? "admin" : "",
            password: Conf.ShowGithubCorner ? "123" : "",
          }}
          onFinish={(values) => {
            this.onFinish(values);
          }}
          style={{width: `${loginWidth}px`}}
          size="large"
          ref={this.form}
        >
          <Form.Item
            hidden={true}
            name="application"
            rules={[
              {
                required: true,
                message: i18next.t("application:Please input your application!"),
              },
            ]}
          >
          </Form.Item>
          <Form.Item
            hidden={true}
            name="organization"
            rules={[
              {
                required: true,
                message: i18next.t("application:Please input your organization!"),
              },
            ]}
          >
          </Form.Item>

          {
            application.signinItems?.map(signinItem => this.renderFormItem(application, signinItem))
          }
        </Form>
      );
    } else {
      return (
        <div style={{marginTop: "20px"}}>
          <div style={{fontSize: 16, textAlign: "left"}}>
            {i18next.t("login:To access")}&nbsp;
            <a target="_blank" rel="noreferrer" href={application.homepageUrl}>
              <span style={{fontWeight: "bold"}}>
                {application.displayName}
              </span>
            </a>
            :
          </div>
          <br />
          {
            application?.signinItems.map(signinItem => signinItem.name === "Providers" || signinItem.name === "Signup link" ? this.renderFormItem(application, signinItem) : null)
          }
        </div>
      );
    }
  }

  getCaptchaProviderItems(application) {
    const providers = application?.providers;

    if (providers === undefined || providers === null) {
      return null;
    }

    return providers.filter(providerItem => {
      if (providerItem.provider === undefined || providerItem.provider === null) {
        return false;
      }

      return providerItem.provider.category === "Captcha";
    });
  }

  renderCaptchaModal(application) {
    if (this.state.enableCaptchaModal === CaptchaRule.Never) {
      return null;
    }
    const captchaProviderItems = this.getCaptchaProviderItems(application);
    const alwaysProviderItems = captchaProviderItems.filter(providerItem => providerItem.rule === "Always");
    const dynamicProviderItems = captchaProviderItems.filter(providerItem => providerItem.rule === "Dynamic");
    const provider = alwaysProviderItems.length > 0
      ? alwaysProviderItems[0].provider
      : dynamicProviderItems[0].provider;

    return <CaptchaModal
      owner={provider.owner}
      name={provider.name}
      visible={this.state.openCaptchaModal}
      onOk={(captchaType, captchaToken, clientSecret) => {
        const values = this.state.values;
        values["captchaType"] = captchaType;
        values["captchaToken"] = captchaToken;
        values["clientSecret"] = clientSecret;

        this.login(values);
        this.setState({openCaptchaModal: false});
      }}
      onCancel={() => this.setState({openCaptchaModal: false})}
      isCurrentProvider={true}
    />;
  }

  renderFooter(application, signinItem) {
    return (
      <div>
        {
          !application.enableSignUp ? null : (
            signinItem.label ? Setting.renderSignupLink(application, signinItem.label) :
              (
                <React.Fragment>
                  {i18next.t("login:No account?")}
                  {
                    Setting.renderSignupLink(application, i18next.t("login:sign up now"))
                  }
                </React.Fragment>
              )
          )
        }
      </div>
    );
  }

  sendSilentSigninData(data) {
    if (Setting.inIframe()) {
      const message = {tag: "Casdoor", type: "SilentSignin", data: data};
      window.parent.postMessage(message, "*");
    }
  }

  renderSignedInBox() {
    if (this.props.account === undefined || this.props.account === null) {
      this.sendSilentSigninData("user-not-logged-in");
      return null;
    }

    const application = this.getApplicationObj();
    if (this.props.account.owner !== application?.organization) {
      return null;
    }

    return (
      <div>
        <div style={{fontSize: 16, textAlign: "left"}}>
          {i18next.t("login:Continue with")}&nbsp;:
        </div>
        <br />
        <SelfLoginButton account={this.props.account} onClick={() => {
          const values = {};
          values["application"] = application.name;
          this.login(values);
        }} />
        <br />
        <br />
        <div style={{fontSize: 16, textAlign: "left"}}>
          {i18next.t("login:Or sign in with another account")}&nbsp;:
        </div>
      </div>
    );
  }

  signInWithWebAuthn(username, values) {
    const oAuthParams = Util.getOAuthGetParameters();
    this.populateOauthValues(values);
    const application = this.getApplicationObj();
    return fetch(`${Setting.ServerUrl}/api/webauthn/signin/begin?owner=${application.organization}&name=${username}`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then((credentialRequestOptions) => {
        if ("status" in credentialRequestOptions) {
          Setting.showMessage("error", credentialRequestOptions.msg);
          throw credentialRequestOptions.status.msg;
        }

        credentialRequestOptions.publicKey.challenge = UserWebauthnBackend.webAuthnBufferDecode(credentialRequestOptions.publicKey.challenge);
        credentialRequestOptions.publicKey.allowCredentials.forEach(function(listItem) {
          listItem.id = UserWebauthnBackend.webAuthnBufferDecode(listItem.id);
        });

        return navigator.credentials.get({
          publicKey: credentialRequestOptions.publicKey,
        });
      })
      .then((assertion) => {
        const authData = assertion.response.authenticatorData;
        const clientDataJSON = assertion.response.clientDataJSON;
        const rawId = assertion.rawId;
        const sig = assertion.response.signature;
        const userHandle = assertion.response.userHandle;
        let finishUrl = `${Setting.ServerUrl}/api/webauthn/signin/finish?responseType=${values["type"]}`;
        if (values["type"] === "code") {
          finishUrl = `${Setting.ServerUrl}/api/webauthn/signin/finish?responseType=${values["type"]}&clientId=${oAuthParams.clientId}&scope=${oAuthParams.scope}&redirectUri=${oAuthParams.redirectUri}&nonce=${oAuthParams.nonce}&state=${oAuthParams.state}&codeChallenge=${oAuthParams.codeChallenge}&challengeMethod=${oAuthParams.challengeMethod}`;
        }
        return fetch(finishUrl, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            id: assertion.id,
            rawId: UserWebauthnBackend.webAuthnBufferEncode(rawId),
            type: assertion.type,
            response: {
              authenticatorData: UserWebauthnBackend.webAuthnBufferEncode(authData),
              clientDataJSON: UserWebauthnBackend.webAuthnBufferEncode(clientDataJSON),
              signature: UserWebauthnBackend.webAuthnBufferEncode(sig),
              userHandle: UserWebauthnBackend.webAuthnBufferEncode(userHandle),
            },
          }),
        })
          .then(res => res.json()).then((res) => {
            if (res.status === "ok") {
              const responseType = values["type"];
              if (responseType === "code") {
                this.postCodeLoginAction(res);
              } else if (responseType === "token" || responseType === "id_token") {
                const accessToken = res.data;
                Setting.goToLink(`${oAuthParams.redirectUri}#${responseType}=${accessToken}?state=${oAuthParams.state}&token_type=bearer`);
              } else {
                Setting.showMessage("success", i18next.t("login:Successfully logged in with WebAuthn credentials"));
                Setting.goToLink("/");
              }
            } else {
              Setting.showMessage("error", res.msg);
            }
          })
          .catch(error => {
            Setting.showMessage("error", `${i18next.t("general:Failed to connect to server")}${error}`);
          });
      });
  }

  renderPasswordOrCodeInput(signinItem) {
    const application = this.getApplicationObj();
    if (this.state.loginMethod === "password" || this.state.loginMethod === "ldap") {
      return (
        <Col span={24}>
          <div>
            <Form.Item
              name="password"
              className="login-password"
              label={signinItem.label ? signinItem.label : null}
              rules={[{required: true, message: i18next.t("login:Please input your password!")}]}
            >
              <Input.Password
                className="login-password-input"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={i18next.t("general:Password")}
                disabled={this.state.loginMethod === "password" ? !Setting.isPasswordEnabled(application) : !Setting.isLdapEnabled(application)}
              />
            </Form.Item>
          </div>
        </Col>
      );
    } else if (this.state.loginMethod?.includes("verificationCode")) {
      return (
        <Col span={24}>
          <div className="login-password">
            <Form.Item
              name="code"
              rules={[{required: true, message: i18next.t("login:Please input your code!")}]}
            >
              <SendCodeInput
                disabled={this.state.username?.length === 0 || !this.state.validEmailOrPhone}
                method={"login"}
                onButtonClickArgs={[this.state.username, this.state.validEmail ? "email" : "phone", Setting.getApplicationName(application)]}
                application={application}
              />
            </Form.Item>
          </div>
        </Col>
      );
    } else {
      return null;
    }
  }

  renderMethodChoiceBox() {
    const application = this.getApplicationObj();
    const items = [];

    const generateItemKey = (name, rule) => {
      return `${name}-${rule}`;
    };

    const itemsMap = new Map([
      [generateItemKey("Password", "All"), {label: i18next.t("general:Password"), key: "password"}],
      [generateItemKey("Password", "Non-LDAP"), {label: i18next.t("general:Password"), key: "password"}],
      [generateItemKey("Verification code", "All"), {label: i18next.t("login:Verification code"), key: "verificationCode"}],
      [generateItemKey("Verification code", "Email only"), {label: i18next.t("login:Verification code"), key: "verificationCodeEmail"}],
      [generateItemKey("Verification code", "Phone only"), {label: i18next.t("login:Verification code"), key: "verificationCodePhone"}],
      [generateItemKey("WebAuthn", "None"), {label: i18next.t("login:WebAuthn"), key: "webAuthn"}],
      [generateItemKey("LDAP", "None"), {label: i18next.t("login:LDAP"), key: "ldap"}],
      [generateItemKey("Face ID", "None"), {label: i18next.t("login:Face ID"), key: "faceId"}],
    ]);

    application?.signinMethods?.forEach((signinMethod) => {
      const item = itemsMap.get(generateItemKey(signinMethod.name, signinMethod.rule));
      if (item) {
        let label = signinMethod.name === signinMethod.displayName ? item.label : signinMethod.displayName;

        if (application?.signinMethods?.length >= 4 && label === "Verification code") {
          label = "Code";
        }

        items.push({label: label, key: item.key});
      }
    });

    if (items.length > 1) {
      return (
        <div>
          <Tabs className="signin-methods" items={items} size={"small"} defaultActiveKey={this.getDefaultLoginMethod(application)} onChange={(key) => {
            this.setState({loginMethod: key});
          }} centered>
          </Tabs>
        </div>
      );
    }
  }

  renderLoginPanel(application) {
    const orgChoiceMode = application.orgChoiceMode;

    if (this.isOrganizationChoiceBoxVisible(orgChoiceMode)) {
      return this.renderOrganizationChoiceBox(orgChoiceMode);
    }

    if (this.state.getVerifyTotp !== undefined) {
      return this.state.getVerifyTotp();
    } else {
      return (
        <React.Fragment>
          {this.renderSignedInBox()}
          {this.renderForm(application)}
        </React.Fragment>
      );
    }
  }

  renderOrganizationChoiceBox(orgChoiceMode) {
    const renderChoiceBox = () => {
      switch (orgChoiceMode) {
      case "None":
        return null;
      case "Select":
        return (
          <div>
            <p style={{fontSize: "large"}}>
              {i18next.t("login:Please select an organization to sign in")}
            </p>
            <OrganizationSelect style={{width: "70%"}}
              onSelect={(value) => {
                Setting.goToLink(`/login/${value}?orgChoiceMode=None`);
              }} />
          </div>
        );
      case "Input":
        return (
          <div>
            <p style={{fontSize: "large"}}>
              {i18next.t("login:Please type an organization to sign in")}
            </p>
            <Form
              name="basic"
              onFinish={(values) => {Setting.goToLink(`/login/${values.organizationName}?orgChoiceMode=None`);}}
            >
              <Form.Item
                name="organizationName"
                rules={[{required: true, message: i18next.t("login:Please input your organization name!")}]}
              >
                <Input style={{width: "70%"}} onPressEnter={(e) => {
                  Setting.goToLink(`/login/${e.target.value}?orgChoiceMode=None`);
                }} />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                {i18next.t("general:Confirm")}
              </Button>
            </Form>
          </div>
        );
      default:
        return null;
      }
    };

    return (
      <div style={{height: 300, minWidth: 320}}>
        {renderChoiceBox()}
      </div>
    );
  }

  isOrganizationChoiceBoxVisible(orgChoiceMode) {
    if (this.state.orgChoiceMode === "None") {
      return false;
    }

    const path = this.props.match?.path;
    if (path === "/login" || path === "/login/:owner") {
      return orgChoiceMode === "Select" || orgChoiceMode === "Input";
    }

    return false;
  }

  renderBackButton() {
    if (this.state.orgChoiceMode === "None" || this.props.preview === "auto") {
      return (
        <Button className="back-inner-button" type="text" size="large" icon={<ArrowLeftOutlined />}
          onClick={() => history.back()}>
        </Button>
      );
    }
  }

  render() {
    const application = this.getApplicationObj();
    if (application === undefined) {
      return null;
    }
    if (application === null) {
      return Util.renderMessageLarge(this, this.state.msg);
    }

    if (this.state.samlResponse !== "") {
      return <RedirectForm samlResponse={this.state.samlResponse} redirectUrl={this.state.redirectUrl} relayState={this.state.relayState} />;
    }

    if (application.signinHtml !== "") {
      return (
        <div dangerouslySetInnerHTML={{__html: application.signinHtml}} />
      );
    }

    const visibleOAuthProviderItems = (application.providers === null) ? [] : application.providers.filter(providerItem => this.isProviderVisible(providerItem));
    if (this.props.preview !== "auto" && !Setting.isPasswordEnabled(application) && !Setting.isCodeSigninEnabled(application) && !Setting.isWebAuthnEnabled(application) && !Setting.isLdapEnabled(application) && visibleOAuthProviderItems.length === 1) {
      Setting.goToLink(Provider.getAuthUrl(application, visibleOAuthProviderItems[0].provider, "signup"));
      return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
          <Spin size="large" tip={i18next.t("login:Signing in...")} />
        </div>
      );
    }

    return (
      <React.Fragment>
        <CustomGithubCorner />
        <div className="login-content" style={{margin: this.props.preview ?? this.parseOffset(application.formOffset)}}>
          {Setting.inIframe() || Setting.isMobile() ? null : <div dangerouslySetInnerHTML={{__html: application.formCss}} />}
          {Setting.inIframe() || !Setting.isMobile() ? null : <div dangerouslySetInnerHTML={{__html: application.formCssMobile}} />}
          <div className="login-panel">
            <div className="side-image" style={{display: application.formOffset !== 4 ? "none" : null}}>
              <div dangerouslySetInnerHTML={{__html: application.formSideHtml}} />
            </div>
            <div className="login-form">
              <div>
                {
                  this.renderLoginPanel(application)
                }
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(LoginPage);
