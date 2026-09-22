# Regional index editorial refresh — 2026-09-22

## Scope and outcome

Replaced the developing Greater Cincinnati AI Readiness Index page's stacked cards with open editorial sections, definition-list rows, and a semantic proposed-method table. Kept the paper/teal palette and horizontal rules; no decorative side borders. Reading order is purpose, current status, research questions, proposed methods, intended outputs, participation.

Owned files:
- `public/greater-cincinnati/ai-readiness-index/index.html`
- `public/css/regional-index-editorial-20260922.css`
- This evidence document.

All original IDs, link destinations, shared header/footer markup, scripts, metadata, and canonical URL were retained. New section IDs provide descriptive anchors. Existing inquiry behavior is unchanged. No shared asset or other page was edited.

## Sources and editorial boundaries

Source baseline: accepted commit `04d2dd3c4267e339263426328d25f38f96df3089`, especially the original target page and `public/greater-cincinnati/index.html` (read only). Consulted README, docs/site-copy-standard.md, docs/brand/README.md, the synthetic-cadence-editor skill, and SWE manual index/doctrine.

The existing page documents research design and partnership development, with no published findings. That statement is prominent. Methods and outputs remain proposed or intended. Sector analysis remains conditional on sample size and evidence. Participation copy invites a conversation, avoiding an implication that recruitment or data collection is already operating. No changing external product/technical claims, statistics, case studies, participants, findings, or new capabilities were added, so external source verification was not needed. The regional hub's unrelated statistics were not copied.

## Verification

- `npm test`: 54 passed, 0 failed.
- `npm run build`: passed static site layout check.
- `python3 internal/scripts/site_shell.py --check`: 0 pages need updating.
- `git diff --check`: passed.
- Compared original/new HTML: shared shell unchanged, every original ID and href preserved.
- Local preview served only this worktree on `127.0.0.1:8137`; existing port 8088 untouched.
- In-app Chromium browser: inspected desktop 1440 × 1000, mobile 375 × 812, and narrow mobile 320 × 812. Checked heading wrapping, status, open rows and method table. Document scroll width matched viewport at all three sizes; no main-content element extended beyond the mobile viewport.
- Keyboard Tab moved from the participation CTA to the regional hub link with a visible 3px teal focus outline and 5px offset.
- Computed contrast: body 17.47:1, teal eyebrow 4.78:1, button text 4.86:1, muted captions/notes 5.61:1 against their backgrounds.
- Clicked participation CTA: existing inquiry page opened with “Greater Cincinnati research / partnership” selected. No form submitted.
- Browser viewport override reset after checks.

Static HTML/CSS editorial work only: no behavior-bearing JS change, speculative tests, or JS/TS debt scan needed. Red-green loop was not applicable. Cross-browser and assistive-technology testing were not performed; native headings, definition lists, caption, and scoped table headers retain semantic reading order.

Publishing, integration, navigation regeneration, deployment, and admin-Mac synchronization belong to the coordinating task and were intentionally not performed here.
