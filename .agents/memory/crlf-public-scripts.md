---
name: CRLF in portfolio public/scripts
description: Files under artifacts/portfolio/public/scripts/*.js use CRLF line endings, which breaks multi-line edit-tool matches.
---

The legacy browser scripts in `artifacts/portfolio/public/scripts/*.js` (e.g. `app-config.js`) use CRLF (`\r\n`) line endings.

**Why:** The `edit` tool's `old_string` matching uses `\n`, so any `old_string` spanning more than one line silently fails to match ("did not appear verbatim") even when the text looks identical. Single-line (no newline) matches still work.

**How to apply:** For multi-line edits in these files, use `perl` with `\r?\n` in the pattern (e.g. `perl -0pi -e "s/.../.../"`), or restrict the `edit` `old_string` to a single line. Confirm with `sed -n 'N,Mp' file | cat -A` (look for `^M$`).
