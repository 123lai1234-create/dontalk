---
name: SPA page scripts never see DOMContentLoaded
description: In the React SPA, externally-loaded page scripts are injected after DOMContentLoaded and never re-run on route change, so DOMContentLoaded-only init breaks on first load and on re-navigation.
---

A page script whose only entry point is `addEventListener("DOMContentLoaded", init)` silently never initializes in this SPA, with NO console error: the event already fired before the script is injected at mount, and the script loader never re-executes an already-loaded script on later navigations.

**Why:** The portfolio loads page scripts once via a global "loaded" registry. Symptom is subtle — static HTML renders fine but anything built at runtime (lists, control bindings, search) is missing. Both first-load and SPA re-navigation are affected.

**How to apply:** Drive per-page init off a mount event the page shell dispatches on every mount (first and subsequent), not off DOMContentLoaded. Make init idempotent across mounts: element-level listeners on fresh nodes are fine, but anything that creates a new closure binding a document/window listener or a rAF/interval loop must be guarded to set up once, or it stacks on every re-navigation.
