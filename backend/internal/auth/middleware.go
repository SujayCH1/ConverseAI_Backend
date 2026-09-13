package auth

import (
	"net/http"

	utils "converseai/backend/pkg/http"
	"converseai/backend/pkg/logger"
)

func (v *Verifier) RequireAuthentication(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := BearerToken(r)
		if err != nil {
			_ = utils.WriteJSONErrorResponse(
				w,
				http.StatusUnauthorized,
				"Authentication required",
				nil,
			)
			return
		}

		claims, err := v.Verify(tokenString)
		if err != nil {
			logger.Logger.Warn(
				"Access token verification failed",
				"error", err,
			)

			_ = utils.WriteJSONErrorResponse(
				w,
				http.StatusUnauthorized,
				"Invalid or expired access token",
				nil,
			)
			return
		}

		principal := Principal{
			UserID: claims.Subject,
		}

		ctx := WithPrincipal(r.Context(), principal)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
