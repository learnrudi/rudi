# Website publication — September 21, 2026

User authorized committing and pushing the reviewed website updates to GitHub.
Endpoint: feature branch `codex/learnrudi-bright-site-20260911` in learnrudi/rudi.
No default-branch push, pull-request creation, merge, or production deployment.

Ownership: September11 bright-site scope reconciled useful unpublished service,
inquiry and layout changes from the original package branch. Its imported staged
files are part of that recorded scope, not unrelated work. September21 resources,
newsletter, learning library and founder changes extend it; the user also supplied
5,000+ as the homepage engagement aggregate. Both earlier source worktrees stay
untouched. Retired AI-generated logo files added by the package branch are absent
from the final snapshot. Ignore Python caches and all machine-local files.

Commit boundary: one atomic website snapshot keeps shared chrome, all generated
pages, assets, runtime modules and their tests consistent. A second integration
commit preserves newer upstream Daily content and SMS policies. Earlier proposed
slices are combined because generated pages and shared source ship together.

Fresh origin/main: 262fb8a; four commits beyond the preview base. Retain the final
September11 edition, September10 next link, current catalog/sitemap entries, SMS
privacy/terms sections and their tests. Regenerate only shell and catalog chrome;
do not regenerate historical editorial content.

Small publication-time copy correction: remove the stale “Upcoming” label from
the September17 event creative, retaining its date and description without
claiming attendance or delivery outcomes.

Remote peer: /Users/admin/RUDI/apps/public-sites/learnrudi is on main at262fb8a.
It has an unrelated untracked worker-card mockup plus ignored local configuration.
Preserve that checkout. Verify the published source in a separate peer worktree.

Evidence and final revisions are recorded below after checks complete.

## Integration verification
Local website snapshot:6131375. Merged origin/main262fb8a without rewriting history.
Only the two catalog pages conflicted; resolved using the approved layouts and
existing catalog functions, pulling the final September11 preview/counts from
upstream. The new edition uses the shared shell and free newsletter promotion.
September10/11 editorial inner HTML matches origin/main exactly when excluding
only the newsletter aside. The outer main tag gains the shared skip-link ID.
Both SMS policy sections match upstream byte for byte. Legal tests are preserved.
Local checks after integration: full Node suite,20Python tests,build,zero shell
drift and whitespace pass. Crawl:131HTML+34assets=165URLs,all pass.
Browser verified the integrated archive has73edition URLs, newest September11,
and opens that edition successfully. Fresh full changed-JS debt scans report
zero findings (9 public runtime files and12internal scripts/tests).
Independent integration review `/root/publication_review`: no actionable findings;
Standards/Spec/Proof passed. Reviewer independently reran48Node+20Python tests,
build,shell0drift,whitespace and crawl165. Confirmed all73article bodies match
origin/main outside newsletter aside; archive includes every edition exactly once
in descending order; index/archive/sitemap regeneration is idempotent; required
sitemap entries and SMS policy/test content are preserved. Peer verification
will use the exact pushed commit in an isolated checkout, with its outcome in
the publication closeout receipt and task report.
