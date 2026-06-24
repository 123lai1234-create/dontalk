---
name: Stock-app operator route authorization
description: How privileged operator actions in the /stock clone must be gated (server-side), and why.
---

The `/stock` clone (台股均線買賣訊號系統) backend is `artifacts/api-server/src/routes/stock.ts`; the verbatim frontend is `artifacts/portfolio/public/stock-app/index.html`.

**Rule:** every privileged/mutating/expensive endpoint must call `operatorOk(password)` (validates against the `STOCK_OPERATOR_PASSWORD` env secret; closed-by-default when the secret is unset). Currently gated: `GET /recipients` (PII email list, password via `x-operator-password` header), `POST /recipients/add`, `DELETE /recipients/remove`, `POST /scan_and_email` (40-stock fan-out + email blast), `POST /stocks/add`, `stocks/remove`, `POST /intraday_scan/toggle`. Read/compute endpoints (`/scan`, `/stocks`, `/stock/:code`, etc.) stay public. `markers/record` is intentionally rate-limited-only (low-impact cache write fired on normal page views; gating breaks the faithful clone).

**Why:** the reference app shipped a *client-side-only* gate (a hardcoded `RECIPIENTS_PASSWORD` compared in browser JS) which is fully bypassable. `threat_model.md` for this repo is explicit: client-side admin gating is insufficient; expensive sync/email/fan-out and operator actions MUST be authorized server-side, and secrets must not travel in query strings.

**How to apply:** when adding any new operator/mutation/email/expensive route to this app, add an `operatorOk` check first, return 403 `{ok:false, need_password:true}` on failure, and have the frontend send the in-session `_recipientsPwd` (body for POST/DELETE, `x-operator-password` header for GET). Never reintroduce a client-side password comparison.
