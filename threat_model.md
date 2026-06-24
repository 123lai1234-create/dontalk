# Threat Model

## Project Overview

This repository is a pnpm monorepo with two active production artifacts: a public React/Vite portfolio frontend and a small Express API. The deployed public surface today is dominated by static and script-heavy portfolio pages; the in-repo API currently exposes only `/api/healthz`. Several portfolio pages call third-party browser-side services directly, including Supabase REST endpoints and external data/demo APIs.

Production assumptions for future scans:
- Only code reachable from the public deployment is in scope.
- `artifacts/mockup-sandbox` is dev-only and should be ignored unless explicitly wired into a production build.
- Replit deployment provides TLS in production.

## Assets

- **Visitor-submitted contact data** — names, email addresses, organization, and message content submitted from the About page. Abuse or disclosure affects privacy and site integrity.
- **Operational sync secrets** — browser-provided secrets used to authorize protected data sync actions for portfolio data pages. Exposure could let unauthorized users trigger privileged backend actions.
- **Portfolio backend data and quotas** — any external databases or APIs the frontend writes to or syncs from, including contact storage and research-data caches. Abuse can create spam, unwanted mutations, or quota exhaustion.
- **Deployment reputation and availability** — public-facing pages and APIs can be abused for spam, scraping, or excessive triggering of expensive backend work.

## Trust Boundaries

- **Browser to in-repo API** — requests from the public frontend to the Express server under `/api`. The browser is untrusted; the current in-repo API surface is minimal.
- **Browser to third-party services** — portfolio scripts directly call external origins such as Supabase and other data/demo APIs. Any secrets or authorization material present in the browser must be treated as exposed to the client.
- **Public visitor to privileged sync operations** — several pages expose data-sync functionality in the UI. Any distinction between regular visitors and operators must be enforced by the backend, not just by hidden buttons or client-side checks.
- **Source-controlled static content to DOM execution** — many portfolio pages inject large HTML strings and execute inline scripts. This is only safe while content remains fully developer-controlled.

## Scan Anchors

- **Production entry points**: `artifacts/portfolio/src/main.tsx`, `artifacts/portfolio/src/App.tsx`, `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`
- **Highest-risk code areas**: `artifacts/portfolio/public/scripts/`, `artifacts/portfolio/src/components/BasePage.tsx`, `artifacts/portfolio/src/pages/about.tsx`
- **Public surfaces**: all routes in `artifacts/portfolio/src/App.tsx`; API routes under `artifacts/api-server/src/routes/`
- **Authenticated/admin surfaces**: no in-repo server-side auth found; treat any `admin-only` frontend controls as cosmetic until proven backed by server authorization
- **Usually dev-only**: `artifacts/mockup-sandbox/`

## Threat Categories

### Spoofing

This project has no in-repo authentication boundary today, but several portfolio pages imply privileged operator actions such as sync or maintenance flows. Any privileged action exposed through the frontend must require a server-validated secret or identity check on the receiving backend; client-side “admin mode” or hidden UI elements are not sufficient.

### Tampering

The biggest tampering risk is the browser directly issuing write requests to external services. Contact submissions, sync actions, or delete actions must not rely on client-side-only validation, rate limiting, or operator gating, because an attacker can replay or forge the requests outside the intended UI.

### Information Disclosure

Operational secrets must never be transported in URL query parameters or stored long-term in browser-readable storage unless they are intended to be public. Query-string secrets are exposed to logs, browser history, screenshots, and potentially referrer leakage to third-party origins. Browser-side scripts that call third-party services should assume all embedded tokens are observable by visitors.

### Denial of Service

Public write or sync endpoints are a DoS and abuse risk if they can be triggered without durable server-side throttling. Browser-visible flows that can insert records, trigger sync jobs, or fan out to expensive third-party APIs must be rate-limited and authorized on the backend.

### Elevation of Privilege

Any operator-only functionality must be enforced server-side. The frontend currently contains patterns such as hidden `admin-only` controls and browser-managed sync secrets; future scans should verify that corresponding backends do not trust the client’s presentation-layer gating.
