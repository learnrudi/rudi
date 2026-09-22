# ChatGPT Ads Landing Flow — SWE Compliance Checklist

Date: 2026-08-20

Status: production deployed; Pixel activation pending

## Phase 0: Baseline And Manual Lookup

- Scope: optimize the organizational AI readiness landing flow for paid ChatGPT Ads traffic and measurable lead submission.
- Files inspected before editing: the assessment page, Start Here page, RUDI design CSS, inquiry prefill module and tests, static layout checker, relevant case studies, and current deployment configuration.
- Relevant SWE manual sections: Appendix B frontend performance, state, resilience, observability, accessibility, dependency discipline, compatibility, and testing; Appendix C red-green-refactor; Appendix F trust-boundary validation; Appendix H deployment, rollback, and post-deploy verification.
- Current-state commands: `git status -sb`, targeted `rg` and `sed` inspection, live DOM and responsive inspection, and a lightweight live response check.
- Risks and invariants: preserve existing brand work and Formspree delivery; never invent an OpenAI Pixel ID; preserve only explicitly supported attribution fields; third-party script or submission failure must not break first-party navigation or erase form contents; a lead conversion must fire only after a successful form response.
- Initial risk tier and rationale: medium. This changes a public lead-generation journey, client-side attribution, and third-party measurement, but not authentication, payment, or persistent first-party data.
- Exit criteria: current loss of attribution, CTA visibility, submission success behavior, and measurement requirements are evidenced.

## Phase 1: Scope Lock

- In scope: preserve approved ChatGPT Ads parameters and `oppref` across the assessment CTA; preselect AI Readiness; submit the inquiry form without leaving the RUDI domain; provide accessible pending/error states; add a first-party thank-you route; initialize the OpenAI Ads Measurement Pixel with the real account Pixel ID; emit `lead_created` once after a successful form response; tighten the paid landing hero; add factual engagement evidence; update layout contracts, privacy text when the Pixel is activated, tests, and deployment verification. The private confirmation route remains `noindex` and intentionally stays out of the sitemap.
- Non-goals: redesigning unrelated pages, replacing Formspree, adding a CRM, changing campaign bidding or budget, implementing the Conversions API, or publishing Git history without separate authorization.
- Expected files touched: `public/how-we-help/ai-readiness/assessment/index.html`, `public/start-here/index.html`, `public/start-here/thanks/index.html`, `public/css/rudi-2026.css`, `public/js/attribution.mjs`, `public/js/start-here-prefill.mjs`, `public/js/inquiry-form.mjs`, `public/js/lead-conversion.mjs`, `public/js/openai-ads-measurement.mjs`, `public/privacy.html` when measurement is activated, the focused flow tests, `internal/scripts/check-public-layout.mjs`, and this checklist.
- External inputs and trust boundaries: URL query parameters, browser storage, Formspree JSON responses, OpenAI Pixel configuration, and third-party script availability.
- Failure behavior to define: invalid or oversized attribution is ignored; storage failures degrade without blocking the form; failed submissions leave the form populated and present an accessible retry message; missing or invalid Pixel configuration prevents measurement without breaking the page; conversion markers expire and are consumed once.
- Authorized external actions: production deployment was requested as the completion path. Creating or reading account measurement configuration requires the user's authenticated Ads Manager session.
- Review and approval gates: user approved the optimization; production deployment follows successful verification; Git publication remains separate.
- Exit criteria: tests, interfaces, and file boundary are explicit before implementation.

## Phase 2: Red Tests

- Observable behavior to prove: supported attribution is validated and propagated; the Start Here form captures it and preselects AI Readiness; successful submissions create a one-time conversion marker and route to a first-party thank-you page; the thank-you page consumes only a fresh marker; the paid hero and factual proof are present.
- Test files added or edited: `internal/tests/start-here-prefill.test.mjs`, `internal/tests/chatgpt-ads-landing-flow.test.mjs`, `internal/tests/inquiry-form.test.mjs`, and `internal/tests/openai-ads-measurement.test.mjs`.
- Red commands and expected failures:
  - `node --test internal/tests/start-here-prefill.test.mjs` failed because `public/js/attribution.mjs` did not exist.
  - `node --test internal/tests/chatgpt-ads-landing-flow.test.mjs` failed because the paid hero/form/confirmation contracts were absent.
  - `node --test internal/tests/inquiry-form.test.mjs` failed because `public/js/inquiry-form.mjs` did not exist.
  - `node --test internal/tests/openai-ads-measurement.test.mjs` failed because `public/js/openai-ads-measurement.mjs` did not exist.
  - After independent review, `node --test internal/tests/inquiry-form.test.mjs` failed because pending-state live-region copy was not yet exported or applied.
  - After independent review, `node --test internal/tests/chatgpt-ads-landing-flow.test.mjs` failed because only two of five Start Here paths preserved attribution.
- Exit criteria: each new behavior fails for the expected missing contract before implementation.

## Phase 3: Implementation

