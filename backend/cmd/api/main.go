package main

import (
	"context"
	"os/signal"
	"syscall"
	"time"

	"converseai/backend/internal/app"
	"converseai/backend/pkg/logger"
)

func main() {

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	application, err := app.New(ctx)
	if err != nil {
		logger.Logger.Error("Failed to initialize application", "error", err)
		return
	}

	if err := application.Start(ctx); err != nil {
		logger.Logger.Error("Failed to start application", "error", err)
		return
	}

	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := application.Stop(shutdownCtx); err != nil {
		logger.Logger.Error("Failed to stop application", "error", err)
	}
}
