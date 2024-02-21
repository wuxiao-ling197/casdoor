package cred

import (
	"fmt"
	"testing"
)

func TestGet512Password(t *testing.T) {
	cm := NewPbkdfSha512CredManager()
	result := cm.GetHashedPassword("odoo7292", "", "")
	fmt.Printf("hash in test= %v\n", result)
	re := cm.IsPasswordCorrect("odoo7292", result, "", "")
	fmt.Printf("is verified= %t\n", re)

}
