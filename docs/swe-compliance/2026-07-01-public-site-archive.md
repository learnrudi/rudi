## Phase 0: Baseline And Manual Lookup

- Scope: Archive deployable public pages identified as stale, orphaned, internal-only, or duplicated by the public-site cleanup audit.
- Files to inspect before editing: `public/survey-admin.html`, `public/assets/certificates/`, `public/tiktok.html`, `public/webinars/`, `public/research.html`, `public/resources.html`, `public/case-studies/warren-county-esc-deck.html`, shared header/footer, sitemap, Vercel redirects, static layout checker.
- Relevant SWE manual sections: master doctrine review dimensions, Appendix B frontend discipline, security trust-boundary checklist.
- Current-state commands: `git status -sb`, public HTML inventory, inbound-link search with `rg`, `npm run build`.
- Risks and invariants: Do not break active funnel pages, keep stale public URLs routed to current pages, do not leave admin/draft artifacts deployable, avoid removing legal/privacy pages or active case-study proof.
- Exit criteria: Active links no longer point to archived pages before files leave `public/`. Completed.

## Phase 1: Scope Lock

- In scope: Move archive candidates out of deployable `public/`; replace stale URL handling with Vercel redirects; update internal links, sitemap, and shared nav/footer.
- Non-goals: Redesigning kept pages, deleting archived source permanently, consolidating certificate strategy, rewriting all old custom navs.
- Expected files touched: shared header/footer, education certificates CTA, Warren County case study CTA, sitemap, Vercel routes, static layout checker allow-list, archive directory, archived source files.
- External inputs and trust boundaries: Public URLs, static admin-like survey page, draft certificate artifact, stale registration URLs.
- Failure behavior to define: Archived public URLs redirect to current canonical pages rather than exposing stale content.
- Exit criteria: Files to archive and redirect destinations are explicit. Completed.

## Phase 2: Red Tests

- Observable behavior to prove: Build/link checker should pass after archived files leave `public/`; no active internal links should point to archived routes.
- Test files to add or edit: Existing `internal/scripts/check-public-layout.mjs` and public HTML route files.
- Red command: Not applicable; this is a static content archive pass on a currently green site.
- Expected failure: Not applicable.
- Exit criteria: Red-test gap recorded and replaced with static link/build/smoke proof. Completed.

## Phase 3: Implementation

- Implementation rules: Move archived content to `docs/archive/public-pages/2026-07-01/`; use Vercel redirects for old public URLs; update active internal links before removal.
- Files allowed to change: Scope-locked files only.
- Validation and error-handling requirements: Old URLs route to current public pages: AI training, insights, prompting, case study, get certificate, or homepage as appropriate.
- Observability requirements: Static site relies on build/link checks and local smoke checks.
- Exit criteria: Archive candidates are no longer deployable public pages. Completed.

## Phase 4: Green Tests And Refactor

- Green command: `npm run build`.
- Refactor constraints: No broad content refactor beyond replacing links to archived pages.
- Regression checks: Active links, sitemap, redirects, static build.
- Exit criteria: Build stayed green after archive.

## Phase 5: Full Verification

- Targeted tests: `npm run build` passed; targeted `rg` found no active public links to archived local routes.
- Full suite: Package exposes static layout checker as build.
- Build/typecheck/lint: `npm run build` passed; `node --check` passed for `internal/scripts/check-public-layout.mjs`, `public/js/header.js`, and `public/js/footer.js`.
- JS/TS debt scan, if applicable: No repo-local debt policy exists. Fallback debt scan passed with 0 findings for edited JS files.
- Live smoke checks: Local static server returned 200 for `/`, `/ai-training.html`, `/ai-training/live-workflow-clinic.html`, `/case-studies/warren-county-esc.html`, `/insights/`, and `/prompting.html`. Vercel redirects were verified by route table inspection.
- Exit criteria: Static validation passed and archived page references are either in archive docs or Vercel redirects.

## Phase 6: Docs, Contracts, And Closure

- Docs or API contracts to update: This checklist and sitemap/redirect metadata.
- Final files touched: `public/js/header.js`, `public/js/footer.js`, `public/certificates-education.html`, `public/case-studies/warren-county-esc.html`, `public/sitemap.xml`, `public/survey.html`, `public/training.html`, `vercel.json`, `internal/scripts/check-public-layout.mjs`, `docs/archive/public-pages/2026-07-01/`, and this checklist.
- Commands run and results: `npm run build` passed; JS syntax checks passed; fallback debt scan passed with 0 findings; local smoke checks returned 200 for kept canonical pages.
- Accepted debt: Follow-up consolidation archived `studio.html`, certificate pages, and state/federal collateral pages. `founder.html` remains intentionally separate from `about.html`; `survey.html` remains deployable but noindexed. Existing redirect stubs remain in `public/` to preserve old URLs.
- Definition of Done: Stale/internal pages archived, active links fixed, deploy surface smaller, build green, and remaining decisions listed.
