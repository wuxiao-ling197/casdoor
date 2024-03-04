package object

import (
	"fmt"
)

type ResUsers struct {
	Id                  string `xorm:"not null default 'nextval(res_users_id_seq::' int4 'id'"`
	CompanyId           string `xorm:"not null int4 'company_id'"`
	PartnerId           string `xorm:"not null int4 'partner_id'"`
	Active              bool   `xorm:"default 'true' bool 'active'"`
	CreateDate          string `xorm:"timestamp(6) 'create_date'"`
	Login               string `xorm:"not null varchar 'login'"`
	Password            string `xorm:"varchar 'password'"`
	ActionId            int    `xorm:"int4 'action_id'"`
	CreateUid           int    `xorm:"int4 'create_uid'"`
	WriteUid            int    `xorm:"int4 'write_uid'"`
	Signature           string `xorm:"text 'signature'"`
	Share               bool   `xorm:"bool 'share'"`
	WriteDate           string `xorm:"timestamp(6) 'write_date'"`
	TotpSecret          string `xorm:"varchar 'totp_secret'"`
	NotificationType    string `xorm:"not null varchar 'notification_type'"`
	OdoobotState        string `xorm:"varchar 'odoobot_state'"`
	OdoobotFailed       bool   `xorm:"bool 'odoobot_failed'"`
	SaleTeamId          int    `xorm:"int4 'sale_team_id'"`
	TargetSalesWon      int    `xorm:"int4 'target_sales_won'"`
	TargetSalesDone     int    `xorm:"int4 'target_sales_done'"`
	Karma               int    `xorm:"int4 'karma'"`
	RankId              int    `xorm:"int4 'rank_id'"`
	NextRankId          int    `xorm:"int4 'next_rank_id'"`
	TargetSalesInvoiced int    `xorm:"int4 'target_sales_invoiced'"`
}

