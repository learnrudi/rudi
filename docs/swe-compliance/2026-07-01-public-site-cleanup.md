## Phase 0: Baseline And Manual Lookup

- Scope: Audit and clean the public static site surface for obvious overgrowth, with first-pass implementation focused on the training/offer funnel and public route exposure.
- Files to inspect before editing: `public/`, `public/ai-training.html`, `public/ai-training/camp-claude.html`, `public/ai-training/live-ai-training-camp/index.html`, `public/ai-training/custom.html`, `public/camp-claude.html`, `public/training.html`, `public/sitemap.xml`, `vercel.json`, `internal/scripts/check-public-layout.mjs`.
- Relevant SWE manual sections: master doctrine review dimensions, Appendix B frontend discipline, security review trust-boundary checklist.
- Current-state commands: `git status -sb`, `rg --files public`, `npm run build`, public HTML metadata inventory.
- Risks and invariants: Keep deployed routes valid, keep legacy redirects functional, avoid deleting assets or long-lived pages without evidence, avoid widening external scripts/forms, keep build/link validation green.
- Exit criteria: Baseline build passed and cleanup scope was locked before edits.

## Phase 1: Scope Lock

- In scope: Reduce duplicated Camp Claude/training offer paths, simplify the top-level training page, make sitemap and route validation match the intended public surface, keep legacy URLs redirected.
- Non-goals: Rewriting every insight article, rebuilding the brand system, adding new dependencies, removing legal/privacy pages, replacing the whole static architecture.
- Expected files touched: `public/ai-training.html`, `public/ai-training/live-ai-training-camp/index.html` or redirect targets if consolidated, `public/camp-claude.html`, `public/sitemap.xml`, `vercel.json`, `internal/scripts/check-public-layout.mjs`, this checklist.
- External inputs and trust boundaries: Public HTML routes, external form/payment/mail links, embedded third-party scripts/iframes.
- Failure behavior to define: Old public URLs should redirect to the canonical training page or offer page rather than dead-ending.
- Exit criteria: A smaller canonical training funnel was defined before edits began.

## Phase 2: Red Tests

- Observable behavior to prove: Public static pages should not reference missing local assets; deploy surface should only contain explicitly allowed public root files/directories.
- Test files to add or edit: Existing `internal/scripts/check-public-layout.mjs` may be updated if the allowed route surface changes.
- Red command: Not applicable for this static content cleanup because the current build is green and the goal is reducing duplicate content, not fixing a failing behavior.
- Expected failure: No red test expected; proof relies on pre/post inventory, build checker, and live smoke checks.
- Exit criteria: Residual test gap recorded. Red-green was not used because the baseline was already green and the task was static content consolidation, not behavior repair.

## Phase 3: Implementation

- Implementation rules: Keep changes limited to public training pages and route metadata; prefer redirects over deletion for existing URLs; avoid speculative new product ladders.
- Files allowed to change: Scope-locked files only unless audit exposes a broken reference in another public page.
- Validation and error-handling requirements: Legacy moved pages must have meta refresh/script fallback plus human-readable link.
- Observability requirements: Static site has no runtime observability in this pass; use build/link checks and local smoke checks.
- Exit criteria: Public training surface now has one primary visitor path and no duplicate competing Camp Claude CTAs in active training surfaces.

## Phase 4: Green Tests And Refactor

- Green command: `npm run build`.
- Refactor constraints: No broad styling refactor, no dependency changes, no unrelated content rewrites.
- Regression checks: Verify old training and Camp Claude paths, canonical page, sitemap, and primary CTAs.
- Exit criteria: Build stayed green after edits.

## Phase 5: Full Verification

- Targeted tests: `npm run build` passed.
- Full suite: Package only exposes the static layout checker as build.
- Build/typecheck/lint: `npm run build` passed. `node --check internal/scripts/check-public-layout.mjs` passed.
- JS/TS debt scan, if applicable: No repo-local debt policy exists. Fallback command `node /Users/hoff/dev/dev-help/agent-debt-scan.js --repo /Users/hoff/dev/RUDI/apps/learnrudi --files internal/scripts/check-public-layout.mjs --json` passed with 0 findings.
- Live smoke checks: Local static server served canonical training, clinic, and custom pages. Browser checks confirmed no horizontal overflow, no missing link text, valid hero backgrounds, and no console errors on desktop/mobile viewports. Legacy pages `/camp-claude.html`, `/ai-training/camp-claude.html`, `/ai-training/live-ai-training-camp/`, and `/ai-training/` redirected to the intended canonical pages.
- Exit criteria: Static validation and smoke checks passed.

## Phase 6: Docs, Contracts, And Closure

- Docs or API contracts to update: This checklist and sitemap/route metadata.
- Final files touched: `internal/scripts/check-public-layout.mjs`, `public/ai-training.html`, `public/ai-training/index.html`, `public/ai-training/live-workflow-clinic.html`, `public/ai-training/camp-claude.html`, `public/ai-training/live-ai-training-camp/index.html`, `public/ai-training/custom.html`, `public/camp-claude.html`, `public/prompting.html`, `public/terms.html`, `public/sitemap.xml`, `vercel.json`, this checklist.
- Commands run and results: `npm run build` passed before and after edits. `node --check internal/scripts/check-public-layout.mjs` passed. Fallback debt scan passed with 0 findings. Local server smoke checks passed. Browser responsive checks passed for the training index, live clinic, and custom training pages.
- Accepted debt: Older non-training pages still contain broad `/ai-training` links that are now covered by redirects; a second pass should normalize shared navigation and page footers site-wide. Insight articles, case studies, legal pages, and legacy asset cleanup were intentionally deferred.
- Definition of Done: Smaller public training funnel, redirects intact, build green, smoke checks complete, and remaining backlog stated clearly.
