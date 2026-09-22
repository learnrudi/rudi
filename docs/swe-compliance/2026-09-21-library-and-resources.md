# Learning and resources refinement — 2026-09-21

## Scope and baseline
Medium risk: public navigation/player behavior and the generated Daily catalog.
Continue the approved bright-site preview in this existing isolated worktree.
Preserve the homepage, approach, case studies and verified video catalog.
Apply the previously selected SWE testing, horizontal-contract and review standards.

In scope: learning library HTML/CSS/JS, insights and Daily archive, Daily catalog
renderer, newsletter promotions, About biography, affected checks and docs.
Newsletter is free and RUDI-managed. User confirmed there is no email system yet;
show an honest coming-soon state with working resource links. No fake form or
subscriber success. Provider connection is a separate setup task.

Boundaries: URL fragments are untrusted; invalid course/lesson values fall back
safely. Preserve every dated edition URL, generated-region marker and subtitle.
Keep third-party article source citations even when they link to Substack.
No new dependencies, account creation, emails, commits, push, deployment, or
admin-Mac synchronization. Source stays local pending review/publication approval.

## Planned slices and proof
1. Library: reproduce invalid fragments and selection/focus issues with behavior
   tests; implement safe selection, stable lesson controls and accessible tabs;
   inspect desktop/mobile and actual embedded playback.
2. Resources: preserve managed catalog contracts while changing cards into dated
   rows and month groups; red/green generator test, then regenerate catalog.
3. Free newsletter and founder copy: remove RUDI paid-tier/Substack claims and
   align build checks; keep signup explicitly unavailable until connected.
4. Full Node/Python suites, build, shell drift, JS debt scan, browser smoke and
   fresh independent review. Record evidence and remaining provider/release gaps.

Horizontal disposition: standardize the Daily presentation in its existing
renderer, rather than creating a second catalog. Site shell remains the sole
navigation source. No additional consolidation obligation.

## Results
In progress. Planned slices remain uncommitted; publication is not authorized.

### Red/green evidence
- `node --test internal/tests/learning-library-behavior.test.mjs` first failed
  on `#toString`: TypeError reading `.lessons[0]`. `Object.hasOwn` validation
  made the unchanged fragment test pass.
- Added selection/focus regression, same command failed because selecting a
  lesson replaced its focused button. Stable controls plus mobile player scroll
  made the unchanged test pass.
- Added keyboard course/next/previous regression, same command failed because
  no keydown handler existed. Roving tab focus, keyboard navigation and bounded
  previous/next buttons made all three tests pass.
- `python3 -m unittest discover -s internal/scripts -p test_update_daily_catalog.py`
  failed the new month-group test: zero `.daily-edition` rows instead of seven.
  After changing the renderer, all 12 catalog tests passed unchanged, including
  escaping, duplicates, chronology, missing previews and idempotence.
- No automated tests were added for copy or purely visual spacing changes.

### Verification completed
- `npm test`: 48/48 pass.
- `python3 -m unittest discover -s internal/scripts -p 'test_*.py'`: 20/20 pass.
- `npm run build`: pass; `python3 internal/scripts/site_shell.py --check`: zero drift.
- Debt scan initially warned about HTML/CLI entrypoints absent from the scanner's
  default import graph. Explicitly configuring the actual script entrypoints
  yields zero findings. Final report includes the visitor-prompt copy edit.
- All 72 edition files were SHA-256 compared before/after this pass with only
  the newsletter aside excluded: all unchanged outside that aside.
- Browser: Foundations introduction played, captions appeared and elapsed time
  advanced to 16 seconds of 1:38. ArrowRight selected Prompting and changed the
  iframe to x7kq6udvgb8 with focus on the selected tab.
- At 390×844: selected Prompting lesson 2, verified focus retained on its button,
  correct iframe tktszPnaiRc, player top 192px (visible), no horizontal overflow
  (document width = viewport width = 390px).
- Daily at 390px: 7 excerpt rows, 72 distinct edition URLs, month disclosures
  with 3 September / 31 August / 31 July links. Enter opened July. No overflow.
- Desktop resource hub visually inspected: bright hero, playbook feature,
  editorial resource rows and light Daily feature. No new cards in these hubs.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8088/`: 130 HTML,
  34 assets, 164 local URLs, all pass. Whitespace check passes.
- Publication remains deferred. Cached origin/main metadata now shows this
  worktree four commits behind; no fetch was performed in this follow-up.
  Release owner must integrate current Daily updates before publishing.
- Newsletter desktop visually checked; at390px it has no overflow, no form,
  and explicit free/coming-soon copy. Resource hub at390px: eight editorial
  rows, zero cards, no overflow. Browser read back the revised founder bio.
- Independent reviewer `/root/resources_review`: Standards, Spec, Proof and
  Overall pass. Reviewer reran all48 Node tests,20Python tests, build, shell
  drift and scoped whitespace checks; independently confirmed all72 article
  bodies unchanged outside newsletter aside, archive URLs exactly once,
  both generated catalog regions idempotent, no duplicate IDs/broken local
  links in reviewed hubs, and no fake signup. Review caught stale newsletter
  head metadata; title, description and OG fields were corrected and verified.

## Delivery status
Ready for local design review. Newsletter provider connection is still required
before signup can open; Resend recommended, MailerLite offered as an alternative.
No account, subscriber, domain, email or production state was changed. No commit,
push or deploy. Admin-Mac sync remains deferred until source is accepted and
publication/synchronization is authorized. Existing upstream Daily changes must
be integrated before release. Earlier diagram-clipping debt remains as recorded
in the September11 review and is outside this follow-up.

Closeout receipt `learnrudi-resources-20260921` v3 is retained and was read back
from Repo Steward. Lease released. State lives beneath
`/Users/hoff/.rudi/state/repo-steward`; cleanup eligibility is false due to dirty
work, missing final user acceptance, and explicit preservation requirements.
No cleanup approval exists. The exact worktree remains
`/Users/hoff/RUDI/worktrees/learnrudi/bright-site-20260911`.

### Follow-up: homepage engagement figure
User revised the aggregate to 5,000+ employees engaged. Updated only the homepage
figure and its existing composition assertion; retained 15+ engagements, seven
sectors, and Walker SCM's separate1,200-employee scope. This is a user-supplied
aggregate, not an independently calculated count. Three homepage tests, static
build and whitespace checks pass; the edited assertion's debt scan reports zero
findings. Browser cache-bypassing refresh visibly confirmed the new figure.
No behavior code changed, so a new red/green test or independent review was not
needed. Source remains local and uncommitted in the retained worktree.
