## Phase 0: Baseline And Manual Lookup

- Scope: Consolidate the remaining public site to the agreed RUDI page model by archiving inactive certificate pages, duplicate state/federal collateral, and Studio.
- Files to inspect before editing: `public/certificates-business.html`, `public/certificates-education.html`, `public/certificates.html`, `public/get-certificate.html`, `public/state-partners.html`, `public/nsf-techaccess.html`, `public/studio.html`, `public/js/header.js`, `public/js/footer.js`, `public/sitemap.xml`, `vercel.json`, `internal/scripts/check-public-layout.mjs`.
- Relevant SWE manual sections: master doctrine review dimensions, Appendix B frontend discipline, security trust-boundary checklist.
- Current-state commands: `git status -sb`, `rg` for active references, public HTML inventory, `npm run build`.
- Risks and invariants: Keep founder/about separate; keep Ohio, OpenAI/Codex, and noindex survey for now; preserve old public URLs through redirects; do not break active local links.
- Exit criteria: Complete. Active references to pages being removed were identified before files left `public/`.

## Phase 1: Scope Lock

- In scope: Redirect/archive certificate pages, state/federal duplicate pages, and Studio; update active links, shared nav/footer, sitemap, Vercel redirects, static checker allow-list, and archive docs.
- Non-goals: Rewriting kept pages, merging founder/about, removing Ohio/OpenAI/survey, changing insight article content, visual redesign.
- Expected files touched: redirect metadata, shared nav/footer, public pages with links to removed pages, static checker, archive directory, archived source files.
- External inputs and trust boundaries: Public URLs and client-facing pages; old certificate claim form; old Studio product page.
- Failure behavior to define: Old URLs redirect to current canonical pages rather than exposing stale content.
- Exit criteria: Complete. Redirect destinations are explicit in `vercel.json`.

## Phase 2: Red Tests

- Observable behavior to prove: Static build/link checker passes after removed pages leave `public/`; active public pages do not link to removed routes.
- Test files to add or edit: Existing `internal/scripts/check-public-layout.mjs`.
- Red command: Not applicable; this is a static content consolidation on a green baseline.
- Expected failure: Not applicable.
- Exit criteria: Complete. Red-test gap recorded and replaced with build/link/smoke proof.

## Phase 3: Implementation

- Implementation rules: Move archived content to `docs/archive/public-pages/2026-07-01/`; add Vercel redirects for old public URLs; keep changes scoped to route consolidation.
- Files allowed to change: Scope-locked files only unless static validation exposes another active link.
- Validation and error-handling requirements: Removed pages route to `ai-training.html`, `capabilities.html`, or `contact.html`.
- Observability requirements: Static site uses build checks and local smoke checks.
- Removed from deployable `public/`: `certificates.html`, `certificates-business.html`, `certificates-education.html`, `get-certificate.html`, `nsf-techaccess.html`, `state-partners.html`, `studio.html`.
- Archive destination: `docs/archive/public-pages/2026-07-01/public/`.
- Active navigation cleanup: certificate and Studio links now point to AI Training, Capabilities, or Contact; partner collateral cards now point to Capabilities.
- Exit criteria: Complete. Removed pages are no longer deployable public content.

## Phase 4: Green Tests And Refactor

- Green command: `npm run build`.
- Refactor constraints: No broad content rewrite beyond active-link cleanup.
- Regression checks: Static checker, active route smoke checks, redirect table inspection.
- Exit criteria: Complete. Build stays green.

## Phase 5: Full Verification

- Targeted tests: `npm run build`; `rg` for removed-route references in `public/`.
- Full suite: Static layout checker via build.
- Build/typecheck/lint: `npm run build`; `node --check` for edited JS files.
- JS/TS debt scan, if applicable: Fallback debt scan for edited JS files if no repo-local policy exists.
- Live smoke checks: Verify kept canonical pages locally.
- `npm run build`: passed.
- Removed-route search in `public/`: no matches for archived route slugs.
- `node --check internal/scripts/check-public-layout.mjs`: passed.
- `node --check public/js/header.js`: passed.
- `node --check public/js/footer.js`: passed.
- JS/TS debt scan for edited JS files: passed with 0 findings.
- Local smoke checks on port 8080: kept routes returned 200; archived local files returned 404.
- Exit criteria: Complete. Verification passed.

## Phase 6: Docs, Contracts, And Closure

- Docs or API contracts updated: This checklist, archive README, sitemap, Vercel redirects, static public layout checker.
- Final route count: 37 deployable HTML files in `public/`, down from 44 after the previous archive pass.
- Redirect contract: certificate routes -> `/ai-training.html` or `/contact.html`; state/federal collateral -> `/capabilities.html`; Studio -> `/ai-training.html`.
- Accepted debt: `framework.html`, `ohio.html`, `openai-codex-enablement.html`, and noindex `survey.html` remain intentionally preserved for now. Follow-up removed `assessment.html` in favor of contact-led intake.
- Definition of Done: Complete. Target page set is reflected in deployable public routes, old URLs redirect, build passes, and final route count is reported.
