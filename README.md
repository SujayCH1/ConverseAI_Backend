# ConverseAI

## Local development with Docker

1. Copy `.env.example` to `.env` and change any desired values.
2. Start all three containers:

   ```sh
   docker compose up --build
   ```

3. Open the frontend at <http://localhost:3000>. The API health endpoint is at
   <http://localhost:8080/health>, and PostgreSQL is exposed on port `5432`.

The database schema in `database/schema.sql` is applied automatically only when
Docker creates an empty `postgres_data` volume. To apply later schema edits to an
existing database, execute the SQL file manually. The backend receives its database
connection string through `DATABASE_URL`; for deployment, set it to the Supabase
PostgreSQL connection string.
