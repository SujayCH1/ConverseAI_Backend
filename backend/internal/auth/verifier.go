package auth

import (
	"context"
	"fmt"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

type Verifier struct {
	keys   keyfunc.Keyfunc
	issuer string
}

func NewVerifier(ctx context.Context, supabaseURL string) (*Verifier, error) {
	supabaseURL = strings.TrimRight(supabaseURL, "/")
	if supabaseURL == "" {
		return nil, fmt.Errorf("Supabase URL is required")
	}

	issuer := supabaseURL + "/auth/v1"
	jwksURL := issuer + "/.well-known/jwks.json"

	keys, err := keyfunc.NewDefaultCtx(ctx, []string{jwksURL})
	if err != nil {
		return nil, fmt.Errorf("load Supabase signing keys: %w", err)
	}

	return &Verifier{
		keys:   keys,
		issuer: issuer,
	}, nil
}

func (v *Verifier) Verify(tokenString string) (*SupabaseClaims, error) {
	tokenString = strings.TrimSpace(tokenString)
	if tokenString == "" {
		return nil, fmt.Errorf("access token is required")
	}

	claims := &SupabaseClaims{}

	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		v.keys.Keyfunc,
		jwt.WithValidMethods([]string{
			"ES256",
			"RS256",
			"EdDSA",
		}),
		jwt.WithIssuer(v.issuer),
		jwt.WithAudience("authenticated"),
		jwt.WithExpirationRequired(),
	)
	if err != nil {
		return nil, fmt.Errorf("verify access token: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("access token is invalid")
	}

	if claims.Subject == "" {
		return nil, fmt.Errorf("access token subject is required")
	}

	if claims.Role != "authenticated" {
		return nil, fmt.Errorf("access token role is not authenticated")
	}

	return claims, nil

}
