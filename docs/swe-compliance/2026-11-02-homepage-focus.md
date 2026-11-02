# Focus the homepage

## Baseline and scope

User request: keep the homepage targeted and focused, without overwhelming visitors with options. Preserve the approved people-and-agents positioning, Microsoft membership, workflow illustration, and existing replacement group photo.

Base: `8401532dfd53d32307faaaa8dc4306b2c0dde0db`. Work in the existing isolated homepage worktree on a new feature branch. Scope: homepage HTML, the existing composition and learning-library tests, and this record. No shared navigation, application behavior, destinations, integrations, dependencies, or analytics changes.

Risk: low, reversible content/navigation reduction; production publication follows the already-authorized reviewed GitHub/manual-Vercel workflow. The previous accepted revision provides rollback. One verified commit, then PR/CI, exact-head acceptance, manual production release, and Admin adoption.

Manual selection carries forward the session's index, Master Engineering Doctrine B5/B10/C1/C7A, and Agent Co-Pilot standard. The design rulebook's one-primary-action and progressive-disclosure principles apply. Bounded scan: homepage, composition tests, learning-library navigation contract, shared shell, service styling, and layout checker. No new implementation or shared contract; no horizontal consolidation obligation.

## Acceptance and implementation

- One primary inquiry destination, repeated at the opening and closing.
- Explain four connected capabilities without individual service-choice links.
- Remove platform selector, detailed approach accordion, and resource catalog from the homepage body. Existing site navigation keeps these pages discoverable.
- Supporting links limited to company work, one working RUDI example, and Microsoft membership verification.
- Preserve accurate client scopes, organizational positioning, accessibility, responsive layout, and workflow controls.
- Preserve `/connect`, shared chrome, the new group photograph, and Microsoft badge.

## Proof plan

Update the existing entry-point regression to cover the new focused navigation contract; run it red against the previous homepage, then green after the content change. Adjust the learning-library contract to verify navigation discoverability without requiring a homepage promotion. These are navigation-contract updates; no new speculative tests or runtime behavior.

Run focused tests, full tests, build, diff check, and debt scan for edited test modules. Verify desktop/mobile layout, destination inventory, media, and workflow controls. Obtain an independent read-only Standards/Spec/Proof review. Preserve the known shell-generator drift rather than regenerating shared chrome.

## Verification and delivery

- Red: `node --test internal/tests/homepage-composition.test.mjs internal/tests/learning-library.test.mjs` failed as expected on the previous secondary `#services` destination (6/7 passed).
- Green: identical command passed 7/7 after implementation. `npm test` passed all 67 tests; `npm run build` and `git diff --check` passed. No additional refactor or runtime logic change.
- Targeted `swe_debt_scan` covered both edited test modules: 60 graph files, 2 reported, zero findings. Design-rulebook scan of `public/index.html`: zero findings.
- Homepage body reduced from 37 anchors / 34 destinations to 5 anchors / 4 destinations, including two identical general-inquiry CTAs. Text reduced from approximately 991 to 493 words (HTML tags excluded).
- Browser QA at 1440px desktop and 390px mobile found no horizontal overflow. Desktop and mobile capability sections show readable unlinked descriptions. Main CTA reached `/start-here/#inquiry-form` with no selected interest; no form submitted. Shared navigation continues to expose the learning library and service pages. Workflow logic and assets are unchanged and covered by the passing suite and earlier same-session smoke checks.
- Preview analytics blocked by the same local server CSP. Screenshots: `/Users/hoff/.rudi/outputs/learnrudi-homepage-20261102/focus-desktop.jpg`, `focus-mobile.jpg`, and `focus-mobile-services.jpg`.
- Known limitations: no full screen-reader/additional-browser review; existing shell-generator drift remains unchanged because shared header/footer are byte-identical to the accepted base.
- Independent review, publication, live verification, Admin adoption, and Repo Steward closeout are release gates. Their final acceptance evidence is recorded in the release artifact and retained-worktree receipt after publication.
- Fresh independent reviewer `/root/review_homepage_focus`: no actionable findings; Standards pass, Spec pass, Proof pass, Overall pass. Independently reproduced red, reran focused/full tests, build, diff check, debt scan, and inspected desktop/mobile screenshots.
- Release preflight reverified both live Vercel projects: `learnrudi/rudi`, empty Root Directory, no deploy hooks, Ignored Build Step Automatic. Root `vercel.json` retains `git.deploymentEnabled: false` for all branches. No provider settings changed; publication hold cleared for this scoped manual release.
- Admin preflight: main at accepted base, same origin, no tracked changes; existing untracked mockup preserved. Homepage head/header/footer are byte-identical to base, including analytics and shared navigation.
