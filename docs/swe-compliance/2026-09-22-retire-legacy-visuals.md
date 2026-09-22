# Retire obsolete higher-education visualizations

## Phase 0: Baseline And Manual Lookup

- Base: origin/main 174224a06ad5500c5edf45335776ad02db6bf779; isolated codex/retire-legacy-visuals-20260922.
- User request: fix six old-design graphics and associated articles if they need rewriting.
- Read global instructions, site copy and brand standards, manual index and Engineering Quick Reference testing/change guidance. Applied synthetic-cadence-editor to the current article review.
- Finding: PR #122 already rewrote the higher-ed article and removed its six iframe embeds. Current public source has no references to the visual URLs outside their own files. The old canonical local checkout is stale and must not be edited.
- Risk: low, reversible static archival with narrowly enumerated redirect rules. Preserve original bytes, current article, legal/contact work, and existing redirects.
- Horizontal scan: reuse the established docs/archive/public-pages structure and Vercel redirect mechanism; retire unused files, no new mechanism.

## Phase 1: Scope Lock

- Move precisely six public/insights/visuals HTML files to docs/archive/public-pages/2026-09-22/public/insights/visuals; retain bytes.
- Add exact permanent redirects for .html URLs and extensionless equivalents to /insights/ai-adoption-higher-ed.html. Do not use a wildcard that captures future graphics.
- Add one focused Python regression check, archive README and this record.
- Related-article assessment: current higher-ed article uses the shared bright design; distinguishes illustrative examples from evidence, offers concrete responsibilities and evaluation, links primary guidance, and no longer asserts deterministic-email comparisons. No rewrite needed. No changes to dated Daily reporting or unrelated pages.
- Commit slice: one archival/configuration change with validation evidence. User authorized preparation; commit/push/merge/deployment not authorized in this task. No external publication.
- Failure behavior: old bookmarked paths resolve to the relevant article after deployment; archive paths remain outside public output.

## Phase 2: Red Tests

- Regression verifies all six obsolete documents leave deployment, remain archived, and exact old URL rules point permanently to an existing indexable replacement.
- Command: python3 -m unittest discover -s internal/tests -p 'test_legacy_visual_archive.py'. Red: failed all six subtests for the expected reason, “Obsolete graphic is still deployable.”

## Phase 3: Implementation

- Completed six archive moves and 12 exact permanent redirect rules. Prior configuration preserved; no HTML rewritten. Archive README identifies lineage and deployment checks.

## Phase 4: Green Tests And Refactor

- Green: unchanged Python regression passed. No refactor needed. Archived file bytes match git show HEAD:public/insights/visuals/<name> for all six files; preexisting routing and other Vercel settings match HEAD.

## Phase 5: Full Verification

- Passed: Python regression (1 test, six route groups), npm test (54/54), npm run build, python3 internal/scripts/site_shell.py --check (0 drift), git diff --check, byte-preservation and inbound-reference checks. Independent read-only review passed Standards, Spec, and Proof for local preparation; reviewer /root/review_legacy_visuals independently reran regression, 54 Node tests, build, shell check, byte/config comparisons and diff check. No actionable findings.
- No JS/TS edits planned; debt scan not applicable unless scope changes.
- Production redirect proof requires an authorized deployment; a static local server does not execute Vercel redirects.

## Phase 6: Docs, Contracts, And Closure

- Verification and independent review complete. Verdict: ready for publication decision; production acceptance remains pending. Preserve this worktree and all uncommitted work. One coherent archival slice remains uncommitted; no push, PR, merge, or deployment. No new horizontal obligation: retire unused files through existing archive/routing contracts.
- Closeout receipt proof gap: Repo Steward preflight succeeds, but its two enrolled roots are /Users/hoff/RUDI and /Users/hoff/Clients; this exact /Users/hoff/.codex/worktrees/learnrudi-legacy-visuals worktree is outside those roots and is not a configured repository. Do not record against the dirty canonical checkout or broaden root enrollment for this cleanup. Implementing agent owns recording the immutable preservation-required receipt when that capability is available; closing proof is a read-back receipt for this exact worktree and branch. No cleanup eligibility or completed closeout is claimed.
- Admin-Mac synchronization deferred until source accepted and publication workflow authorized; do not synchronize drafts over accepted source.

- Final state: ready for owner authorization to commit, push, merge and deploy this exact cleanup. After authorized deployment, verify permanent redirects and update the live inventory from 137 to 131 only if a fresh crawl confirms it.

## Publication authorization

The owner replied “yes” to “May I commit and publish this cleanup?” on September
22, 2026. This authorizes the scoped commit and normal feature-branch/PR release
path to publish the redirect cleanup. Earlier preparation-only status above is
historical. Preserve unrelated work, verify the release peer, and check production
redirects after deployment. Do not delete worktrees or branches.
