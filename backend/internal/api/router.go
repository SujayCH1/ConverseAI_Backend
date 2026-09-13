package api

import (
	"net/http"

	"converseai/backend/internal/auth"
	utils "converseai/backend/pkg/http"
)

func NewRouter(authVerifier *auth.Verifier) *http.ServeMux {
	mux := http.NewServeMux()

	// health
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		_ = utils.WriteJSONSuccessResponse(w, http.StatusOK, "API is healthy", nil)
	})

	// auth verification
	mux.Handle(
		"GET /v1/auth/me",
		authVerifier.RequireAuthentication(
			http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				principal, ok := auth.PrincipalFromContext(r.Context())
				if !ok {
					_ = utils.WriteJSONErrorResponse(
						w,
						http.StatusInternalServerError,
						"Authenticated identity is unavailable",
						nil,
					)
					return
				}

				_ = utils.WriteJSONSuccessResponse(
					w,
					http.StatusOK,
					"Authenticated user",
					map[string]string{
						"user_id": principal.UserID,
					},
				)
			}),
		),
	)

	return mux
}
