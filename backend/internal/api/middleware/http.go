package middleware

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"runtime/debug"
	"time"

	utils "converseai/backend/pkg/http"
	"converseai/backend/pkg/logger"
)

type requestContextKey string

const requestIDKey requestContextKey = "requestID"

type responseWriter struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
}

func (w *responseWriter) WriteHeader(status int) {
	if w.wroteHeader {
		return
	}

	w.status = status
	w.wroteHeader = true
	w.ResponseWriter.WriteHeader(status)
}

func (w *responseWriter) Write(data []byte) (int, error) {
	if !w.wroteHeader {
		w.WriteHeader(http.StatusOK)
	}

	return w.ResponseWriter.Write(data)
}

func (w *responseWriter) Unwrap() http.ResponseWriter {
	return w.ResponseWriter
}

func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := newRequestID()
		w.Header().Set("X-Request-ID", requestID)

		ctx := context.WithValue(r.Context(), requestIDKey, requestID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func newRequestID() string {
	var id [16]byte
	if _, err := rand.Read(id[:]); err != nil {
		return "unknown"
	}
	return hex.EncodeToString(id[:])
}

func Recovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if recovered := recover(); recovered != nil {
				logger.Logger.Error(
					"Request panic recovered",
					"request_id", GetRequestID(r),
					"method", r.Method,
					"path", r.URL.Path,
					"panic", recovered,
					"stack", string(debug.Stack()),
				)
				utils.WriteJSONErrorResponse(
					w,
					http.StatusInternalServerError,
					"Internal server error",
					nil,
				)
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startedAt := time.Now()
		writer := &responseWriter{
			ResponseWriter: w,
			status:         http.StatusOK,
		}

		next.ServeHTTP(writer, r)

		logger.Logger.Info(
			"Request completed",
			"request_id", GetRequestID(r),
			"method", r.Method,
			"path", r.URL.Path,
			"status", writer.status,
			"duration", time.Since(startedAt),
		)
	})
}

func GetRequestID(r *http.Request) string {
	requestID, _ := r.Context().Value(requestIDKey).(string)
	return requestID
}

func CORS(allowedOrigin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
