package object

import (
	"fmt"
	"testing"
)

func TestUserSum(t *testing.T) {
	ConnectOdoo()
	fmt.Printf("sum=%v\n", GetOdooUserCount())
	users := GetOdooUserByLogin("dd")
	fmt.Printf("users=%v", users)
	odoo := GetOdooUserById(6)
	fmt.Printf("odoo=%v", odoo)
	//result := encyptPassword("7292", odoo.Password)
	//fmt.Printf("verify password odoo:%v\n", result)
}
