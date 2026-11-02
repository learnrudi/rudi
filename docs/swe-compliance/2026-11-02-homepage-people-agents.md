# Homepage: people, agents, integration and governance

## Phase 0: Baseline and scope

- Request: update the main homepage to explain training people and preparing AI agents to work inside organizations; emphasize integration, deployment, governance and ongoing support. Use organization-centered visuals, replace the event flyer with existing photography, and reuse the Microsoft AI Cloud Partner badge/link from Hoff's Gmail signature. `/connect` is out of scope.
- Base: `origin/main` at `0a21190`; clean isolated worktree `homepage-people-agents-20261102`.
- Standards: SWE manual index; Master Doctrine Appendices B5/B10 and C1/C7A; Agent Co-Pilot Standard; repository copy and brand standards; RUDI Design Rulebook.
- Risk: low for reversible content and layout; publication requires the repository's live Vercel checks and reviewed release process. No forms, credentials, service contracts or third-party access changes.
- Horizontal scan: homepage has its own workflow illustration and shared service CSS. Retain shared shell generation, existing animation behavior, page routes, analytics and evidence claims. Keep new styles scoped to the homepage. No abstraction or shared-shell migration needed.

## Phase 1: Contract and implementation boundary

- Expected paths: homepage HTML and metadata; homepage CSS; workflow narration; four functional SVG symbols; Microsoft badge; existing homepage test; this record and brand asset provenance.
- Preserve actual client engagement scope and distinguish the RUDI Daily working example from client work. No fabricated team roster, metrics or Microsoft designation.
- Microsoft source: exact badge and Marketplace destination in Hoff's verified sent signature on November 2, 2026. The existing Microsoft service page identifies membership in the Microsoft AI Cloud Partner Program. Use that membership wording, not an unverified Solutions Partner designation.
- Exit criteria: organization-centered hero and service hierarchy; people and agents represented in illustration; retained human review; meaningful service destinations; event flyer absent from homepage and existing real photo used; Microsoft badge correct and linked; desktop/mobile render and relevant controls verified; tests/build/debt and independent review pass.
- One coherent source/content commit after verification if publication proceeds. User authorized the specified homepage update; use the established GitHub review and deliberate release workflow. No direct main push.

## Phase 2: Red proof

- Revise the existing homepage conversion test to require a broad inquiry destination rather than preselecting training.
- Command: `node --test internal/tests/homepage-composition.test.mjs`.
- Result: failed as expected because the hero preselected `ai-enablement`; 2/3 tests passed before implementation.
- Copy, asset, and visual changes use visual verification rather than new tests that repeat literal prose. No new animation logic is planned.

## Phase 3–4: Implementation and green proof

- Updated homepage copy, metadata, service hierarchy and broad inquiry CTA. Workflow diagram retains its tested state machine while its narration and functional symbols now explain people → knowledge/tools/policies → agent → human review → completed work.
- Reused the public ULI room photograph, preserving a factual learning caption. Added the existing RUDI Daily application screenshot as a clearly labeled RUDI working example. No invented client implementation claims.
- Reused the exact Microsoft badge locally at its original proportions; browser verified the Marketplace RUDI LLC profile and its program membership statement.
- Green command: `node --test internal/tests/homepage-composition.test.mjs internal/tests/workflow-hero.test.mjs`; 6/6 passed with the revised assertion unchanged. No behavioral refactor.

## Phase 5: Verification

- `npm test`: 67/67 passed. `npm run build`: passed, including catalog and static layout verification.
- `python3 internal/scripts/site_shell.py --check`: three pre-existing drifts reproduced against `origin/main`: the intentionally custom connect pages, plus the homepage Skills catalog footer link absent from the generator. Preserved all three; no global shell regeneration. Homepage update introduces no new shell drift.
- Debt scan with graph root/scope `.` and exact JS/test paths: 60 files in graph, 2 reported files, zero findings. Initial default-root scan covered no files and is not counted as proof.
- Design scanner: homepage-only CSS has zero findings; five HTML emoji-heading hits are false positives from links containing arrows on the same compressed lines as headings. No heading contains emoji. Four functional symbols map the service categories to the workflow illustration; retained intentionally.
- Preview server uses CSP to block analytics and third-party connections. Desktop screenshot at 1440×1000 inspected; no horizontal overflow. Mobile (390×844) also has no horizontal overflow; loaded the replacement photo and verified its native width. Pause/Replay work, primary CTA opens the inquiry form with no training preset, and reduced-motion starts paused at human review. Temporary browser overrides were reset.
- Editorial pass follows synthetic-cadence-editor: describes concrete work, preserves actual case-study scope, and distinguishes training/configuring agents from foundation-model training.
- Preview must block analytics; do not submit a lead or alter Gmail.

- Independent fresh-context review: `review_homepage` returned Standards pass, Spec pass, Proof pass, overall pass, no actionable findings. Reviewer independently reran focused/full tests, build and diff check and inspected source, assets and screenshots. Browser interactions and live provider evidence were supplied by implementing agent. Manual screen-reader and additional-browser testing were not performed.
- Evidence images: desktop.jpg, mobile.jpg, mobile-photo.jpg, replacement-photo.jpg in the task output directory `learnrudi-homepage-20261102`.
- No new horizontal obligations. Existing shell-generator drift is retained as pre-existing debt; the homepage's generated-shell delta is byte-equivalent in effect to the baseline (Skills catalog link). Shared navigation/service-page positioning remains outside this homepage-only request.

## Phase 6: Delivery

- Publication hold checked in live Vercel dashboard November 2, 2026: both `rudi-web` and `learnrudi` connect to `learnrudi/rudi`; both Root Directory fields are empty (repository root). Ignored Build Step is Automatic. Root `vercel.json` on current main and this branch sets `git.deploymentEnabled: false` for all branches, covering previews and production under Vercel's documented control. Neither project has deploy hooks. `rudi-web` serves learnrudi.com, current source 0a21190; secondary `learnrudi` has no current production deployment. No provider configuration changed. The source applies to both verified roots; hold cleared for this scoped release.
- Admin preflight: Git 2.55.0, `/Users/admin/RUDI/apps/public-sites/learnrudi`, same repository, main at 0a21190. One unrelated untracked `docs/digital-workforce-worker-card-mockup.html`; preserve it and ignored runtime files. No overlapping tracked work.
- Commit/PR/release, Admin adoption and worktree closeout: pending.
- Preserve this worktree until delivery and acceptance are recorded.
