# RUDI Method consolidation — 2026-09-22

The owner requested one method combining the training materials' Assess → Learn
→ Apply sequence with the website's ten-step consulting process. Preserve the
ten activities and group them into three stages:

- Assess: baseline, readiness, leadership priorities, workflow analysis, and
  selection of useful applications (steps 1–5).
- Learn: tools, usable governance, and practical capability (steps 6–8).
- Apply: pilot implementation, measurement, and improvement (steps 9–10).

The education course catalog supplies the three-stage foundation and its
conceptual, operational, and governance learning domains. The existing public
Method page supplies the ten activities. The owner confirmed the consolidation
in this task. No historical outcome claims from sales decks were reused.

The Method page now explains activities and outputs, shows a department-report
example, connects to current services and RESPECT, and uses bright, unboxed
layouts. The Approach page's old four-part engagement summary now uses the same
three stages. Its five service stages remain a separate description of the work
RUDI can support. Canonical URLs, shared navigation, analytics scripts, and
inquiry behavior remain intact. Only these two HTML pages, a page-specific CSS
file, and sitemap modification dates change.

Validation: build, shared-shell drift check, 54 repository tests, three Python
shell tests, whitespace checks, and the local crawl pass. The crawl covers 151
HTML responses and 55 assets (206 local URLs). Browser inspection covers desktop
stage layout, mobile typography, section links, and width checks at 390px and
320px without overflow. Lists contain 5, 3, and 2 steps and start at 1, 6, and 9.

This is an editorial and CSS change using existing behavior. No new behavior
tests were added, and no JavaScript or TypeScript files changed, so the red-green
loop and JS/TS debt scan do not apply. Repeat the repository checks on the exact
committed revision on the admin Mac before publishing. Preserve unrelated
untracked and ignored work and verify production bytes after deployment.
