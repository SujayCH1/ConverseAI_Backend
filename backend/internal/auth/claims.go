package auth

import "github.com/golang-jwt/jwt/v5"

type SupabaseClaims struct {
	jwt.RegisteredClaims

	Email string `json:"email,omitempty"`
	Role  string `json:"role"`
}
