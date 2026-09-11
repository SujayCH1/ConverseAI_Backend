package app

import (
	"context"
	"errors"
	"net/http"
	"os"
	"time"

	"converseai/backend/internal/api"
	"converseai/backend/internal/api/middleware"
	"converseai/backend/pkg/logger"
)

type Application struct {
	Context context.Context

	Server *http.Server
}

func New(ctx context.Context) (*Application, error) {
	return &Application{
		Context: ctx,
	}, nil
}

func (a *Application) Start(ctx context.Context) (startErr error) {

	logger.Logger.Info("Starting backend application..")

	defer func() {
		if startErr == nil {
			return
		}

		cleanupCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		startErr = errors.Join(startErr, a.Stop(cleanupCtx))
	}()

	// backend server setup
	mux := api.NewRouter()
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	var handler http.Handler = mux
	handler = middleware.CORS(frontendURL, handler)
	handler = middleware.Recovery(handler)
	handler = middleware.RequestLogger(handler)
	handler = middleware.RequestID(handler)

	a.Server = &http.Server{
		Addr:              ":8080",
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	logger.Logger.Info("Backend server initialized")

	go func() {
		logger.Logger.Info("Starting HTTP server on 8080")
		err := a.Server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			logger.Logger.Error("HTTP server failed", "error", err)
		}
	}()

	logger.Logger.Info("Backend server started successfully")

	return nil

}

func (a *Application) Stop(ctx context.Context) error {

	logger.Logger.Info("Backend shutdown initiated...")

	var stopErr error

	if a.Server != nil {
		logger.Logger.Info("Stopping HTTP server")

		err := a.Server.Shutdown(ctx)
		if err != nil {
			logger.Logger.Error("Failed to stop HTTP server", "error", err)
			stopErr = errors.Join(stopErr, err)
		} else {
			logger.Logger.Info("HTTP server stopped")
		}
	}

	return stopErr
}
