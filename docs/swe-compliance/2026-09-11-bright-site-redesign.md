# LearnRUDI bright site redesign

Status: ready for local design review. Implementation and verification complete. User authorized local implementation with
`set-goal-and-execute` on 2026-09-11. No commit or publication authority.

## Phase 0: Baseline and scope

- Base: `origin/main` at `5f6a774`; isolated branch
  `codex/learnrudi-bright-site-20260911`.
- Baseline: `npm test` passed 24/24; `npm run build` passed.
- Medium risk: shared public navigation, visual design, existing inquiry flow,
  and automated Daily generation have meaningful regression potential.
- Preserve both unpublished source branches, the brand worktree's staged
  arrangement cleanup, all existing routes, 72 dated editions, the 21-lesson
  player, playbook downloads, legal copy, attribution and form failure behavior.
- Manual: operating index, Agent Co-Pilot Operating Standard, testing doctrine,
  frontend appendix and horizontal stewardship guidance.

## Phase 1: Approved contract and working plan

1. [x] Reconcile useful unpublished service, inquiry and layout work onto main.
2. [x] Apply canonical lowercase wordmark/separate monogram, Paper White
   `#FFFDF8`, Ink `#15181F`, Deep Teal `#177F74` controls and Node Teal graphic
   accents. No large dark-paper backgrounds or retired combined lockups.
3. [x] Standardize four navigation groups plus Start Here across modern and
   legacy pages; retain direct links and existing URLs.
4. [x] Redesign homepage and services overview; explain all five stages inline,
   surface assessment, team training and Managed Digital Workers.
5. [x] Build the work hub with Walker SCM and Warren County ESC case studies
   and verified AfroTech, Avanade, ULI Cincinnati and Mercantile event assets.
   Mark September 17 Microsoft Copilot upcoming. Use user-supplied aggregate
   `1,500+ employees engaged`, distinct from the Walker engagement scope.
6. [x] Preserve Daily catalog markers, update future generation, and document
   reproducible brand exports and shared shell maintenance.
7. [x] Complete tests, build, debt scan, browser review and independent review.
8. [x] Record proof, worktree disposition, remaining gates and local preview.

No framework migration, new event detail routes, client-private recordings,
unclassified ULI photography, backend changes, DNS changes or deployment.
Original client assets stay in their client workspaces. Only selected public
event creatives and website derivatives belong in this app.

Horizontal disposition: consolidate the shared navigation implementation into
`internal/scripts/site_shell.py`, served as static HTML with scoped CSS and a
small dismissal enhancement. There are 113 site pages and six embedded chart
documents; charts deliberately omit site chrome. Existing article styles and
content remain owned by their original templates. Future Daily pages pass
through the same shell before writing.

Retained debt: the old `header.js`, `footer.js`, and `legacy-positioning.js`
files have no remaining public HTML callers, but stay present for compatibility
with repository checks and recovery. Owner: website maintainer. Trigger:
a separately scoped asset cleanup. Closing proof: reference audit, removal of
obsolete required-file assertions, full tests and crawl. No third runtime
navigation implementation was added.

Planned reviewable slices (all remain uncommitted): existing-work reconciliation;
brand/assets and shell; main page content and galleries; generation/contracts;
verification and docs. Local implementation is authorized. Commits, push, PR,
merge, publishing and release-peer synchronization remain separate gates.

## Phases 2–4: Red, implementation, green

Behavior-level red/green evidence:

- `node --test internal/tests/site-navigation.test.mjs`: failed on missing Our
  Work navigation; passed after shared shell implementation. Independent review
  found chrome entering fixed-height chart iframes; the same test gained an
  explicit embedded-document invariant, failed before the correction, then passed.
- `node --test internal/tests/services-overview.test.mjs`: failed with zero
  inline stages versus five required; passed after native disclosures.
- Daily renderer test expected the new shell and failed on the old script;
  passed after generation called `apply_shell`. Existing schema/negative tests
  remain in place.
- `python3 -m unittest discover -s internal/scripts -p 'test_site_shell.py'`:
  malformed-shell test failed when an unclosed header was accepted; passed
  after the parser rejected that state. Idempotence and article preservation pass.
- Original assessment attribution test caught two CTAs where five were
  required. Restoring campaign-aware shell links returned the unchanged test
  to green. All imported inquiry and conversion failure tests remain green.

Pure visual/copy changes use source validation and rendered review rather than
implementation-mirroring tests. Existing unpublished code retains its tests.

## Phase 5: Verification

- [x] `npm test` — 45/45 pass
- [x] `npm run build` — pass
- [x] `python3 -m unittest discover -s internal/scripts -p 'test_*.py'` — 19/19 pass
- [x] Changed JS/TS debt scan: public JS, 14 files in graph / 8 reported;
  internal JS, 33 in graph / 11 reported. Zero findings. Explicit runtime
  entrypoint `visitor-prompt.mjs` accounts for its absolute-URL dynamic import
  from `rudi-2026.js`; the initial orphan warning was a graph-resolution limit.
- [x] Desktop/mobile/keyboard browser checks: navigation, disclosure controls,
  images, library/player, attributed inquiry validation, no external submission.
- [x] RUDI design-rulebook scanner and rendered review.
- [x] Independent Standards / Spec / Proof review in a fresh context — all pass after focused confirmation.

