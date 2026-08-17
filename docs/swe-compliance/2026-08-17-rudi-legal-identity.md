# RUDI Legal Identity And Admin Contact — SWE Compliance Checklist

Date: 2026-08-17

Status: implementation complete; Git publication approved; PR review pending

## Scope

- [x] In scope: identify RUDI LLC as the operating legal entity on Privacy and Terms.
- [x] In scope: replace the public legal and inquiry email with `rudi@learnrudi.com`.
- [x] In scope: update the legal-page revision label to August 2026.
- [x] Expected files: `public/privacy.html`, `public/terms.html`, `public/start-here/index.html`, `internal/tests/legal-contact.test.mjs`, and this checklist.
- [x] Non-goals: change substantive policy rights or promises, configure the managed mailbox/agent, change mailing address, deploy, or publish Git changes.

## Red-Green-Refactor

- [x] Red: two legal/contact contract tests failed against the former entity and email.
- [x] Green: the unchanged test passes after the factual identity updates (13/13 tests).
- [x] Refactor verification: the full test and build suites remain green.

## Verification

- [x] `npm test` (13/13 tests passed).
- [x] `npm run build` (`Static site layout check passed.`).
- [x] `git diff --check`.
- [x] Confirm no former entity or `hoff@learnrudi.com` reference remains on the three public surfaces.
- [x] Confirm legal pages contain no legacy-site destinations.
- [x] Run the local crawler (100 HTML responses, 15 asset responses, 115 unique local URLs).
- [x] Run the JS structural fallback scan for the added test file (0 findings).

## Definition of Done

- [x] Privacy and Terms consistently identify RUDI LLC and the August 2026 revision.
- [x] Privacy, Terms, and Start Here consistently expose `rudi@learnrudi.com`.
- [x] The change remains factual and limited; managed-agent routing is reported separately because it is not represented in this website repository.

## Managed-agent handoff

- The website contains no legacy-site destination on either legal page.
- The separate Managed AI service-desk repository still documents `hoff@learnrudi.com` as its mailbox/provider account in its README, runbook, contract, ADR, and several tests, while newer gateway coverage already uses `rudi@learnrudi.com`.
- That mixed service-desk state was not modified here because changing a managed mailbox watcher, agent signature, or reply destination is a separate operational change with different verification and external-side-effect boundaries.
- Git publication was approved after local verification. Deployment, PR merging, and mailbox changes remain separate approval gates.
