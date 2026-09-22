# Website and RUDI Daily production publication

User explicitly authorized publishing the completed website and recovered editions on September 21, 2026. This release combines the previously reviewed branding/navigation/resources change (6131375), main integration (cf4f668), About RUDI Daily migration (391c31e), and ten recovered editions for September 12–21. Pipeline model selection and saved-run compatibility are reviewed separately in editorial-newsletter-pipeline PR20.

## Scope and invariants

Render the ten reviewed recovery editions through the current daily builder and update their catalog, sitemap, and previous/next links. Preserve every approved story, source binding and reviewed editorial claim. Generated pages add a visible publication note describing recovery and publication on September21, and NewsArticle datePublished records September21 rather than implying they were available during the outage. Edition dates remain the dates of the reporting. The reviewed recovery inputs remain immutable outside Git; only public HTML is committed.

Allowed incremental paths: ten new edition HTML files, September11 neighbor navigation, insights index, Daily archive, sitemap and this record. No runtime secrets or private operational artifacts enter this public repository. No social or newsletter-email sends are included.

## Proof and risk

Production deployment is high risk. Retain the previous production deployment for rollback; publish only the reviewed Git revision. Rendering validated all ten bundles and source bindings. Input bundle, editorial-copy and capture-manifest hashes matched the recovery verification record before generation. The publication-note copies are separate derivatives; the original reviewed copy is unchanged.

Verification: 48 Node tests, 20 Python tests, static layout build, zero shared-shell drift, and a local crawl of176 URLs (141HTML,35assets) passed. Whitespace checks passed. No JS/TS changes in this recovery increment; the redesign debt scan already passed. No new behavior was introduced beyond generated editorial HTML, so existing renderer/catalog tests and output verification are the relevant checks. Two initial test-discovery commands pointed to internal/tests and found no Python tests; the corrected internal/scripts command ran all20 successfully.

Independent release review is required before merge. After merging, verify the production deployment, homepage, new About route, legacy redirect, all ten editions, archive/index latest pointers and sitemap. A green local build is not deployment proof.

## Preservation and closure

Retain this release checkout and both earlier design worktrees. No cleanup authorized. GitHub PR and final deployment evidence are recorded in the task. The shared scheduler repair is a separate operational change; publication of this release does not establish automatic daily execution.