- Implementation rules: smallest compatible static-site changes; no new dependency; semantic HTML; progressive enhancement; asynchronous third-party loading; exact official OpenAI event taxonomy.
- Files allowed to change: only the files listed in Phase 1, plus the existing compliance record if final deployment evidence belongs there.
- Validation and error-handling requirements: attribution allowlist and length/control-character validation; same-origin link enforcement; response status validation; actionable form error; no conversion before provider success.
- Observability requirements: Vercel page analytics remain; ChatGPT Ads receives `lead_created` only after successful inquiry submission; Formspree receives permitted campaign fields for lead-level attribution.
- Implementation result: CTA parameters are propagated from the assessment page, validated into hidden fields, and retained on the first-party confirmation URL. The form uses Formspree JSON mode, shows an accessible error without clearing data, and redirects only after an accepted response. A UUID-backed session marker is consumed once within 30 minutes. The OpenAI Ads loader uses the official SDK and event taxonomy but performs no network or measurement action until a real Pixel ID is present in page configuration.
- Exit criteria: red tests pass without weakening assertions. Met.

## Phase 4: Green Tests And Refactor

- Green commands:
  - `node --test internal/tests/start-here-prefill.test.mjs` — 6 passed.
  - `node --test internal/tests/inquiry-form.test.mjs internal/tests/start-here-prefill.test.mjs internal/tests/chatgpt-ads-landing-flow.test.mjs` — 11 passed.
  - `node --test internal/tests/openai-ads-measurement.test.mjs` — 2 passed.
- Refactor constraints: preserve public exports and current playbook prefill behavior; keep logic pure where practical; avoid page-global state beyond the documented Pixel queue.
- Regression checks: existing playbook attribution, accessible labels, site navigation, and Formspree endpoint remain intact.
- Exit criteria: targeted tests are green before any cleanup, and remain green after cleanup. Met.

## Phase 5: Full Verification

- Targeted tests: all focused suites passed as recorded above.
- Full suite: `npm test` — 39 passed, 0 failed after review fixes.
- Build/typecheck/lint: `npm run build` passed after keeping the noindex confirmation route outside the public architecture/sitemap contract and moving `public/.DS_Store` to `/var/tmp/learnrudi-public.DS_Store-2026-08-20`; `git diff --check` passed.
- JS/TS debt scan: the structural runner reported no findings when the four HTML-loaded modules were declared as entry points. Its initial orphan-only warnings were false positives caused by static HTML entry points not being inferred.
- Live smoke checks: local assessment URL with representative `utm_source`, `utm_campaign`, and `oppref`; both CTA destinations retained the validated values; the Start Here interest was `ai-readiness`; hidden attribution fields were populated; the desktop CTA was visible at 1280×720. A production Formspree lead was not created.
- Independent review: fresh-context read-only review of intent, instructions, diff, and evidence.
- Risk-tier approval: user approved the public conversion-flow change and deployment; account login remains user-controlled.
- Production deployment: `npx vercel@latest --prod --yes` completed successfully, deployment `rudi-i7bek4vi2-prompt-stacks-projects.vercel.app`, aliased to `https://learnrudi.com`.
- Post-deploy verification: assessment, confirmation, and measurement module returned HTTP 200; production HTML exposed exactly five attributed Start Here paths; a browser smoke check confirmed all five retained the representative campaign values; the resulting production form preselected `ai-readiness` and populated `utm_source`, `utm_campaign`, and `oppref`; the Pixel remained inactive as designed.
- Exit criteria: no blocking findings; live production checks pass after deployment. Met for the inactive-Pixel release.

## Phase 6: Docs, Contracts, And Closure

- Docs or API contracts to update: privacy disclosure is required when the real OpenAI Ads Pixel ID is activated; this compliance record is current for the inactive loader state.
- Final files touched: the assessment page, Start Here form and confirmation route, shared RUDI CSS, four new flow/measurement modules plus the updated prefill module, focused tests, static layout contract, and this record.
- Commands run and results: targeted tests, `npm test`, `npm run build`, `git diff --check`, focused JS debt scan, and local browser smoke checks passed as recorded above.
- Evidence artifacts: targeted/full test output, debt scan, build, live URLs, DOM assertions, and deployment result.
- Independent-review result: no P0/P1 blockers. Two P2 findings—an unannounced pending state and three alternate Start Here paths that dropped attribution—were fixed with red/green coverage; the reviewer confirmed the five-path regression contract and both focused tests.
- Final verdict: the inactive-Pixel release is deployed and verified. Pixel activation remains a separate privacy/account gate.
- Accepted debt: Conversions API is out of scope for this static-site pilot; browser Pixel is the initial measurement path.
- Proof gaps: a real Formspree lead submission was not generated because it sends contact data and creates a production lead. Ads Manager is still waiting for the user's OpenAI login, so the real Pixel ID, privacy disclosure, SDK network request, and Ads Manager debug event are not yet verified.
- Definition of Done: attributed traffic reaches a preselected, resilient form; a successful real submission can be measured once as `lead_created`; desktop and mobile have an immediate CTA; production serves the verified files; remaining account or Git gates are explicit.
