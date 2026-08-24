# RUDI Daily role-aware editorial bindings

Status: source release ready; controlled production recovery pending

## Phase 0: Baseline And Manual Lookup

- Scope: align the LearnRUDI renderer's title-substring link resolution with
  the Editorial Newsletter Pipeline's accepted editorial evidence roles, then
  recover the failed August 23 final and August 24 first publications.
- Files to inspect before editing:
  `internal/scripts/build_daily_edition.py`,
  `internal/scripts/test_build_daily_edition.py`,
  `docs/rudi-daily-json-renderer.md`, and the upstream bundle/editorial
  contracts in the Editorial Newsletter Pipeline.
- Relevant SWE manual sections: Engineering Operating Manual Index, Appendix C
  testing doctrine, Appendix D debugging doctrine, Appendix H deployment and
  recovery, and the Agent Co-Pilot Operating Standard.
- Current-state commands: repository identity/status/remotes/worktrees; exact
  August 23/24 non-writing renderer checks; Compute status; LearnRUDI branch,
  PR, remote-ref, and live-surface inspection.
- Risks and invariants: editorial prose may cite only accepted current-event
  evidence; all successful bundle sources remain visible and counted; existing
  bundle/editorial artifacts remain immutable; publication stays site-only;
  recovery preserves the original Compute occurrence identities and runs final
  before first.
- Initial risk tier and rationale: high because the narrow renderer change will
  be promoted through GitHub, Vercel, and live publication recovery.
- Exit criteria: isolated clean worktree at current `origin/main`, exact scope
  locked, incident reproduced, and rollback/recovery boundaries recorded.

## Phase 1: Scope Lock

- In scope: preserve `content_role` from the bundle; validate and resolve open,
  Q&A, and FAQ links against `news_story`, `tool_or_product`,
  `research_paper`, and `social_post`; add behavior regressions; update the
  renderer contract; release through PR; recover and verify August 23/24.
- Non-goals: no bundle/editorial schema version change, recapture,
  reannotation, editorial rewrite, database/config/schedule changes, social
  publication, or general renderer refactor.
- Expected files touched: this checklist,
  `internal/scripts/build_daily_edition.py`,
  `internal/scripts/test_build_daily_edition.py`, and
  `docs/rudi-daily-json-renderer.md`.
- External inputs and trust boundaries: bundle and editorial JSON are untrusted
  bounded file inputs; `content_role` must be validated before eligibility;
  Git/GitHub/Vercel/live HTTP are separate fail-closed boundaries.
- Failure behavior to define: a substring matching exactly one accepted role
  resolves to that source even when excluded catalog sources share the prefix;
  zero or multiple accepted matches fail before a page write.
- Authorized external actions: commit, push, pull request, merge after green
  CI/review, synchronized automation checkout, exact ordered replay, Vercel
  deployment, and live read-back, as approved by the user's goal.
- Review and approval gates: red proof before implementation; targeted/full
  green proof; independent read-only review; GitHub checks before merge; exact
  control-plane readiness before each replay.
- Exit criteria: scope remains confined to the four expected files and the
  approved runtime recovery actions.

## Phase 2: Red Tests

- Observable behavior to prove: one accepted news source and one excluded
  context source may share a title prefix; editorial links must resolve to the
  accepted source. Two accepted sources sharing the binding remain ambiguous.
- Test files to add or edit: `internal/scripts/test_build_daily_edition.py`.
- Red command: `python3 -m unittest discover -s internal/scripts -p 'test_*.py' -v`.
- Expected failure: the mixed-role fixture is rejected as matching two bundle
  sources before the implementation filters the binding universe.
- Red result: one deterministic error in the new regression while the existing
  15 tests passed; `load_editorial_content` rejected `Shared incident report`
  because it matched both bundle sources.
- Exit criteria: failure is deterministic and attributable to the production
  incident contract mismatch.

## Phase 3: Implementation

- Implementation rules: smallest consumer-boundary correction; keep every
  source in counts, story sections, citation JSON-LD, and ItemList JSON-LD;
  change only editorial binding validation and resolution.
- Files allowed to change: the four files named in Phase 1.
- Validation and error-handling requirements: require a supported
  `content_role`; require exactly one accepted match; preserve fail-before-write
  behavior and existing schema/date/count checks.
- Observability requirements: retain specific invalid-binding failures and
  non-writing `--check-only` proof for the incident artifacts.
- Exit criteria: the red test passes without weakening existing ambiguity or
  bundle-integrity assertions.

## Phase 4: Green Tests And Refactor

- Green command: unchanged Phase 2 command.
- Refactor constraints: no unrelated template, catalog, layout, or dependency
  changes.
- Regression checks: exact August 23 final and August 24 first `--check-only`
  builds; verify eligible target URLs in rendered in-memory output.
- Green result: 16 of 16 Python script tests pass. The regression verifies the
  editorial/open and Q&A links use the eligible source, the excluded source
  remains in the visible catalog and both JSON-LD collections, and a
  multi-eligible collision fails without creating a page.
- Incident preflight result: August 23 final passes at 47 stories, 48 links,
  and 10 categories; August 24 first passes at 40 stories, 40 links, and 9
  categories. Both used `--check-only` and wrote no page.
- Exit criteria: focused suite and incident preflights are green.

## Phase 5: Full Verification

- Targeted tests: Python renderer tests and existing static-site Node tests.
- Full suite: `npm test` plus the complete Python script test discovery.
- Build/typecheck/lint: `npm run build`; Python byte compilation for edited
  scripts.
- JS/TS debt scan, if applicable: not applicable unless JS/TS files enter scope.
- Live smoke checks: after release, exact August 23 final then August 24 first
  replay; page, Insights hub, Daily catalog, sitemap, and checkpoint read-back.
- Independent review: fresh-context read-only review of task contract, diff,
  tests, and recovery evidence before commit/merge.
- Risk-tier approval: user authorized accomplishing the mapped goal; GitHub CI
  and fail-closed runtime gates remain mandatory.
- Exit criteria: no blocking review finding, green CI/local checks, clean diff,
  and verified rollback path.

## Phase 6: Docs, Contracts, And Closure

- Docs or API contracts to update: role-aware binding semantics in
  `docs/rudi-daily-json-renderer.md` and final evidence in this checklist.
- Final files touched: `internal/scripts/build_daily_edition.py`,
  `internal/scripts/test_build_daily_edition.py`,
  `docs/rudi-daily-json-renderer.md`, and this checklist.
- Commands run and results: 16 Python tests pass; 24 Node tests pass;
  `npm run build` passes the static-site layout check; Python byte compilation
  and `git diff --check` pass; both exact incident renders pass in check-only
  mode.
- Evidence artifacts: commit/PR/check identities, Compute job/checkpoint IDs,
  deployed site commit, and cache-busted live status.
- Independent-review result: no blocking correctness, security, or recovery
  finding. The reviewer independently reran all 16 Python tests and both exact
  incident preflights. Its initial non-blocking request for stronger catalog,
  structured-data, and no-write assertions was incorporated and rerun green.
- Final verdict: ready for source release and the approved controlled recovery;
  production closure still requires merged GitHub CI, ordered exact replay,
  and cache-busted live read-back.
- Accepted debt: none currently.
- Proof gaps: production recovery remains pending until source release is
  merged and the exact occurrences are replayed.
- Definition of Done: renderer contract aligned; tests/build/review green;
  source merged and synchronized; August 23 final and August 24 first verified
  live; final control-plane report healthy with disabled social channels
  unchanged.
