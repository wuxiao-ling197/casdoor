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

import React from "react";
import {Button, Card, Col, Input, InputNumber, Row, Select} from "antd";
import * as CertBackend from "./backend/CertBackend";
import * as OrganizationBackend from "./backend/OrganizationBackend";
import * as Setting from "./Setting";
import i18next from "i18next";
import copy from "copy-to-clipboard";
import FileSaver from "file-saver";

const {Option} = Select;
const {TextArea} = Input;

class CertEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      certName: props.match.params.certName,
      owner: props.match.params.organizationName,
      cert: null,
      organizations: [],
      mode: props.location.mode !== undefined ? props.location.mode : "edit",
    };
  }

  UNSAFE_componentWillMount() {
    this.getCert();
    this.getOrganizations();
  }

  getCert() {
    CertBackend.getCert(this.state.owner, this.state.certName)
      .then((res) => {
        if (res.data === null) {
          this.props.history.push("/404");
          return;
        }

        if (res.status === "error") {
          Setting.showMessage("error", res.msg);
          return;
        }

        this.setState({
          cert: res.data,
        });
      });
  }

  getOrganizations() {
    OrganizationBackend.getOrganizations("admin")
      .then((res) => {
        this.setState({
          organizations: res.data || [],
        });
      });
  }

  parseCertField(key, value) {
    if (["port"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateCertField(key, value) {
    value = this.parseCertField(key, value);

    const cert = this.state.cert;
    cert[key] = value;
    this.setState({
      cert: cert,
    });
  }

  renderCert() {
    const editorWidth = Setting.isMobile() ? 22 : 9;
    return (
      <Card size="small" title={
        <div>
          {this.state.mode === "add" ? i18next.t("cert:New Cert") : i18next.t("cert:Edit Cert")}&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={() => this.submitCertEdit(false)}>{i18next.t("general:Save")}</Button>
          <Button style={{marginLeft: "20px"}} type="primary" onClick={() => this.submitCertEdit(true)}>{i18next.t("general:Save & Exit")}</Button>
          {this.state.mode === "add" ? <Button style={{marginLeft: "20px"}} onClick={() => this.deleteCert()}>{i18next.t("general:Cancel")}</Button> : null}
        </div>
      } style={(Setting.isMobile()) ? {margin: "5px"} : {}} type="inner">
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("general:Organization"), i18next.t("general:Organization - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} disabled={!Setting.isAdminUser(this.props.account)} value={this.state.cert.owner} onChange={(value => {this.updateCertField("owner", value);})}>
              {Setting.isAdminUser(this.props.account) ? <Option key={"admin"} value={"admin"}>{i18next.t("provider:admin (Shared)")}</Option> : null}
              {
                this.state.organizations.map((organization, index) => <Option key={index} value={organization.name}>{organization.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: "10px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("general:Name"), i18next.t("general:Name - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Input value={this.state.cert.name} onChange={e => {
              this.updateCertField("name", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("general:Display name"), i18next.t("general:Display name - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Input value={this.state.cert.displayName} onChange={e => {
              this.updateCertField("displayName", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("provider:Scope"), i18next.t("cert:Scope - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.cert.scope} onChange={(value => {
              this.updateCertField("scope", value);
            })}>
              {
                [
                  {id: "JWT", name: "JWT"},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("provider:Type"), i18next.t("cert:Type - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.cert.type} onChange={(value => {
              this.updateCertField("type", value);
            })}>
              {
                [
                  {id: "x509", name: "x509"},
                  {id: "Payment", name: "Payment"},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("cert:Crypto algorithm"), i18next.t("cert:Crypto algorithm - Tooltip"))} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.cert.cryptoAlgorithm} onChange={(value => {
              this.updateCertField("cryptoAlgorithm", value);

              if (value.startsWith("ES")) {
                this.updateCertField("bitSize", 0);
              } else {
                if (this.state.cert.bitSize !== 1024 && this.state.cert.bitSize !== 2048 && this.state.cert.bitSize !== 4096) {
                  this.updateCertField("bitSize", 2048);
                }
              }

              this.updateCertField("certificate", "");
              this.updateCertField("privateKey", "");
            })}>
              {
                [
                  {id: "RS256", name: "RS256 (RSA + SHA256)"},
                  {id: "RS384", name: "RS384 (RSA + SHA384)"},
                  {id: "RS512", name: "RS512 (RSA + SHA512)"},
                  {id: "ES256", name: "ES256 (ECDSA using P-256 + SHA256)"},
                  {id: "ES384", name: "ES384 (ECDSA using P-384 + SHA384)"},
                  {id: "ES512", name: "ES512 (ECDSA using P-521 + SHA512)"},
                  {id: "PS256", name: "PS256 (RSASSA-PSS using SHA256 and MGF1 with SHA256)"},
                  {id: "PS384", name: "PS384 (RSASSA-PSS using SHA384 and MGF1 with SHA384)"},
                  {id: "PS512", name: "PS512 (RSASSA-PSS using SHA512 and MGF1 with SHA512)"},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        {
          this.state.cert.cryptoAlgorithm.startsWith("ES") ? null : (
            <Row style={{marginTop: "20px"}} >
              <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
                {Setting.getLabel(i18next.t("cert:Bit size"), i18next.t("cert:Bit size - Tooltip"))} :
              </Col>
              <Col span={22} >
                <Select virtual={false} style={{width: "100%"}} value={this.state.cert.bitSize} onChange={(value => {
                  this.updateCertField("bitSize", value);
                  this.updateCertField("certificate", "");
                  this.updateCertField("privateKey", "");
                })}>
                  {
                    Setting.getCryptoAlgorithmOptions(this.state.cert.cryptoAlgorithm).map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
                  }
                </Select>
              </Col>
            </Row>
          )
        }
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("cert:Expire in years"), i18next.t("cert:Expire in years - Tooltip"))} :
          </Col>
          <Col span={22} >
            <InputNumber value={this.state.cert.expireInYears} onChange={value => {
              this.updateCertField("expireInYears", value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("cert:Certificate"), i18next.t("cert:Certificate - Tooltip"))} :
          </Col>
          <Col span={editorWidth} >
            <Button style={{marginRight: "10px", marginBottom: "10px"}} disabled={this.state.cert.certificate === ""} onClick={() => {
              copy(this.state.cert.certificate);
              Setting.showMessage("success", i18next.t("general:Copied to clipboard successfully"));
            }}
            >
              {i18next.t("cert:Copy certificate")}
            </Button>
            <Button type="primary" disabled={this.state.cert.certificate === ""} onClick={() => {
              const blob = new Blob([this.state.cert.certificate], {type: "text/plain;charset=utf-8"});
              FileSaver.saveAs(blob, "token_jwt_key.pem");
            }}
            >
              {i18next.t("cert:Download certificate")}
            </Button>
            <TextArea autoSize={{minRows: 30, maxRows: 30}} value={this.state.cert.certificate} onChange={e => {
              this.updateCertField("certificate", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {Setting.getLabel(i18next.t("cert:Private key"), i18next.t("cert:Private key - Tooltip"))} :
          </Col>
          <Col span={editorWidth} >
            <Button style={{marginRight: "10px", marginBottom: "10px"}} disabled={this.state.cert.privateKey === ""} onClick={() => {
              copy(this.state.cert.privateKey);
              Setting.showMessage("success", i18next.t("general:Copied to clipboard successfully"));
            }}
            >
              {i18next.t("cert:Copy private key")}
            </Button>
            <Button type="primary" disabled={this.state.cert.privateKey === ""} onClick={() => {
              const blob = new Blob([this.state.cert.privateKey], {type: "text/plain;charset=utf-8"});
              FileSaver.saveAs(blob, "token_jwt_key.key");
            }}
            >
              {i18next.t("cert:Download private key")}
            </Button>
            <TextArea autoSize={{minRows: 30, maxRows: 30}} value={this.state.cert.privateKey} onChange={e => {
              this.updateCertField("privateKey", e.target.value);
            }} />
          </Col>
        </Row>
      </Card>
    );
  }

  submitCertEdit(exitAfterSave) {
    const cert = Setting.deepCopy(this.state.cert);
    CertBackend.updateCert(this.state.owner, this.state.certName, cert)
      .then((res) => {
        if (res.status === "ok") {
          Setting.showMessage("success", i18next.t("general:Successfully saved"));
          this.setState({
            certName: this.state.cert.name,
          });

          if (exitAfterSave) {
            this.props.history.push("/certs");
          } else {
            this.props.history.push(`/certs/${this.state.cert.owner}/${this.state.cert.name}`);
            this.getCert();
          }
        } else {
          Setting.showMessage("error", `${i18next.t("general:Failed to save")}: ${res.msg}`);
          this.updateCertField("name", this.state.certName);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `${i18next.t("general:Failed to connect to server")}: ${error}`);
      });
  }

  deleteCert() {
    CertBackend.deleteCert(this.state.cert)
      .then((res) => {
        if (res.status === "ok") {
          this.props.history.push("/certs");
        } else {
          Setting.showMessage("error", `${i18next.t("general:Failed to delete")}: ${res.msg}`);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `${i18next.t("general:Failed to connect to server")}: ${error}`);
      });
  }

  render() {
    return (
      <div>
        {
          this.state.cert !== null ? this.renderCert() : null
        }
        <div style={{marginTop: "20px", marginLeft: "40px"}}>
          <Button size="large" onClick={() => this.submitCertEdit(false)}>{i18next.t("general:Save")}</Button>
          <Button style={{marginLeft: "20px"}} type="primary" size="large" onClick={() => this.submitCertEdit(true)}>{i18next.t("general:Save & Exit")}</Button>
          {this.state.mode === "add" ? <Button style={{marginLeft: "20px"}} size="large" onClick={() => this.deleteCert()}>{i18next.t("general:Cancel")}</Button> : null}
        </div>
      </div>
    );
  }
}

export default CertEditPage;
