# Workplace AI Playbook Product Contract — SWE Compliance Checklist

Date: 2026-08-17

Status: implementation complete; Git publication approved; PR review pending

## Phase 0: Baseline And Manual Lookup

- [x] Confirmed the dedicated `codex/workplace-ai-playbook-hub` worktree is clean.
- [x] Confirmed the existing hub, discovery links, cover assets, sitemap entry, and Start Here attribution flow are already implemented.
- [x] Confirmed baseline `npm test` and `npm run build` are green.
- [x] Read the Frontend Engineering and Software Testing appendices in the SWE Operating Manual.

## Phase 1: Scope Lock

- [x] In scope: align the hub with the finalized 43-page portrait Playbook and separate 19-sheet landscape Worksheet Toolkit.
- [x] In scope: replace the obsolete Working Edition concept with a Working Bundle containing both print products.
- [x] In scope: add direct free downloads for the guide PDF and complete worksheet toolkit PDF.
- [x] In scope: preserve offer-specific, allowlisted Start Here attribution for each finalized physical product.
- [x] Expected files: the playbook hub HTML, Start Here attribution module and tests, a static hub contract test, package test script, README, and this checklist.
- [x] Non-goals: checkout, payments, fulfillment, public price commitments, PDF regeneration, changes to the playbook publication repository, deployment, or Git publication.
- [x] External boundary: URL query parameters remain allowlisted; unknown interest, offer, and source values must be discarded.
- [x] Failure behavior: external publication links may fail independently without preventing the native RUDI landing page or inquiry path from rendering.

## Phase 2: Red Tests

- [x] Observable behavior: the finalized product offers are accepted by Start Here and displayed accurately on the public hub.
- [x] Test files: `internal/tests/start-here-prefill.test.mjs` and `internal/tests/playbook-product-hub.test.mjs`.
- [x] Red command: `npm test`.
- [x] Expected failure observed: four tests failed because finalized offer identifiers, direct PDF links, and the 43-page/19-sheet content contract were not yet implemented.

## Phase 3: Implementation

- [x] Update only the allowed files from Phase 1.
- [x] Keep all public price hypotheses off the page until pricing and fulfillment are confirmed.
- [x] Preserve semantic headings, real links, keyboard behavior, and the existing responsive design system.
- [x] Add no dependencies and no client-side state beyond the existing validated URL attribution.

## Phase 4: Green Tests And Refactor

- [x] Green command: `npm test` (7 tests passed).
- [x] Refactor only after the unchanged red command passes.
- [x] Rerun the focused suite after moving the toolkit download outside the horizontally scrollable offer table (7 tests passed).

## Phase 5: Full Verification

- [x] Run `npm test` (7 tests passed).
- [x] Run `npm run build` (`Static site layout check passed.`).
- [x] Run structural JS fallback checks because this repo has no debt-scan policy (0 errors; one accepted HTML-entrypoint false positive).
- [x] Serve the site locally and smoke-check the 43-page/19-sheet contract, offer-specific Start Here context, and absence of the retired Working Edition.
- [x] Crawl the local site (100 HTML responses, 15 asset responses, 115 unique local URLs).
- [x] Verify both external PDF endpoints return HTTP 200 with `application/pdf` content.
- [ ] Review the product hub at desktop and mobile widths. Accepted gap: browser-driven visual QA was not requested for this implementation pass; responsive layout continues to use the site's existing tested design system.

## Phase 6: Docs, Contracts, And Closure

- [x] Update the README page inventory with the product hub.
- [x] Record final files, proof commands, accepted debt, and Definition of Done.
- [x] Definition of Done: the hub accurately presents the two print products and Working Bundle, exposes both free PDF downloads, preserves validated inquiry attribution, and passes focused and full local verification.

### Final files

- `public/insights/workplace-ai-enablement-playbook/index.html`
- `public/js/start-here-prefill.mjs`
- `internal/tests/start-here-prefill.test.mjs`
- `internal/tests/playbook-product-hub.test.mjs`
- `package.json`
- `README.md`
- `docs/swe-compliance/2026-08-17-workplace-ai-playbook-product-contract.md`

### Proof commands

- `npm test`
- `npm run build`
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8080/`
- `node /Users/hoff/dev/dev-help/agent-debt-scan.js --repo . --graph-root . --scope . --files public/js/start-here-prefill.mjs,internal/tests/start-here-prefill.test.mjs,internal/tests/playbook-product-hub.test.mjs --json --heuristics`
- `git diff --check`

### Accepted debt and handoff notes

- Checkout, price publication, printing, inventory, and fulfillment remain deliberately out of scope until those operating decisions are confirmed.
- The structural scanner reports `public/js/start-here-prefill.mjs` as an orphan because the fallback scan has no HTML entrypoint configuration; `public/start-here/index.html` imports it and the local smoke check exercised its output.
- Desktop/mobile browser visual QA remains a pre-publication check.
- The dedicated branch already contains earlier site-redesign and Warren migration commits; confirm branch strategy before merging it independently.
- The playbook publication repository contains pre-existing user changes and was not modified.
- Git publication was approved after local verification. Deployment and PR merging remain separate approval gates.
