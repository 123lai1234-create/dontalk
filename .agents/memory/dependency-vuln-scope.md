---
name: Dependency vulnerability scope & fix approach
description: Which scanner findings are real vs. phantom in this monorepo, and how transitive Node vulns get fixed.
---

Security-scan tasks for this repo tend to over-report. Triage before acting.

**Phantom findings (historical):** dozens of Go `stdlib`/`GO-*` advisories, Python `torch`, `astro`, `devalue`, old `postcss` used to come ONLY from `.migration-backup/` (an archived pre-monorepo snapshot: `go-proxy/go.mod`, `hf-spaces/*/requirements.txt`, `astro/`). That folder was **deleted** (user-approved) — it was 1.3 GB / ~1,145 git-tracked files, never built or deployed, so removing it cleared ~53 noise findings at once. **Lesson:** the audit scans the whole git tree, not just the deployed Node deps; if a scan lists a pile of non-Node ecosystems (Go/Python) or unfamiliar npm pkgs, find the folder they live in and check it against the threat model's production scope before trying to "patch" anything.

**Real Node findings are transitive** and fixed via `pnpm.overrides` in root `package.json`. Use `pnpm audit` (not the task list) for authoritative advisory→patched-version mapping, and `pnpm why -r <pkg>` to find the parent.

**Why overrides are safe here:** the recurring offenders live in Expo dev/build tooling (`@expo/ngrok`, `xcode`, `@expo/metro-config`) and `express`'s `qs` — none ship in the deployed portfolio (static) or api-server prod bundle except `qs`. Verify a major bump won't break consumers (e.g. confirmed `@expo/ngrok`/`xcode` call `uuid.v4()`, not the removed callable default, so uuid v11 is safe and still ships CJS).

**How to apply:** add overrides, `pnpm install`, then re-run `pnpm audit`, full `pnpm run typecheck`, and restart the api-server + expo workflows to confirm nothing broke.
