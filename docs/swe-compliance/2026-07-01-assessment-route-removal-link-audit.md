## Phase 0: Baseline And Manual Lookup

- Scope: Remove the deployable self-serve assessment page and prove public links still resolve.
- Files to inspect before editing: `public/assessment.html`, `public/framework.html`, public CTA pages, `public/js/header.js`, `vercel.json`, `internal/scripts/check-public-layout.mjs`, archive docs.
- Relevant SWE manual sections: master doctrine review dimensions, Appendix B frontend discipline, Appendix C testing proof discipline.
- Current-state commands: `git status -sb`, `rg` for assessment links/forms, public HTML inventory, build/link checks.
- Risks and invariants: Old `/assessment` URLs must not break on Vercel; users should contact RUDI instead of self-generating an assessment link; public local links and anchors must stay valid.
- Exit criteria: Complete. Assessment route and self-serve generator references were identified.

## Phase 1: Scope Lock

- In scope: Archive `public/assessment.html`, redirect old assessment URLs to `contact.html`, replace public assessment CTAs with contact CTAs, remove Framework assessment-link generator, validate local links and anchors.
- Non-goals: Removing assessment terminology from service descriptions, changing internal docs/scripts, redesigning Framework content.
- Expected files touched: Public CTA pages, `framework.html`, shared header, Vercel redirects, static checker, archive docs, this checklist.
- External inputs and trust boundaries: Public URLs and old bookmarked assessment links.
- Failure behavior to define: Old `/assessment` and `/assessment.html` URLs route to Contact.
- Exit criteria: Complete. Redirect and contact-led behavior are explicit.

## Phase 2: Red Tests

- Observable behavior to prove: Public pages do not link to removed assessment route; local anchors resolve.
- Test files to add or edit: Existing `internal/scripts/check-public-layout.mjs`.
- Red command: Not applicable; this is static route removal on an already green branch.
- Expected failure: Not applicable.
- Exit criteria: Complete. Red-test gap recorded and replaced with build/link/smoke proof.

## Phase 3: Implementation

- Implementation rules: Keep archive source under `docs/archive/public-pages/2026-07-01/`; replace user-facing assessment actions with Contact; avoid touching internal historical docs.
- Files allowed to change: Scope-locked public pages, redirect metadata, checker, archive ledger, SWE docs.
- Validation and error-handling requirements: `assessment.html` leaves `public/`; redirects preserve old public URLs.
- Observability requirements: Static checker validates file targets, anchors, and shared JS-injected navigation/footer links.
- Archived route: `public/assessment.html` moved to `docs/archive/public-pages/2026-07-01/public/assessment.html`.
- User-facing assessment actions now route to `contact.html`.
- Framework self-serve assessment-link generator and modal script were removed.
- Redirects added: `/assessment` and `/assessment.html` -> `/contact.html`.
- Exit criteria: Complete. Removed route is no longer deployable public content.

## Phase 4: Green Tests And Refactor

- Green command: `npm run build`.
- Refactor constraints: No broad content rewrite beyond contact-led CTA cleanup.
- Regression checks: Assessment-reference search; static checker; local smoke checks.
- Exit criteria: Complete. Build stays green.

## Phase 5: Full Verification

- Targeted tests: `npm run build`; `rg` for removed assessment route references in `public/`.
- Full suite: Static layout checker via build.
- Build/typecheck/lint: `npm run build`; `node --check` for edited JS.
- JS/TS debt scan, if applicable: Fallback scan for edited JS files.
- Live smoke checks: Kept pages return 200 locally; archived assessment page returns 404 locally and is covered by Vercel redirect.
- `npm run build`: passed; static checker now includes HTML and JS-injected local links.
- `node --check internal/scripts/check-public-layout.mjs && node --check public/js/header.js && node --check public/js/footer.js`: passed.
- JS/TS debt scan for edited JS files: passed with 0 findings.
- Assessment route search in `public/`: no deployable links or generator code remain.
- Internal local crawl: 53 local linked targets from HTML and shared JS passed; the Vercel Insights runtime script is excluded from local-only crawl results.
- External link check: 65 external attributes checked; 0 confirmed dead clickable links. Google font preconnect roots and the Formspree POST endpoint are script-check false positives; four URLs returned bot/auth/rate-limit statuses to scripted checks.
- Exit criteria: Complete. Verification passed with external bot-block caveat recorded.

## Phase 6: Docs, Contracts, And Closure

- Docs or API contracts updated: This checklist, archive README, previous consolidation checklist, Vercel redirects.
- Final files touched: `public/assessment.html` archive move, `public/framework.html`, public CTA/article pages, `public/js/header.js`, `public/prompting.html`, `internal/scripts/check-public-layout.mjs`, `vercel.json`, archive docs, SWE docs.
- Commands run and results: Build passed; JS syntax checks passed; debt scan passed with 0 findings; internal crawl passed; external link check found 0 confirmed dead clickable links.
- Accepted debt: Internal historical assessment docs/scripts remain archived/internal and are not deployable public links.
- Definition of Done: Public assessment route removed, old URLs redirect to Contact, all public local links and anchors pass validation, and PR branch is updated.