type HrEmployee struct {
	Id                          string `xorm:"not null default 'nextval(hr_employee_id_seq::' int4 'id'"`
	UserId                      int    `xorm:"int4 'user_id'"`
	ResourceId                  string `xorm:"not null int4 'resource_id'"`
	CompanyId                   string `xorm:"not null int4 'company_id'"`
	ResourceCalendarId          int    `xorm:"int4 'resource_calendar_id'"`
	MessageMainAttachmentId     int    `xorm:"int4 'message_main_attachment_id'"`
	Color                       int    `xorm:"int4 'color'"`
	DepartmentId                int    `xorm:"int4 'department_id'"`
	JobId                       int    `xorm:"int4 'job_id'"`
	AddressId                   int    `xorm:"int4 'address_id'"`
	WorkContactId               int    `xorm:"int4 'work_contact_id'"`
	WorkLocationId              int    `xorm:"int4 'work_location_id'"`
	ParentId                    int    `xorm:"int4 'parent_id'"`
	CoachId                     int    `xorm:"int4 'coach_id'"`
	PrivateStateId              int    `xorm:"int4 'private_state_id'"`
	PrivateCountryId            int    `xorm:"int4 'private_country_id'"`
	CountryId                   int    `xorm:"int4 'country_id'"`
	Children                    int    `xorm:"int4 'children'"`
	CountryOfBirth              int    `xorm:"int4 'country_of_birth'"`
	BankAccountId               int    `xorm:"int4 'bank_account_id'"`
	KmHomeWork                  int    `xorm:"int4 'km_home_work'"`
	DepartureReasonId           int    `xorm:"int4 'departure_reason_id'"`
	CreateUid                   int    `xorm:"int4 'create_uid'"`
	WriteUid                    int    `xorm:"int4 'write_uid'"`
	Name                        string `xorm:"varchar 'name'"`
	JobTitle                    string `xorm:"varchar 'job_title'"`
	WorkPhone                   string `xorm:"varchar 'work_phone'"`
	MobilePhone                 string `xorm:"varchar 'mobile_phone'"`
	WorkEmail                   string `xorm:"varchar 'work_email'"`
	PrivateStreet               string `xorm:"varchar 'private_street'"`
	PrivateStreet2              string `xorm:"varchar 'private_street2'"`
	PrivateCity                 string `xorm:"varchar 'private_city'"`
	PrivateZip                  string `xorm:"varchar 'private_zip'"`
	PrivatePhone                string `xorm:"varchar 'private_phone'"`
	PrivateEmail                string `xorm:"varchar 'private_email'"`
	Lang                        string `xorm:"varchar 'lang'"`
	Gender                      string `xorm:"varchar 'gender'"`
	Marital                     string `xorm:"varchar 'marital'"`
	SpouseCompleteName          string `xorm:"varchar 'spouse_complete_name'"`
	PlaceOfBirth                string `xorm:"varchar 'place_of_birth'"`
	Ssnid                       string `xorm:"varchar 'ssnid'"`
	Sinid                       string `xorm:"varchar 'sinid'"`
	IdentificationId            string `xorm:"varchar 'identification_id'"`
	PassportId                  string `xorm:"varchar 'passport_id'"`
	PermitNo                    string `xorm:"varchar 'permit_no'"`
	VisaNo                      string `xorm:"varchar 'visa_no'"`
	Certificate                 string `xorm:"varchar 'certificate'"`
	StudyField                  string `xorm:"varchar 'study_field'"`
	StudySchool                 string `xorm:"varchar 'study_school'"`
	EmergencyContact            string `xorm:"varchar 'emergency_contact'"`
	EmergencyPhone              string `xorm:"varchar 'emergency_phone'"`
	EmployeeType                string `xorm:"not null varchar 'employee_type'"`
	Barcode                     string `xorm:"varchar 'barcode'"`
	Pin                         string `xorm:"varchar 'pin'"`
	PrivateCarPlate             string `xorm:"varchar 'private_car_plate'"`
	SpouseBirthdate             string `xorm:"date 'spouse_birthdate'"`
	Birthday                    string `xorm:"date 'birthday'"`
	VisaExpire                  string `xorm:"date 'visa_expire'"`
	WorkPermitExpirationDate    string `xorm:"date 'work_permit_expiration_date'"`
	DepartureDate               string `xorm:"date 'departure_date'"`
	EmployeeProperties          string `xorm:"jsonb 'employee_properties'"`
	AdditionalNote              string `xorm:"text 'additional_note'"`
	Notes                       string `xorm:"text 'notes'"`
	DepartureDescription        string `xorm:"text 'departure_description'"`
	Active                      bool   `xorm:"bool 'active'"`
	WorkPermitScheduledActivity bool   `xorm:"bool 'work_permit_scheduled_activity'"`
	CreateDate                  string `xorm:"timestamp(6) 'create_date'"`
	WriteDate                   string `xorm:"timestamp(6) 'write_date'"`
	LeaveManagerId              int    `xorm:"int4 'leave_manager_id'"`
	AttendanceManagerId         int    `xorm:"int4 'attendance_manager_id'"`
	LastAttendanceId            int    `xorm:"int4 'last_attendance_id'"`
	LastCheckIn                 string `xorm:"timestamp(6) 'last_check_in'"`
	LastCheckOut                string `xorm:"timestamp(6) 'last_check_out'"`
	ContractId                  int    `xorm:"int4 'contract_id'"`
	Vehicle                     string `xorm:"varchar 'vehicle'"`
	FirstContractDate           string `xorm:"date 'first_contract_date'"`
	ContractWarning             bool   `xorm:"bool 'contract_warning'"`
}

type ResGroups struct {
	Id         string `xorm:"not null default 'nextval(res_groups_id_seq::' int4 'id'"`
	Name       string `xorm:"not null jsonb 'name'"`
	CategoryId int    `xorm:"int4 'category_id'"`
	Color      int    `xorm:"int4 'color'"`
	CreateUid  int    `xorm:"int4 'create_uid'"`
	WriteUid   int    `xorm:"int4 'write_uid'"`
	Comment    string `xorm:"jsonb 'comment'"`
	Share      bool   `xorm:"bool 'share'"`
	CreateDate string `xorm:"timestamp(6) 'create_date'"`
	WriteDate  string `xorm:"timestamp(6) 'write_date'"`
}