## Phase 6: Closure

Final commands, screenshots and generated-output checks are recorded below.
Independent review found two concrete issues and both were corrected: iframe
chrome intrusion and low-contrast legacy article summary/date text. The latter
now uses #646671 on #FFFDF8 (5.61:1); browser computed styles verified subtitle,
date and reading-time elements. `legacy-article-contrast.png` records the result.

Worktree closeout: Repo Steward receipt `learnrudi-bright-site-20260911`, version
3, state `retained`, read back successfully. Repository ID:
`rudi-workspace--worktrees--learnrudi--bright-site-20260911`. Ledger root:
`/Users/hoff/.rudi/state/repo-steward`. Cleanup is ineligible because the worktree
is dirty and has preservation requirements; approval reference is null. Lease
released. The receipt identifies branch, base/head, task/agent lineage, Git
state, validation and local review authority. Original worktrees remain intact.

No new commits were created. Planned slices remain: unpublished-work
reconciliation; brand/shell; entry pages/galleries; Daily generation/contracts;
verification/docs. No push, PR, merge or deployment occurred.
Preserve the worktree; cleanup is not authorized. Admin-Mac propagation is
deferred until source acceptance and Git publication are separately authorized.

## Additional verified evidence

- `python3 internal/scripts/site_shell.py --check`: zero drift.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8088/`: 130 HTML
  responses, 33 asset responses, 163 unique local URLs; all pass.
- Compared every dated edition's `<main>` inner HTML with `git show HEAD:path`:
  all 72 byte-identical. Catalog ownership markers remain present.
- Reran brand export and compared SHA-256 before/after for six generated files:
  deterministic output. Event derivative checksums match the provenance manifest.
- Design-rulebook scanner: zero findings in the three rewritten entry pages
  and `rudi-chrome.css`. Manual layout review complements these source checks.
- `git diff HEAD --check`: pass after removing only newly introduced
  whitespace-only lines outside editorial content.
- Original package checkout remains clean. Original brand worktree retains its
  same eight staged retired-lockup deletions and one staged wordmark addition.
- No dependency additions, secrets, deployment settings or server-side changes.

## Browser evidence

At 390px and desktop widths: homepage, work hub, services overview, assessment,
inquiry form, learning library and managed service render without horizontal
overflow. Mobile menu opens with native controls; Enter opens a group; Escape
closes it and returns focus, then closes the menu and focuses Menu. Desktop
menu opens by keyboard and dismisses with Escape. Strategy expands inline.

Learning tabs switch player IDs and lesson titles; YouTube embeds render.
Assessment Start Here preserves utm_source/utm_campaign and interest, and the
inquiry form preselects AI Readiness / Assessment. Empty submission remains on
the form and focuses Name; no external inquiry was sent. Remote submission and
conversion completion are covered by existing mocked transport tests, not a
live lead. Event graphics load, keep their proportions and open their originals.

Independent review identified a pre-existing chart clipping issue in the
540px Catch-22 embed (content exceeds its height). The new chrome regression
is corrected; historical chart layout remediation remains separate. Owner:
website maintainer. Trigger: next edit to that article/visual. Closing proof:
all chart content reachable at article desktop/mobile iframe widths.

Final browser checks also covered About and the Daily archive. The dated Daily
article header now uses Paper White with Ink type through the legacy CSS bridge;
computed colors were verified after a cache-bypassing reload. Original article
markup remains unchanged. Mobile navigation was tested with JavaScript disabled:
Menu and How We Help opened, and How we work navigated successfully. JavaScript
was restored and the temporary viewport override reset afterward.

Saved local screenshots:
`/Users/hoff/.codex/visualizations/2026/09/11/01a09100-a696-75a3-b8ef-ed3ca60ba62d/verified-preview/`
contains `home-desktop.png`, `home-mobile.png`, `menu-mobile-no-js.png`,
`work-gallery-desktop.png`, and `daily-desktop.png`. The reviewed preview is
`http://127.0.0.1:8088/` served from this isolated worktree. These captures are
local QA artifacts, not deployed assets.

Final command rerun after corrections: 45 Node tests, 19 Python tests, static
build, shell drift check and whitespace check all pass. The edited navigation
test's follow-up debt scan also reports zero findings. Serving vectors match
all three corresponding internal brand masters byte-for-byte.

No full assistive-technology audit, live Formspree lead, production deployment,
or production analytics conversion was performed. External failure paths are
covered by the retained automated transport/attribution tests. These are release
validation limits, not claims of end-to-end production delivery.

Publication note: origin/main advanced during local review to `d8d78e7`, adding
the September 11 Daily first edition (#110). The task remains based on `5f6a774`
and preserves its 72 original editions. The release owner must integrate the
new Daily commit and rerun shell/catalog checks before any authorized publication;
this local design task does not overwrite or publish upstream news changes.

## Final verdict

**Ready for local design review.** Independent reviewer
`/root/independent_review` returned Standards / Spec / Proof / Overall **pass**
after checking both corrections, the saved screenshots, completed evidence,
zero-finding debt reports, and rerunning 45 Node tests, build and whitespace
checks. The 19 Python tests were independently verified earlier after the
embedded-document correction. No unresolved in-scope finding remains.

The local implementation goal is complete. Release/publication, upstream Daily
integration and admin-Mac synchronization remain outside this authorization.
