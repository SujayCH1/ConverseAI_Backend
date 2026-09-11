package api

import (
	"net/http"

	utils "converseai/backend/pkg/http"
)

func NewRouter() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		_ = utils.WriteJSONSuccessResponse(w, http.StatusOK, "API is healthy", nil)
	})

	return mux
}
