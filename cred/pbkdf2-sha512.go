// Copyright 2022 The Casdoor Authors. All Rights Reserved.
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

package cred

import (
	"gopkg.in/hlandau/passlib.v1/abstract"
	"gopkg.in/hlandau/passlib.v1/hash/pbkdf2"
)

type PbkdfSha512CredManager struct{}

func NewPbkdfSha512CredManager() *PbkdfSha512CredManager {
	cm := &PbkdfSha512CredManager{}
	return cm
}

/*
	func (cm *Pbkdf2SaltCredManager) GetHashedPassword(password string, userSalt string, organizationSalt string) string {
		// https://www.keycloak.org/docs/latest/server_admin/index.html#password-database-compromised
		decodedSalt, _ := base64.StdEncoding.DecodeString(userSalt)
		res := pbkdf2.Key([]byte(password), decodedSalt, 27500, 64, sha256.New)
		return base64.StdEncoding.EncodeToString(res)
	}

	func (cm *Pbkdf2SaltCredManager) IsPasswordCorrect(plainPwd string, hashedPwd string, userSalt string, organizationSalt string) bool {
		return hashedPwd == cm.GetHashedPassword(plainPwd, userSalt, organizationSalt)
	}
*/
type Context struct {
	Schemes []abstract.Scheme
}

var defualtSchemes = []abstract.Scheme{
	pbkdf2.SHA512Crypter,
}

func (cm *PbkdfSha512CredManager) GetHashedPassword(password string, hashedpwd string, organizationSalt string) string {
	var hash string
	for _, scheme := range defualtSchemes {
		ctx := Context{Schemes: []abstract.Scheme{scheme}}
		hash, _ = ctx.Schemes[0].Hash(password) //casdoor加密后hashf("hash=%v\n", hash)
	}
	return hash
}

func (cm *PbkdfSha512CredManager) IsPasswordCorrect(plainPwd string, hashedPwd string, userSalt string, organizationSalt string) bool {
	flag := true
	for _, scheme := range defualtSchemes {
		ctx := Context{Schemes: []abstract.Scheme{scheme}}
		st := ctx.Schemes[0].Verify(plainPwd, hashedPwd)
		if st != nil {
			flag = false
		}
	}
	return flag
}
