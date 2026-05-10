# Cricket Rivals Local Development

Last updated: 2026-05-05

This local setup mirrors the planned production shape:

- Backend: Node.js + Express + WebSocket on `http://localhost:4000`
- Database: local Postgres on `localhost:5432`
- Optional realtime scaling cache: local Redis on `localhost:6379`
- Web: Vite dev server
- Mobile: Expo dev server

Repo layout note:

- `public_html/` is the canonical HostAfrica public-site source that you sync to production.
- `client/` is the separate app web client; its optional `client/public/` folder is only for app-specific Vite assets, not the hosted landing/legal site.

## Environment Files

Use the env examples as role-specific templates:

- `server/.env.local.example` -> local backend + local Postgres
- `server/.env.production.example` -> hosted backend secrets/URLs
- `client/.env.local.example` -> local Vite app against local API
- `client/.env.production.example` -> hosted web app against Fly
- `mobile_cricket_rivals/.env.local.example` -> optional Expo override for a specific LAN/local API
- `mobile_cricket_rivals/.env.production.example` -> preview/release builds against Fly

Git rule:

- Commit only the `*.example` env templates.
- Keep live local files such as `server/.env`, `client/.env`, and `mobile_cricket_rivals/.env` untracked.

Important local rule:

- Do not leave production-facing email settings in `server/.env`.
- In local development, `RESEND_API_KEY` should normally stay blank and `CLIENT_URL` should point at a local reset-capable web app such as `http://localhost:5173`.
- If you request a password reset from the local backend, treat it as a dev-only flow. The hosted public reset page is for production unless you intentionally wire a dev path.

## 1. Choose Your Local Database Path

Cricket Rivals now supports two valid local database setups:

- Installed PostgreSQL on your machine
- Docker Postgres from `docker-compose.local.yml`

Use one or the other. Do not mix credentials from both setups in the same `server/.env`.

### Installed PostgreSQL

This is the path currently working on this machine.

- Keep your local PostgreSQL server running.
- Use the `cricket_rivals` database in pgAdmin/Postgres.
- Point `server/.env` at the actual local role you use to access that database.

Example:

```text
DATABASE_URL="postgresql://postgres:<your-local-password>@localhost:5432/cricket_rivals?schema=public"
```

If your dev user already exists in local Postgres, Expo Go and the local backend will use that same state.

### Docker Postgres

Prerequisite: Docker Desktop with Compose support.

### Fast Start On Windows

From the repo root, `start-dev.bat` now does the basic local boot sequence for you:

- refreshes the shared version stamp with `npm run version:sync`
- opens fresh server, mobile, and client dev windows
- leaves Expo Go on the local backend path unless `mobile_cricket_rivals/.env` explicitly sets `EXPO_PUBLIC_API_URL`

Use it when you want the normal local stack quickly:

```bat
start-dev.bat
```

It does not start Postgres, run migrations, or seed data for you, so keep your local PostgreSQL server running and use the Prisma prep steps below the first time or after schema resets.

If you are using Docker Postgres, from the repo root:

```bash
npm run local:db:up
```

This starts:

- `cricket-rivals-postgres`
- `cricket-rivals-redis`

The local Postgres connection string is:

```text
postgresql://cricket_rivals:cricket_rivals_dev@localhost:5432/cricket_rivals?schema=public
```

### Native Postgres Bootstrap

If you prefer a locally installed PostgreSQL server and want a dedicated app role instead of `postgres`:

```sql
CREATE USER cricket_rivals WITH PASSWORD 'cricket_rivals_dev';
CREATE DATABASE cricket_rivals OWNER cricket_rivals;
```

Then use the same `DATABASE_URL` shown above. Redis is optional for normal one-process development.

## 2. Configure Server Env

Copy the server env example:

```bash
copy server\.env.example server\.env
```

Use these local values as the shape:

```text
PORT=4000
DB_ENABLED=true
DATABASE_URL="postgresql://<local-role>:<local-password>@localhost:5432/cricket_rivals?schema=public"
REDIS_URL=
REDIS_CHANNEL_PREFIX=cricket-rivals
CORS_ORIGIN=*
AUTH_JWT_SECRET=local-cricket-rivals-dev-secret-change-me
```

Leave `REDIS_URL` blank for normal one-process local development. Set it to `redis://localhost:6379` only when testing Redis pub/sub behavior.

If you are using installed PostgreSQL instead of Docker, your role/password can differ from the examples. That is fine. What matters is that `server/.env` matches the local database you actually log into with pgAdmin/psql.

## 3. Prepare Prisma

From the repo root:

```bash
npm run local:server:generate
npm run local:server:migrate
npm run local:server:seed
```

If you need a fresh local database:

```bash
npm run local:db:reset
npm run local:server:migrate
npm run local:server:seed
```

After schema changes, re-run those Prisma steps before trusting the local server state even if `start-dev.bat` has already launched the app windows.

## 4. Run Backend

```bash
cd server
npm run dev
```

Expected local API:

```text
http://localhost:4000
ws://localhost:4000
```

## 5. Run Web

In another terminal:

```bash
cd client
npm run dev
```

Optional web env override:

```text
VITE_API_URL=http://localhost:4000
```

## 6. Run Mobile

In another terminal:

```bash
cd mobile_cricket_rivals
npm run start
```

For Expo on a physical device, set:

```text
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:4000
```

If `mobile_cricket_rivals/.env` does not exist, Expo Go dev falls back to host detection and should still target your local backend.

That means the normal local path is:

- no `mobile_cricket_rivals/.env`
- Expo Go talking to your local backend
- local backend talking to your local Postgres
- hosted Fly/HostAfrica only used when you explicitly switch env targets

For Android emulator, `10.0.2.2:4000` is supported by the existing mobile config. Expo host detection is also enabled for LAN development.

## 7. Local Architecture Rules

- Keep ranked/challenge/tower simulation authoritative on the backend.
- Run simulations in memory.
- Persist final match results and progression through Prisma/Postgres.
- Avoid writing every ball to the database during normal match simulation.
- Use local storage/AsyncStorage only for UI/session/cache behavior.

## 8. Next Week External Switch

When moving to hosted services, the intended changes are configuration-only:

- Replace local `DATABASE_URL` with Supabase Postgres.
- Set Fly.io secrets for `DATABASE_URL`, `AUTH_JWT_SECRET`, `CORS_ORIGIN`, and optional `REDIS_URL`.
- Set web `VITE_API_URL=https://api.lineupgames.co.za`.
- Set mobile `EXPO_PUBLIC_API_URL=https://api.lineupgames.co.za` in the relevant Expo build profile.
