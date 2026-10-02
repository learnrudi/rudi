# Public skills catalog

## Phase 0: Baseline and manual lookup
- Request: add the approved skills directory to the RUDI website; show what skills are and do, organized by function, without merge history.
- Base: origin/main at 2cf6cf1547f0132f0b8f80c27de6cbbbc19cffc7. Isolated feature worktree; unrelated primary-checkout edits preserved.
- Source: published Registry index at b4bc855c9422a6df1fb6811b14619a01ac57b941, 84 skill packages. No private Codex inventory or uncommitted Registry changes enter the public output.
- Manual: index, co-pilot standard, master doctrine Appendices B/C, horizontal engineering standard.
- Risk: medium for a public content page; production rollout is high risk and must preserve other work.
- Horizontal scan: static site shell and resources hub already exist. Reuse their HTML/CSS/navigation contract. The learning library's course player has different state and is not a reusable skills filter. No shared filter contract or new dependency is needed.

## Phase 1: Scope lock
- In scope: /skills/, public descriptions, functional categories, search/category filtering, GitHub source links, resource-hub/homepage discovery, sitemap, source data and deterministic rendering.
- Non-goals: install/run buttons, accounts, private workflows, merge history, Registry edits, global navigation migration, DNS changes.
- Paths: public/skills/index.html; public/css/rudi-skills.css; public/js/rudi-skills.mjs; internal/catalog/skills.json; internal/scripts/render-skills.mjs; internal/tests/skills-catalog.test.mjs; public/index.html; public/insights/index.html; public/sitemap.xml; package.json; internal/scripts/check-public-layout.mjs; README.md; this record.
- Contract: reviewed JSON contains only id, title, category, purpose plus published Registry revision. Renderer validates exact keys, lengths, unique portable IDs and categories; escapes all content; derives GitHub links from validated IDs and revision. Output is static HTML, usable without JavaScript. Search input only filters existing DOM, never interpreted as markup or sent to a provider.
- Failure behavior: invalid catalog fails generation/build; absent JavaScript leaves all skills readable and hides interactive controls; no matches shows a clear reset path.
- Authorized action: user explicitly answered yes to committing, pushing, and merging a GitHub PR to publish this reviewed catalog at learnrudi.com/skills/. No DNS/account changes, branch deletion, or worktree cleanup authorized.
- Commit plan: one coherent catalog change including data, rendering, UI, discovery, tests and docs; checkpoint after all checks/review. No commits yet.
- Exit: desktop/mobile preview, filter and reset proof, static fallback, tests/build, scoped debt scan, independent review, peer verification and explicit publication status.

## Phase 2: Red tests
- Next behavior: search and category combine, with case/whitespace normalization. Add and run one test before implementing filtering.
- Subsequent boundary: invalid catalog rejected and HTML escaped before output. Capture each red/green separately.

## Phase 3: Implementation
- Plain static HTML/CSS/JS. Existing site design and analytics. No new dependencies.
- Nine functional categories. Concise editorial descriptions with original public source links.

## Phase 4: Green tests and refactor
- `node --test internal/tests/skills-catalog.test.mjs`: four sequential behavior tests demonstrated red before implementation, then green unchanged.
- Red failures: category intersection returned true for wrong category; invalid catalog did not throw; unescaped script title remained markup; UI controls stayed hidden before controller existed.
- Green: all four tests pass. No separate structural refactor was necessary.

## Phase 5: Full verification
- `npm test`: 66/66 passing (baseline 62/62).
- `npm run build`: generated catalog current and static site layout passes.
- Scoped RUDI debt scan: public filter (1 file) and internal renderer/tests/layout gate (3 files), graph root/scope `.`, heuristics enabled; zero findings. An initial default-src scan covered zero files and was discarded.
- In-app browser on new site HTTP preview: all 84 rows load, query/category intersection returns expected result, no-match state appears, clear resets both controls and restores focus to search. Mobile at 390×844 has page width 390 and legible stacked rows; Planning & decisions returns 6 results.
- Static HTML contains all entries and hidden controls before JavaScript, providing a readable fallback.
- Independent fresh-context RUDI Code Review (agent skills_page_review): Standards pass, Spec pass, Proof pass. Reviewer independently reran 66 tests/build and checked all84 public source IDs/paths, static content, duplicate IDs and local references.
- Admin Mac isolated checkout at the same base: npm test 66/66, npm run build and git diff --check passed. Both existing primary checkouts retain unrelated work.
- Publication approval received after the completed preview and review. Release sequence: commit, feature-branch push, PR, checks, merge, Vercel production verification.
- Gaps: no manual screen-reader session or multi-browser matrix; no claim of production analytics collection.

## Phase 6: Docs, contracts and closure
- Implementation verdict: ready. Publication is explicitly authorized; this document records the pre-publication evidence. Final commit/PR/deployment receipts belong to the release record.
- Pre-publication snapshot: all 13 task-owned source files match in isolated feature worktrees on both Macs. No publishing mutations had occurred at this checkpoint.
- Source paths are listed under Phase 1. Source-only transfer; no credentials, runtime state, or artifacts copied between peers.
- Public source checks: 84 published skill IDs and corresponding SKILL.md paths; public output has unique HTML IDs and no private-path/account markers.
- Evidence artifacts stay in the originating chat outputs: rudi-public-skills-preview.jpg and rudi-public-skills-mobile.jpg. The localhost preview serves this isolated website at /skills/.
- Local Repo Steward receipt: skills-catalog-20261002, preservation required; retain through publication and verified release. No cleanup authorization.
- Remote closeout ledger proof gap: admin source is preserved and checksum/test verified, but a separate admin Repo Steward receipt is not yet recorded. Owner: release operator; trigger: approved Git publication; closing proof: record/read back an admin receipt against the accepted revision before retirement.
- Accepted horizontal concern: existing static header/footer duplication remains under the site's established contract; shared navigation is unchanged. Reassess only with a separately scoped global navigation maintenance task.
- Commit plan: one catalog slice, gated by completed tests/build/review. Rollback after an eventual release should revert that exact slice through the normal reviewed deployment path.
- Remaining limitations: screen-reader and cross-browser manual checks, production analytics collection, live deployment smoke, and remote ledger receipt. The live route must be verified after deployment before reporting publication complete.