type ResCompany struct {
	Id                                          string  `xorm:"not null default 'nextval(res_company_id_seq::' int4 'id'"`
	Name                                        string  `xorm:"not null varchar 'name'"`
	PartnerId                                   string  `xorm:"not null int4 'partner_id'"`
	CurrencyId                                  string  `xorm:"not null int4 'currency_id'"`
	Sequence                                    int     `xorm:"int4 'sequence'"`
	CreateDate                                  string  `xorm:"timestamp(6) 'create_date'"`
	ParentPath                                  string  `xorm:"varchar 'parent_path'"`
	ParentId                                    int     `xorm:"int4 'parent_id'"`
	PaperformatId                               int     `xorm:"int4 'paperformat_id'"`
	ExternalReportLayoutId                      int     `xorm:"int4 'external_report_layout_id'"`
	CreateUid                                   int     `xorm:"int4 'create_uid'"`
	WriteUid                                    int     `xorm:"int4 'write_uid'"`
	Email                                       string  `xorm:"varchar 'email'"`
	Phone                                       string  `xorm:"varchar 'phone'"`
	Mobile                                      string  `xorm:"varchar 'mobile'"`
	Font                                        string  `xorm:"varchar 'font'"`
	PrimaryColor                                string  `xorm:"pk varchar 'primary_color'"`
	SecondaryColor                              string  `xorm:"varchar 'secondary_color'"`
	LayoutBackground                            string  `xorm:"not null varchar 'layout_background'"`
	ReportHeader                                string  `xorm:"jsonb 'report_header'"`
	ReportFooter                                string  `xorm:"jsonb 'report_footer'"`
	CompanyDetails                              string  `xorm:"jsonb 'company_details'"`
	Active                                      bool    `xorm:"bool 'active'"`
	UsesDefaultLogo                             bool    `xorm:"bool 'uses_default_logo'"`
	WriteDate                                   string  `xorm:"timestamp(6) 'write_date'"`
	LogoWeb                                     byte    `xorm:"bytea 'logo_web'"`
	ResourceCalendarId                          int     `xorm:"int4 'resource_calendar_id'"`
	AliasDomainId                               int     `xorm:"int4 'alias_domain_id'"`
	AliasDomainName                             string  `xorm:"varchar 'alias_domain_name'"`
	EmailPrimaryColor                           string  `xorm:"pk varchar 'email_primary_color'"`
	EmailSecondaryColor                         string  `xorm:"varchar 'email_secondary_color'"`
	PartnerGid                                  int     `xorm:"int4 'partner_gid'"`
	IapEnrichAutoDone                           bool    `xorm:"bool 'iap_enrich_auto_done'"`
	SnailmailColor                              bool    `xorm:"bool 'snailmail_color'"`
	SnailmailCover                              bool    `xorm:"bool 'snailmail_cover'"`
	SnailmailDuplex                             bool    `xorm:"bool 'snailmail_duplex'"`
	SocialTwitter                               string  `xorm:"varchar 'social_twitter'"`
	SocialFacebook                              string  `xorm:"varchar 'social_facebook'"`
	SocialGithub                                string  `xorm:"varchar 'social_github'"`
	SocialLinkedin                              string  `xorm:"varchar 'social_linkedin'"`
	SocialYoutube                               string  `xorm:"varchar 'social_youtube'"`
	SocialInstagram                             string  `xorm:"varchar 'social_instagram'"`
	SocialTiktok                                string  `xorm:"varchar 'social_tiktok'"`
	HrPresenceControlEmailAmount                int     `xorm:"int4 'hr_presence_control_email_amount'"`
	HrPresenceControlIpList                     string  `xorm:"varchar 'hr_presence_control_ip_list'"`
	EmployeePropertiesDefinition                string  `xorm:"jsonb 'employee_properties_definition'"`
	PaymentOnboardingPaymentMethod              string  `xorm:"varchar 'payment_onboarding_payment_method'"`
	FiscalyearLastDay                           int     `xorm:"not null int4 'fiscalyear_last_day'"`
	TransferAccountId                           int     `xorm:"int4 'transfer_account_id'"`
	DefaultCashDifferenceIncomeAccountId        int     `xorm:"int4 'default_cash_difference_income_account_id'"`
	DefaultCashDifferenceExpenseAccountId       int     `xorm:"int4 'default_cash_difference_expense_account_id'"`
	AccountJournalSuspenseAccountId             int     `xorm:"int4 'account_journal_suspense_account_id'"`
	AccountJournalPaymentDebitAccountId         int     `xorm:"int4 'account_journal_payment_debit_account_id'"`
	AccountJournalPaymentCreditAccountId        int     `xorm:"int4 'account_journal_payment_credit_account_id'"`
	AccountJournalEarlyPayDiscountGainAccountId int     `xorm:"int4 'account_journal_early_pay_discount_gain_account_id'"`
	AccountJournalEarlyPayDiscountLossAccountId int     `xorm:"int4 'account_journal_early_pay_discount_loss_account_id'"`
	AccountSaleTaxId                            int     `xorm:"int4 'account_sale_tax_id'"`
	AccountPurchaseTaxId                        int     `xorm:"int4 'account_purchase_tax_id'"`
	CurrencyExchangeJournalId                   int     `xorm:"int4 'currency_exchange_journal_id'"`
	IncomeCurrencyExchangeAccountId             int     `xorm:"int4 'income_currency_exchange_account_id'"`
	ExpenseCurrencyExchangeAccountId            int     `xorm:"int4 'expense_currency_exchange_account_id'"`
	IncotermId                                  int     `xorm:"int4 'incoterm_id'"`
	AccountOpeningMoveId                        int     `xorm:"int4 'account_opening_move_id'"`
	AccountDefaultPosReceivableAccountId        int     `xorm:"int4 'account_default_pos_receivable_account_id'"`
	ExpenseAccrualAccountId                     int     `xorm:"int4 'expense_accrual_account_id'"`
	RevenueAccrualAccountId                     int     `xorm:"int4 'revenue_accrual_account_id'"`
	AutomaticEntryDefaultJournalId              int     `xorm:"int4 'automatic_entry_default_journal_id'"`
	AccountFiscalCountryId                      int     `xorm:"int4 'account_fiscal_country_id'"`
	TaxCashBasisJournalId                       int     `xorm:"int4 'tax_cash_basis_journal_id'"`
	AccountCashBasisBaseAccountId               int     `xorm:"int4 'account_cash_basis_base_account_id'"`
	AccountDiscountIncomeAllocationId           int     `xorm:"int4 'account_discount_income_allocation_id'"`
	AccountDiscountExpenseAllocationId          int     `xorm:"int4 'account_discount_expense_allocation_id'"`
	FiscalyearLastMonth                         string  `xorm:"not null varchar 'fiscalyear_last_month'"`
	ChartTemplate                               string  `xorm:"varchar 'chart_template'"`
	BankAccountCodePrefix                       string  `xorm:"varchar 'bank_account_code_prefix'"`
	CashAccountCodePrefix                       string  `xorm:"varchar 'cash_account_code_prefix'"`
	TransferAccountCodePrefix                   string  `xorm:"varchar 'transfer_account_code_prefix'"`
	TaxCalculationRoundingMethod                string  `xorm:"varchar 'tax_calculation_rounding_method'"`
	TermsType                                   string  `xorm:"varchar 'terms_type'"`
	QuickEditMode                               string  `xorm:"varchar 'quick_edit_mode'"`
	PeriodLockDate                              string  `xorm:"date 'period_lock_date'"`
	FiscalyearLockDate                          string  `xorm:"date 'fiscalyear_lock_date'"`
	TaxLockDate                                 string  `xorm:"date 'tax_lock_date'"`
	AccountOpeningDate                          string  `xorm:"not null date 'account_opening_date'"`
	InvoiceTerms                                string  `xorm:"jsonb 'invoice_terms'"`
	InvoiceTermsHtml                            string  `xorm:"jsonb 'invoice_terms_html'"`
	ExpectsChartOfAccounts                      bool    `xorm:"bool 'expects_chart_of_accounts'"`
	AngloSaxonAccounting                        bool    `xorm:"bool 'anglo_saxon_accounting'"`
	QrCode                                      bool    `xorm:"bool 'qr_code'"`
	InvoiceIsEmail                              bool    `xorm:"bool 'invoice_is_email'"`
	InvoiceIsDownload                           bool    `xorm:"bool 'invoice_is_download'"`
	DisplayInvoiceAmountTotalWords              bool    `xorm:"bool 'display_invoice_amount_total_words'"`
	AccountUseCreditLimit                       bool    `xorm:"bool 'account_use_credit_limit'"`
	TaxExigibility                              bool    `xorm:"bool 'tax_exigibility'"`
	AccountStorno                               bool    `xorm:"bool 'account_storno'"`
	InvoiceIsUblCii                             bool    `xorm:"bool 'invoice_is_ubl_cii'"`
	InvoiceIsSnailmail                          bool    `xorm:"bool 'invoice_is_snailmail'"`
	QuotationValidityDays                       int     `xorm:"int4 'quotation_validity_days'"`
	SaleDiscountProductId                       int     `xorm:"int4 'sale_discount_product_id'"`
	SaleDownPaymentProductId                    int     `xorm:"int4 'sale_down_payment_product_id'"`
	SaleOnboardingPaymentMethod                 string  `xorm:"varchar 'sale_onboarding_payment_method'"`
	PortalConfirmationSign                      bool    `xorm:"bool 'portal_confirmation_sign'"`
	PortalConfirmationPay                       bool    `xorm:"bool 'portal_confirmation_pay'"`
	PrepaymentPercent                           float32 `xorm:"float8 'prepayment_percent'"`
	SaleOrderTemplateId                         int     `xorm:"int4 'sale_order_template_id'"`
	SaleHeaderName                              string  `xorm:"varchar 'sale_header_name'"`
	SaleFooterName                              string  `xorm:"varchar 'sale_footer_name'"`
	NomenclatureId                              int     `xorm:"int4 'nomenclature_id'"`
	OvertimeCompanyThreshold                    int     `xorm:"int4 'overtime_company_threshold'"`
	OvertimeEmployeeThreshold                   int     `xorm:"int4 'overtime_employee_threshold'"`
	AttendanceKioskDelay                        int     `xorm:"int4 'attendance_kiosk_delay'"`
	AttendanceKioskMode                         string  `xorm:"varchar 'attendance_kiosk_mode'"`
	AttendanceBarcodeSource                     string  `xorm:"varchar 'attendance_barcode_source'"`
	AttendanceKioskKey                          string  `xorm:"varchar 'attendance_kiosk_key'"`
	OvertimeStartDate                           string  `xorm:"date 'overtime_start_date'"`
	HrAttendanceOvertime                        bool    `xorm:"bool 'hr_attendance_overtime'"`
	HrAttendanceDisplayOvertime                 bool    `xorm:"bool 'hr_attendance_display_overtime'"`
	AttendanceKioskUsePin                       bool    `xorm:"bool 'attendance_kiosk_use_pin'"`
	AttendanceFromSystray                       bool    `xorm:"bool 'attendance_from_systray'"`
	ContractExpirationNoticePeriod              int     `xorm:"int4 'contract_expiration_notice_period'"`
	WorkPermitExpirationNoticePeriod            int     `xorm:"int4 'work_permit_expiration_notice_period'"`
}

var user ResUsers

func GetOdooUserCount() int64 {
	ConnectOdoo()
	total, err := engine.Where("id>?", 0).Count(user)
	if err != nil {
		return 0
	}
	return total
}

func GetOdooUserByLogin(login string) *ResUsers {
	users := new(ResUsers)
	company := new(ResCompany)
	//users, err := engine.Asc("id").Find(&users, &ResUsers{Login: login})
	has, err := engine.Where("login=?", login).Get(users)
	yes, err := engine.Where("id=?", users.CompanyId).Get(company)
	if err != nil {
		return nil
	}
	fmt.Println(has)
	fmt.Println(yes)
	fmt.Printf("by Login: %v\n", users)
	fmt.Printf("company: %v\n", company.Name)
	return users
}

func GetOdooUserById(id int) *ResUsers {
	odoouser := new(ResUsers)
	//str, _ := engine.ID(id).Get(odoouser)

	has, _ := engine.Where("id=?", id).Get(odoouser)

	if err != nil {
		fmt.Println(err)
	}
	//fmt.Println(str)
	fmt.Println(has)
	fmt.Printf("by id: %v\n", odoouser.Login)
	fmt.Printf("Login: %v\n", odoouser)
	return odoouser
}
