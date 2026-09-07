# ConverseAI Frontend

The retained Next.js interface for ConverseAI. Backend behavior has been removed and replaced with an HTTP client boundary under `src/api`. The future Go service will implement those endpoints.

## Development

1. Copy `.env.example` to `.env.local` and configure Clerk and the Go API URL.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

The default API address is `http://localhost:8080`.
