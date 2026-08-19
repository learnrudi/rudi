# RUDI Daily Catalog Repair — SWE Compliance Checklist

Date: 2026-08-18

Status: implementation and local verification green; production recovery remains outside this worktree

Risk tier: Medium — this is a user-visible catalog contract used by an automated publication job, but the change is local, reversible, and does not authorize publication.

## Phase 0: Baseline And Manual Lookup

- [x] Confirmed the isolated worktree starts clean at `8044b92` on `codex/rudi-daily-catalog-repair-20260818`.
- [x] Inspected the catalog updater, its unit test, the redesigned Insights and RUDI Daily archive pages, the static-site build checker, and the renderer contract.
- [x] Consulted the Engineering Operating Manual index plus the testing, debugging, and background-job guidance for behavior tests, minimal correction, fail-closed boundaries, and idempotency.

## Phase 1: Scope Lock

- [x] In scope: explicit machine-owned markers for the Insights latest-edition card and the dedicated RUDI Daily archive.
- [x] In scope: idempotent latest-card replacement, archive insertion/update with newest-first ordering, an absolute archive path/default, no-write check-only behavior, tests, build checks, and renderer documentation.
- [x] Expected files: `internal/scripts/update_daily_catalog.py`, `internal/scripts/test_update_daily_catalog.py`, `public/insights/index.html`, `public/insights/rudi-daily/index.html`, `internal/scripts/check-public-layout.mjs`, `docs/rudi-daily-json-renderer.md`, and this checklist.
- [x] Non-goals: generated editions, sitemap content beyond updater tests, other site pages/assets, the production automation checkout, Editorial/Compute state, Git publication, deployment, or external services.
- [x] Failure behavior: reject missing or ambiguous markers, non-absolute/non-regular archive paths, malformed managed archive entries, and duplicates before any write.
- [x] Authorized external actions: none.

## Phase 2: Red Tests

- [x] Added a behavior-level regression using the redesigned latest-card structure and explicit ownership markers.
- [x] Red command: `python3 -m unittest discover -s internal/scripts -p 'test_update_daily_catalog.py' -v`.
- [x] Observed the expected failure: `ValueError: index daily grid marker is missing or ambiguous`.

## Phase 3: Implementation

- [x] Replaced the legacy generic-grid dependency with explicit marker-bounded renderers.
- [x] Added absolute archive path validation/default and included the archive in the precompute-before-write validation boundary.
- [x] Preserved the redesigned card markup and archive contents, with seven featured entries and older managed dates in a newest-first list.
- [x] Made the archive heading month-neutral and protected it with a unique marker for clean month rollover.
- [x] Gated the main latest card on the newest rendered date so an older retry cannot advance a stale card.

## Phase 4: Green Tests And Refactor

- [x] Reran the red command unchanged and confirmed the regression green.
- [x] Added focused coverage for idempotency, chronological ordering, historical closeout, month rollover, marker ambiguity, stale-card gating, absolute archive paths, and check-only no-write behavior.

## Phase 5: Full Verification

- [x] Python script suite: `python3 -m unittest discover -s internal/scripts -p 'test_*.py' -v` — 12 passed.
- [x] JavaScript suite: `npm test` — 24 passed.
- [x] Static build: `npm run build` — passed.
- [x] Syntax/diff: `python3 -m compileall -q ...` and `git diff --check` — passed.
- [x] Real production-file check: explicit absolute `--index`, `--archive`, `--sitemap`, and `--insights-dir` with `--check-only` returned the intended three changed catalog files; the before/after diff SHA remained identical.
- [x] Independent read-only review found a stale-card ordering bug; the newest-rendered-date gate and regression fixed it. Re-review found no remaining blocking findings.
- [x] Live smoke is not authorized because this task explicitly excludes deployment and external mutation; local real-file `--check-only` is the smoke proof.

## Phase 6: Docs, Contracts, And Closure

- [x] Updated the renderer contract with the archive input, month-neutral heading, marker ownership, newest-date, ordering, and idempotency rules.
- [x] Final files: updater, updater tests, main Insights page, Daily archive page, layout checker, renderer docs, and this checklist only.
- [x] Accepted debt: writes are atomic per file rather than transactional across the full file batch; all reads, validation, and rendering complete before the first write, but a local I/O failure during the write loop could leave a partial worktree for the publication gate to reject.
- [x] Proof gap: no deployed/live verification, PR, merge, or production replay was authorized in this scoped repair.
- [x] Verdict: ready for controlled integration and production recovery by the owning workflow.
- [x] Definition of Done: the updater safely maintains both redesigned catalog surfaces, remains idempotent under current and historical closeout retries, rolls across months without stale labeling, and fails before writes when its ownership contract is missing or ambiguous.
