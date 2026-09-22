# Restore Daily publication after the footer refresh

## Phase 0: Baseline and manual lookup

- Baseline: LearnRUDI `4bc9c19`; isolated `codex/daily-branding-check-20260922`.
- Incident: September 22 capture and editorial copy completed, but the renderer
  rejected the current site shell because its validator required retired footer
  wording. The exact saved edition reproduces this with `--check-only`.
- Manual: index, Engineering Quick Reference, master Appendix D; apply the
  red-green loop and independent Standards / Spec / Proof review.
- Risk: narrow code change; production recovery has high operational impact.
- Exit: real edition renders, existing integrity checks remain enforced, and
  the original failed occurrence can complete with live publication evidence.

## Phase 1: Scope lock

- Change only the Daily branding invariant, its regression test, and this record.
- Shared contract: site_shell owns presentation; the Daily validator requires
  enduring RUDI identity, not a mutable marketing tagline. No helper extraction.
- Preserve source bindings, counts, navigation, design and malformed-input checks.
- User approved the proposed repair and failed website release recovery on
  September 22. Integrate through a feature PR and replay the original occurrence.
- No schedule changes, fresh capture, historical posting, or source-copy rewrites.
- Preserve original failure artifacts and branches; no destructive cleanup.
- One verified source/test/docs commit; separate generated-edition release.

## Phase 2: Red test

- Add a rendered-page regression: accept current shared branding while rejecting
  removal of the enduring Responsible Use of Digital Intelligence identity.
- Command: `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest
  test_build_daily_edition.EditorialJsonRendererTests.test_verify_accepts_current_branding_and_requires_rudi_identity`
  from `internal/scripts`.
- Expected red: `new Daily positioning is missing` on the valid current page.
- Observed red: exactly that assertion, one failing test before implementation.

## Phase 3: Implementation

- Replace the retired tagline check with the enduring RUDI identity check.
- Keep fail-closed behavior for missing identity and all existing integrity checks.
- No dependencies, schemas, JS/TS, or editorial artifacts change.

## Phase 4: Green and refactor

- Rerun the identical regression command, then all Python renderer/catalog/shell tests.
- Run the actual September 22 bundle and editorial JSON with `--check-only`.
- No refactor planned.
- Observed green: the unchanged focused regression passes, including rejection
  of missing identity. All 21 Python tests pass. The saved September 22 edition
  passes check-only with 40 stories, 40 links and eight categories.

## Phase 5: Verification

- Passed: regression, 21 Python tests, all 54 `npm test` cases and `npm run build`.
- Independent review: fresh `daily_branding_review` agent reports Standards,
  Spec and Proof pass with no actionable findings. It independently reproduced
  the base regression and reran all tests, build and actual-edition check-only.
- Pending: production recovery.
- JS/TS debt scan not applicable: no JS/TS edits.
- Production proof: completed checkpoint, exact date/source counts, public page,
  canonical URL, catalog and sitemap; no HTTP-200-only success claim.
- Primary Mac has unrelated dirty site work. Preserve it; use an isolated
  accepted-revision checkout for parity verification.

## Phase 6: Closure

- Verification and independent review above are complete. Integration,
  production and peer verification are recorded by the release task.
- Worktree closeout proof gap: Repo Steward preflight failed because configured
  enrollment root 2 does not exist. Preserve this worktree; owner is the release
  operator, trigger is repaired Repo Steward enrollment, closing proof is a
  read-back retained receipt. No cleanup is authorized or performed.
- Known adjacent debt: release wrapper reports generic subprocess failure;
  pre-PR render failure leaves the release checkout on its dated branch. Preserve
  and reconcile that state for this occurrence; do not expand into runtime changes.
- Rollback: preserve original artifacts; revert the repair through Git if needed.
  Do not reset repositories or automatically repost social content.
