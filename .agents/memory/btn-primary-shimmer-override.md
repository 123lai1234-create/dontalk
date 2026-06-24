---
name: btn-primary shimmer override hid CTA color site-wide
description: Why portfolio primary CTAs once rendered as invisible "ghost" buttons
---

A global hover-shimmer effect once set `.btn-primary { background-image: <transparent gradient> }`.
Because that global sheet loads after each page's CSS at equal specificity, it overrode every
page's CTA color (pages set it with the `background` shorthand = background-image) → primary
buttons showed faint text with no fill on every page.

**Rule:** a decorative shimmer/sweep on a shared component must live on a `::before`/`::after`
overlay, never on the element's own `background-image`, or it silently wipes per-page colors.

**Why:** equal-specificity single-class rules resolve by source order; the later global sheet wins.

**Watch out:** the fix added `overflow:hidden` to all `.btn-primary` — a future primary button
needing an overflowing child (tooltip/badge) will be clipped; use a variant class instead.
