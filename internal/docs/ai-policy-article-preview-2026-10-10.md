# AI policy article: current-brand local review

Updated: October 11, 2026.
Status: preview accepted; publication authorized October 11, 2026.
Preview: http://127.0.0.1:8097/insights/ai-policy-and-governance/
Worktree: /Users/hoff/RUDI/worktrees/learnrudi/ai-policy-current-brand-20261010
Branch: codex/ai-policy-current-brand-20261010
Base: origin/main at ca8d366, refreshed and confirmed before the October 11 release.

## Current draft

Current RUDI paper, ink, teal, IBM Plex typography, and shared site shell. Nine exhibits support the perspective: technology and method overlap, legislative domains, capability/use/domain mapping, national security, layers of regulation, a 24-measure reference, six-jurisdiction comparison, instruments, and comparable-use safeguards.

October 11 revisions remove sponsor attribution from the prose, cite H.R. 6879 directly, qualify broad captions, correct the Exhibit 7 region label, and fix mobile overflow by containing absolutely positioned accessibility labels inside the scrollable matrix. Exhibit 6 uses a native details/summary control and starts closed. The main reading path is approximately 3,128 words including exhibits, before sources and the expandable reference; the estimate is 14 minutes plus the reference table.

All 24 reference entries were reviewed against official evidence. Unsupported or insufficiently sourced legislative-inactivity, court-pause, and uniform-deadline assertions were removed or narrowed. Transition dates and voluntary instruments are distinguished. Evidence and access limits: ai-policy-source-review-2026-10-11.md.

## Verification on October 11

- npm run build: passed.
- npm test: 66 passed, 0 failed.
- git diff --check: passed.
- HTML audit: one H1, 70 unique IDs, internal anchors and local files resolved; draft robots directive removed for publication and sponsor name absent.
- The shared /_vercel/insights/script.js route is supplied by the production host and is not a static local file; existing HEAD uses the same route.
- Desktop document width equals viewport width. Narrow mobile checks at 320 and 390 CSS pixels show no whole-page overflow. The 600-pixel comparison scrolls inside its container; keyboard ArrowRight changes its scroll position.
- Reference table is closed initially; clicking opens all 24 rows; Enter closes it. No whole-page overflow when expanded on mobile.
- Static HTML/CSS and editorial changes only. Native disclosure behavior verified in the browser; no custom JavaScript or dependencies. No new automated tests, red-green loop, or JS/TS debt scan needed for this presentation change. Existing suite passes.

## Preservation and delivery

Primary checkout untouched. Pre-review article/CSS saved under /Users/hoff/.rudi/outputs/learnrudi-ai-policy-20261010/before-source-review-20261011/.

Current screenshots: revised-article-preview-20261011.png and revised-mobile-reference-20261011.png in that output directory. Earlier screenshots and patches predate this review and must not be used as the current delivery snapshot.

The final editorial pass fixes a missing comma in the RESTRICT Act paragraph and distinguishes the September 28 written date from the October 11 publication date. Article metadata and sitemap modification dates match. The owner approved publication on October 11; release follows the repository’s feature-branch, pull-request, and main-branch deployment workflow. The primary checkout’s unrelated work remains untouched. Production verification is recorded separately after deployment.
