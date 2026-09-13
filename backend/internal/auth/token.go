package auth

import (
	"errors"
	"net/http"
	"strings"
)

var (
	ErrMissingAuthorization = errors.New("authorization header is required")
	ErrInvalidAuthorization = errors.New("authorization header must use the Bearer token scheme")
)

func BearerToken(r *http.Request) (string, error) {
	header := strings.TrimSpace(r.Header.Get("Authorization"))
	if header == "" {
		return "", ErrMissingAuthorization
	}

	parts := strings.Fields(header)

	if len(parts) != 2 {
		return "", ErrInvalidAuthorization
	}

	if !strings.EqualFold(parts[0], "Bearer") {
		return "", ErrInvalidAuthorization
	}

	if parts[1] == "" {
		return "", ErrInvalidAuthorization
	}

	return parts[1], nil

}
