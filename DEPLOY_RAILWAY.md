# Deploying dontalk api-server to Railway

The frontend is hosted on Vercel (see `vercel.json`) and proxies `/api/*` to
this backend. The previous backend lived on a Replit Reserved VM, which
Replit deprecated — that VM is now offline, hence the 404s on every
`/api/*` request. This doc covers bringing the backend up on Railway.

---

## TL;DR

1. Create a Railway project from this GitHub repo.
2. Add a managed Postgres service to the project.
3. Add a new service pointing at this repo, root directory = repo root.
4. Set env vars (see `artifacts/api-server/.env.example`).
5. Push the Drizzle schema to the new database.
6. Update `vercel.json` to point at the Railway-generated domain.
7. Trigger a Vercel redeploy.

---

## Step 1 — Railway project

- Go to <https://railway.app/dashboard> → **New Project** → **Deploy from GitHub repo**.
- Pick this repo (`dontalk`). Railway will create a service named after the repo.
- The Dockerfile at the repo root will be auto-detected (because of
  `railway.toml`).

## Step 2 — Postgres

- In the same project, click **+ New** → **Database** → **PostgreSQL**.
- Railway auto-provisions a `DATABASE_URL` and exposes it as a variable to
  every service in the project. **Do not copy the value into your api-server
  service by hand** — link the services instead so it stays in sync.

## Step 3 — api-server service

- The service created in Step 1 is your api-server. No extra config needed
  beyond the env vars below.

## Step 4 — Environment variables

Set these on the api-server service in the **Variables** tab. Everything
required at startup throws fast (see `src/index.ts` + `lib/db/src/index.ts`),
so missing values surface as a crash loop, not silent failure.

| Variable | Required? | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Auto-set when you link the Postgres service. Don't paste manually. |
| `STOCK_OPERATOR_PASSWORD` | ✅ for admin UI | Long random string. `openssl rand -hex 32` |
| `PORT` | (optional) | Dockerfile defaults to 8080; Railway injects its own `PORT` automatically. Leave blank. |
| `NODE_ENV` | recommended | `production` |
| `LOG_LEVEL` | optional | `info` default |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` | optional | Daily signal email; the rest of the app runs without it |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | optional | Contact form has hard-coded fallbacks; override only if migrating |

## Step 5 — Database schema

The schema lives in `lib/db/src/schema/`. Push it to the new database:

```bash
# from the repo root, with DATABASE_URL exported
pnpm --filter @workspace/db run push
```

For production, prefer Drizzle migrations over `push` (the latter is dev-only
per `replit.md`). When you're ready, replace the `push` step with:

```bash
pnpm --filter @workspace/db run generate    # writes SQL files
pnpm --filter @workspace/db run migrate     # applies them
```

(Add the corresponding scripts to `lib/db/package.json` first.)

## Step 6 — Public domain

- In the api-server service → **Settings** → **Networking** → **Generate Domain**.
- Railway gives you a host like `dontalk-api-production.up.railway.app`.

## Step 7 — Wire Vercel to Railway

- Open `vercel.json` and replace `YOUR-RAILWAY-APP.up.railway.app` in the
  `/api/:path*` rewrite with the host from Step 6.
- Commit + push. Vercel auto-redeploys and the API 404s disappear.

---

## Verifying the deploy

```bash
# Health check (should print {"status":"ok"}):
curl https://<your-railway-host>/api/healthz

# First real call (should return a JSON list of stocks):
curl https://<your-railway-host>/api/stocks

# Through the Vercel proxy (should be identical to the above):
curl https://dontalk.vercel.app/api/stocks
```

## Gotchas

- **Build cache misses on first deploy.** pnpm with `minimumReleaseAge:
  1440` in `pnpm-workspace.yaml` will reject any package published within
  the last 24 h. If a transitive dep was just released, you may need to
  add it to `minimumReleaseAgeExclude` temporarily, then remove the
  exception. The Dockerfile already runs `pnpm install --no-frozen-lockfile`
  for this reason.
- **First cold start is slow.** pnpm install + esbuild takes 60–90 s.
  Subsequent deploys reuse the build cache and finish in ~10 s.
- **Don't commit `.env` files.** The `.dockerignore` excludes them, but
  keep the discipline anyway. All secrets live in Railway's Variables tab.
- **Postgres connection pool.** `lib/db/src/index.ts` creates a single `pg`
  pool at module load. Railway's free Postgres caps at 20 connections —
  fine for this app, but if you scale to multiple instances, switch to
  PgBouncer in front of Postgres.
- **Healthcheck path.** Railway's HTTP probe hits `/api/healthz`. If you
  change the route path, update both `healthcheckPath` in `railway.toml`
  and the route in `artifacts/api-server/src/routes/health.ts`.

## Rollback

Railway keeps every successful deployment as a redeployable snapshot.
**Deployments** → click any green tick → **Redeploy**. No Git revert
required for an emergency rollback.
