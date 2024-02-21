package object

import (
	"database/sql"
	"fmt"
)

type ResUsers struct {
	Id                  string         `xorm:"not null default 'nextval(res_users_id_seq::' int4 'id'"`
	CompanyId           string         `xorm:"not null int4 'company_id'"`
	PartnerId           string         `xorm:"not null int4 'partner_id'"`
	Active              bool           `xorm:"default 'true' bool 'active'"`
	CreateDate          sql.NullString `xorm:"timestamp(6) 'create_date'"`
	Login               string         `xorm:"not null varchar 'login'"`
	Password            sql.NullString `xorm:"varchar 'password'"`
	ActionId            sql.NullString `xorm:"int4 'action_id'"`
	CreateUid           sql.NullString `xorm:"int4 'create_uid'"`
	WriteUid            sql.NullString `xorm:"int4 'write_uid'"`
	Signature           sql.NullString `xorm:"text 'signature'"`
	Share               sql.NullBool   `xorm:"bool 'share'"`
	WriteDate           sql.NullString `xorm:"timestamp(6) 'write_date'"`
	TotpSecret          sql.NullString `xorm:"varchar 'totp_secret'"`
	NotificationType    string         `xorm:"not null varchar 'notification_type'"`
	OdoobotState        sql.NullString `xorm:"varchar 'odoobot_state'"`
	OdoobotFailed       sql.NullBool   `xorm:"bool 'odoobot_failed'"`
	SaleTeamId          sql.NullString `xorm:"int4 'sale_team_id'"`
	TargetSalesWon      sql.NullString `xorm:"int4 'target_sales_won'"`
	TargetSalesDone     sql.NullString `xorm:"int4 'target_sales_done'"`
	Karma               sql.NullString `xorm:"int4 'karma'"`
	RankId              sql.NullString `xorm:"int4 'rank_id'"`
	NextRankId          sql.NullString `xorm:"int4 'next_rank_id'"`
	TargetSalesInvoiced sql.NullString `xorm:"int4 'target_sales_invoiced'"`
}

var user ResUsers

/*type Context struct {
	Schemes []abstract.Scheme
}

var defualtSchemes = []abstract.Scheme{
	pbkdf2.SHA512Crypter,
}*/

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
	//users, err := engine.Asc("id").Find(&users, &ResUsers{Login: login})
	has, err := engine.Where("login=?", login).Get(users)
	if err != nil {
		return nil
	}
	fmt.Println(has)
	fmt.Printf("Login: %v\n", users)
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
	fmt.Printf("findmaster Login: %v\n", odoouser.Login)
	fmt.Printf("Login: %v\n", odoouser)
	return odoouser
}

// pbdkf2-sha512加密算法
//func encyptPassword(pwd string, hashedpwd sql.NullString) error {
//	var result error
//	for _, scheme := range defualtSchemes {
//		ctx := Context{Schemes: []abstract.Scheme{scheme}}
//		hash, err := ctx.Schemes[0].Hash(pwd) //casdoor加密后hash
//		if err != nil {
//			fmt.Printf("error: %v\n", err)
//		}
//		fmt.Printf("hash=%v\n", hash)
//		hashval := hashedpwd.String
//		newhash := ctx.Schemes[0].Verify(pwd, hashval) //与odoo中password进行验证当返回空指针时即为验证成功
//		if newhash != nil {
//			fmt.Printf("error: %v\n", newhash)
//		}
//		result = newhash
//		fmt.Printf("result=%v\n", newhash)
//	}
//	return result
//}
