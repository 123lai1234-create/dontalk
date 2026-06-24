---
name: portfolio shadcn red-placeholder tokens leak into pages
description: Why some portfolio pages showed red text/borders/accents from src/index.css
---

`artifacts/portfolio/src/index.css` is a shadcn theme scaffold where ~30 design tokens are
still unreplaced `--x: red; /*replace with H S L */` placeholders. The portfolio's HTML-string
pages consume some of these token NAMES directly as full colors via `var(--x)` (not
`hsl(var(--x))`). Where a page's own `public/styles/*.css :root` redefines the token it's fine;
where it doesn't, the global `red` placeholder shows through.

**Symptom seen:** red subtitle/secondary text (`--muted`) on /blog (pageStyles=[]) and
/interactive-showcase; red nav/card/footer borders (`--border`) on the many pages that never
define their own --border; red link+button (`--accent`) on the homepage protein section.

**Rule:** when a token is consumed by name via `var(--token)` across pages, give it a real
default at the source (`src/index.css`), don't rely on `var(--token, fallback)` — the fallback
is bypassed because the token IS defined (to red). Page `:root` overrides still win (page CSS is
injected by BasePage after app bootstrap).

**Canonical values:** `--muted: #94a59f`, `--border: rgba(151,190,181,0.1)`. `--accent` is
page-specific (teal homepage / orange music / purple interview) — set per page, not globally.

**Still-latent (harmless):** `--card/--foreground/--background/--primary/--secondary/--popover/
--input/--ring/--destructive/--chart-*/--sidebar-*` remain `red` but are NOT consumed via
`var()` by any portfolio page (report.css consumes `--primary` but defines its own), so invisible.
