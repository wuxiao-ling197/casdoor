package object

import (
	"database/sql"
	"fmt"
	"github.com/xorm-io/xorm"
)

type ResCompany struct {
	Id                                          string         `xorm:"not null default 'nextval(res_company_id_seq::' int4 'id'"`
	Name                                        string         `xorm:"not null varchar 'name'"`
	PartnerId                                   string         `xorm:"not null int4 'partner_id'"`
	CurrencyId                                  string         `xorm:"not null int4 'currency_id'"`
	Sequence                                    sql.NullString `xorm:"int4 'sequence'"`
	CreateDate                                  sql.NullString `xorm:"timestamp(6) 'create_date'"`
	ParentPath                                  sql.NullString `xorm:"varchar 'parent_path'"`
	ParentId                                    sql.NullString `xorm:"int4 'parent_id'"`
	PaperformatId                               sql.NullString `xorm:"int4 'paperformat_id'"`
	ExternalReportLayoutId                      sql.NullString `xorm:"int4 'external_report_layout_id'"`
	CreateUid                                   sql.NullString `xorm:"int4 'create_uid'"`
	WriteUid                                    sql.NullString `xorm:"int4 'write_uid'"`
	Email                                       sql.NullString `xorm:"varchar 'email'"`
	Phone                                       sql.NullString `xorm:"varchar 'phone'"`
	Mobile                                      sql.NullString `xorm:"varchar 'mobile'"`
	Font                                        sql.NullString `xorm:"varchar 'font'"`
	PrimaryColor                                sql.NullString `xorm:"pk varchar 'primary_color'"`
	SecondaryColor                              sql.NullString `xorm:"varchar 'secondary_color'"`
	LayoutBackground                            string         `xorm:"not null varchar 'layout_background'"`
	ReportHeader                                sql.NullString `xorm:"jsonb 'report_header'"`
	ReportFooter                                sql.NullString `xorm:"jsonb 'report_footer'"`
	CompanyDetails                              sql.NullString `xorm:"jsonb 'company_details'"`
	Active                                      sql.NullBool   `xorm:"bool 'active'"`
	UsesDefaultLogo                             sql.NullBool   `xorm:"bool 'uses_default_logo'"`
	WriteDate                                   sql.NullString `xorm:"timestamp(6) 'write_date'"`
	LogoWeb                                     sql.NullString `xorm:"bytea 'logo_web'"`
	ResourceCalendarId                          sql.NullString `xorm:"int4 'resource_calendar_id'"`
	AliasDomainId                               sql.NullString `xorm:"int4 'alias_domain_id'"`
	AliasDomainName                             sql.NullString `xorm:"varchar 'alias_domain_name'"`
	EmailPrimaryColor                           sql.NullString `xorm:"pk varchar 'email_primary_color'"`
	EmailSecondaryColor                         sql.NullString `xorm:"varchar 'email_secondary_color'"`
	PartnerGid                                  sql.NullString `xorm:"int4 'partner_gid'"`
	IapEnrichAutoDone                           sql.NullBool   `xorm:"bool 'iap_enrich_auto_done'"`
	SnailmailColor                              sql.NullBool   `xorm:"bool 'snailmail_color'"`
	SnailmailCover                              sql.NullBool   `xorm:"bool 'snailmail_cover'"`
	SnailmailDuplex                             sql.NullBool   `xorm:"bool 'snailmail_duplex'"`
	SocialTwitter                               sql.NullString `xorm:"varchar 'social_twitter'"`
	SocialFacebook                              sql.NullString `xorm:"varchar 'social_facebook'"`
	SocialGithub                                sql.NullString `xorm:"varchar 'social_github'"`
	SocialLinkedin                              sql.NullString `xorm:"varchar 'social_linkedin'"`
	SocialYoutube                               sql.NullString `xorm:"varchar 'social_youtube'"`
	SocialInstagram                             sql.NullString `xorm:"varchar 'social_instagram'"`
	SocialTiktok                                sql.NullString `xorm:"varchar 'social_tiktok'"`
	HrPresenceControlEmailAmount                sql.NullString `xorm:"int4 'hr_presence_control_email_amount'"`
	HrPresenceControlIpList                     sql.NullString `xorm:"varchar 'hr_presence_control_ip_list'"`
	EmployeePropertiesDefinition                sql.NullString `xorm:"jsonb 'employee_properties_definition'"`
	PaymentOnboardingPaymentMethod              sql.NullString `xorm:"varchar 'payment_onboarding_payment_method'"`
	FiscalyearLastDay                           string         `xorm:"not null int4 'fiscalyear_last_day'"`
	TransferAccountId                           sql.NullString `xorm:"int4 'transfer_account_id'"`
	DefaultCashDifferenceIncomeAccountId        sql.NullString `xorm:"int4 'default_cash_difference_income_account_id'"`
	DefaultCashDifferenceExpenseAccountId       sql.NullString `xorm:"int4 'default_cash_difference_expense_account_id'"`
	AccountJournalSuspenseAccountId             sql.NullString `xorm:"int4 'account_journal_suspense_account_id'"`
	AccountJournalPaymentDebitAccountId         sql.NullString `xorm:"int4 'account_journal_payment_debit_account_id'"`
	AccountJournalPaymentCreditAccountId        sql.NullString `xorm:"int4 'account_journal_payment_credit_account_id'"`
	AccountJournalEarlyPayDiscountGainAccountId sql.NullString `xorm:"int4 'account_journal_early_pay_discount_gain_account_id'"`
	AccountJournalEarlyPayDiscountLossAccountId sql.NullString `xorm:"int4 'account_journal_early_pay_discount_loss_account_id'"`
	AccountSaleTaxId                            sql.NullString `xorm:"int4 'account_sale_tax_id'"`
	AccountPurchaseTaxId                        sql.NullString `xorm:"int4 'account_purchase_tax_id'"`
	CurrencyExchangeJournalId                   sql.NullString `xorm:"int4 'currency_exchange_journal_id'"`
	IncomeCurrencyExchangeAccountId             sql.NullString `xorm:"int4 'income_currency_exchange_account_id'"`
	ExpenseCurrencyExchangeAccountId            sql.NullString `xorm:"int4 'expense_currency_exchange_account_id'"`
	IncotermId                                  sql.NullString `xorm:"int4 'incoterm_id'"`
	AccountOpeningMoveId                        sql.NullString `xorm:"int4 'account_opening_move_id'"`
	AccountDefaultPosReceivableAccountId        sql.NullString `xorm:"int4 'account_default_pos_receivable_account_id'"`
	ExpenseAccrualAccountId                     sql.NullString `xorm:"int4 'expense_accrual_account_id'"`
	RevenueAccrualAccountId                     sql.NullString `xorm:"int4 'revenue_accrual_account_id'"`
	AutomaticEntryDefaultJournalId              sql.NullString `xorm:"int4 'automatic_entry_default_journal_id'"`
	AccountFiscalCountryId                      sql.NullString `xorm:"int4 'account_fiscal_country_id'"`
	TaxCashBasisJournalId                       sql.NullString `xorm:"int4 'tax_cash_basis_journal_id'"`
	AccountCashBasisBaseAccountId               sql.NullString `xorm:"int4 'account_cash_basis_base_account_id'"`
	AccountDiscountIncomeAllocationId           sql.NullString `xorm:"int4 'account_discount_income_allocation_id'"`
	AccountDiscountExpenseAllocationId          sql.NullString `xorm:"int4 'account_discount_expense_allocation_id'"`
	FiscalyearLastMonth                         string         `xorm:"not null varchar 'fiscalyear_last_month'"`
	ChartTemplate                               sql.NullString `xorm:"varchar 'chart_template'"`
	BankAccountCodePrefix                       sql.NullString `xorm:"varchar 'bank_account_code_prefix'"`
	CashAccountCodePrefix                       sql.NullString `xorm:"varchar 'cash_account_code_prefix'"`
	TransferAccountCodePrefix                   sql.NullString `xorm:"varchar 'transfer_account_code_prefix'"`
	TaxCalculationRoundingMethod                sql.NullString `xorm:"varchar 'tax_calculation_rounding_method'"`
	TermsType                                   sql.NullString `xorm:"varchar 'terms_type'"`
	QuickEditMode                               sql.NullString `xorm:"varchar 'quick_edit_mode'"`
	PeriodLockDate                              sql.NullString `xorm:"date 'period_lock_date'"`
	FiscalyearLockDate                          sql.NullString `xorm:"date 'fiscalyear_lock_date'"`
	TaxLockDate                                 sql.NullString `xorm:"date 'tax_lock_date'"`
	AccountOpeningDate                          string         `xorm:"not null date 'account_opening_date'"`
	InvoiceTerms                                sql.NullString `xorm:"jsonb 'invoice_terms'"`
	InvoiceTermsHtml                            sql.NullString `xorm:"jsonb 'invoice_terms_html'"`
	ExpectsChartOfAccounts                      sql.NullBool   `xorm:"bool 'expects_chart_of_accounts'"`
	AngloSaxonAccounting                        sql.NullBool   `xorm:"bool 'anglo_saxon_accounting'"`
	QrCode                                      sql.NullBool   `xorm:"bool 'qr_code'"`
	InvoiceIsEmail                              sql.NullBool   `xorm:"bool 'invoice_is_email'"`
	InvoiceIsDownload                           sql.NullBool   `xorm:"bool 'invoice_is_download'"`
	DisplayInvoiceAmountTotalWords              sql.NullBool   `xorm:"bool 'display_invoice_amount_total_words'"`
	AccountUseCreditLimit                       sql.NullBool   `xorm:"bool 'account_use_credit_limit'"`
	TaxExigibility                              sql.NullBool   `xorm:"bool 'tax_exigibility'"`
	AccountStorno                               sql.NullBool   `xorm:"bool 'account_storno'"`
	InvoiceIsUblCii                             sql.NullBool   `xorm:"bool 'invoice_is_ubl_cii'"`
	InvoiceIsSnailmail                          sql.NullBool   `xorm:"bool 'invoice_is_snailmail'"`
	QuotationValidityDays                       sql.NullString `xorm:"int4 'quotation_validity_days'"`
	SaleDiscountProductId                       sql.NullString `xorm:"int4 'sale_discount_product_id'"`
	SaleDownPaymentProductId                    sql.NullString `xorm:"int4 'sale_down_payment_product_id'"`
	SaleOnboardingPaymentMethod                 sql.NullString `xorm:"varchar 'sale_onboarding_payment_method'"`
	PortalConfirmationSign                      sql.NullBool   `xorm:"bool 'portal_confirmation_sign'"`
	PortalConfirmationPay                       sql.NullBool   `xorm:"bool 'portal_confirmation_pay'"`
	PrepaymentPercent                           sql.NullString `xorm:"float8 'prepayment_percent'"`
	SaleOrderTemplateId                         sql.NullString `xorm:"int4 'sale_order_template_id'"`
	SaleHeaderName                              sql.NullString `xorm:"varchar 'sale_header_name'"`
	SaleFooterName                              sql.NullString `xorm:"varchar 'sale_footer_name'"`
	NomenclatureId                              sql.NullString `xorm:"int4 'nomenclature_id'"`
	OvertimeCompanyThreshold                    sql.NullString `xorm:"int4 'overtime_company_threshold'"`
	OvertimeEmployeeThreshold                   sql.NullString `xorm:"int4 'overtime_employee_threshold'"`
	AttendanceKioskDelay                        sql.NullString `xorm:"int4 'attendance_kiosk_delay'"`
	AttendanceKioskMode                         sql.NullString `xorm:"varchar 'attendance_kiosk_mode'"`
	AttendanceBarcodeSource                     sql.NullString `xorm:"varchar 'attendance_barcode_source'"`
	AttendanceKioskKey                          sql.NullString `xorm:"varchar 'attendance_kiosk_key'"`
	OvertimeStartDate                           sql.NullString `xorm:"date 'overtime_start_date'"`
	HrAttendanceOvertime                        sql.NullBool   `xorm:"bool 'hr_attendance_overtime'"`
	HrAttendanceDisplayOvertime                 sql.NullBool   `xorm:"bool 'hr_attendance_display_overtime'"`
	AttendanceKioskUsePin                       sql.NullBool   `xorm:"bool 'attendance_kiosk_use_pin'"`
	AttendanceFromSystray                       sql.NullBool   `xorm:"bool 'attendance_from_systray'"`
	ContractExpirationNoticePeriod              sql.NullString `xorm:"int4 'contract_expiration_notice_period'"`
	WorkPermitExpirationNoticePeriod            sql.NullString `xorm:"int4 'work_permit_expiration_notice_period'"`
}

var engine *xorm.Engine
var err error
var company ResCompany

// 连接odoo数据库
func ConnectOdoo() bool {
	engine, err = xorm.NewEngine("postgres", "postgres://odoo:odoo@192.168.0.2:49154/odoo17?sslmode=disable")
	if err != nil {
		return false
	}
	fmt.Printf("is connected to odoo : ")
	fmt.Println(engine.Table("res_users").Exist())
	state, err := engine.Table("res_users").Exist()
	if err != nil {
		return false
	}
	return state
}

// 获取公司总数
func GetOdooCompanyCount() int64 {
	ConnectOdoo()
	total, err := engine.Where("id=?", 1).Count(company)
	if err != nil {
		return 0
	}
	return total
}
