# Editorial JSON Renderer — SWE Compliance Checklist

Date: 2026-08-08

Tracking: private Editorial issue learnrudi/editorial-newsletter-pipeline#8

Status: implementation and local verification green; integration canary pending

## Phase 0: Baseline And Manual Lookup

- [x] Confirmed the isolated branch starts at `0f83910b254afe82475629410d8fd40d83b6443f` with a clean worktree.
- [x] Inspected the deterministic daily builder, current Python content registry, bundle loader, structured-data reconciliation, layout checker, index, sitemap, and navigation behavior.

## Phase 1: Scope Lock

- [x] In scope: optionally load a versioned, validated editorial JSON file for an explicitly requested date.
- [x] In scope: preserve existing `daily_content.py` behavior for historical and manual builds.
- [x] In scope: reject unknown keys, wrong dates, malformed prose/Q&A, unresolved evidence references, and unsafe file paths before writing HTML.
- [x] Expected files: `internal/scripts/build_daily_edition.py`, `internal/scripts/test_build_daily_edition.py`, and this checklist.
- [x] Non-goals: content generation, network calls, Git operations, deployment, social publication, or changes to historical committed editions.

## Phase 2: Red Tests

- [x] Proved valid versioned JSON can render without a `DAY` entry.
- [x] Proved malformed or evidence-unresolved JSON fails before output write.
- [x] Red command: `python3 -m unittest discover -s internal/scripts -p 'test_*.py' -v`; initial failures were missing JSON CLI flags/modules and unresolved source bindings.

## Phase 3: Implementation

- [x] Added closed-schema bundle/editorial loaders and explicit CLI flags.
- [x] Converted validated JSON into the existing internal rendering shape.
- [x] Preserved default manual behavior and all count invariants.

## Phase 4: Green Tests And Refactor

- [x] Reran the unchanged focused command green: 4 tests.

## Phase 5: Full Verification

- [x] Ran the focused Python tests and `npm run build`; both are green.
- [ ] Verify generated source, story, ItemList, citation, FAQ, index, sitemap, and navigation counts during the integration canary.

## Phase 6: Docs, Contracts, And Closure

- [x] Recorded local commands, results, files, and the renderer contract; PR and canary evidence remain pending.
- [ ] Definition of Done: Editorial can supply validated JSON to the deterministic builder without modifying executable content code.
