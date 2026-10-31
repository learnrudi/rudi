# Connect-only release — October 31, 2026

Owner requested publication of /connect without replacing the homepage.
Base: 9003bf12fafe4fc265ca63f34b1f3347ed69560b, current main and production.
Scope: contact page, thanks page, vCard, approved logo, isolated CSS, sitemap and narrow build/test allowances. Homepage unchanged byte-for-byte against production.
Thanks header uses About RUDI instead of links to unpublished homepage sections.
Formspree mrppaoqr was live-tested with saved fields and notification delivery to hoff@learnrudi.com on October 30. No CRM integration is claimed.

Publication preflight: both live Vercel projects rudi-web and learnrudi link to learnrudi/rudi, branch main, root directory unset (repository root). Both report gitProviderOptions.createDeployments=enabled. The accepted source and this release specify git.deploymentEnabled=false for all branches; do not assume provider integration is disabled. Owner authorizes this publication, including release workflow previews. No provider settings changed. learnrudi.com aliases rudi-web production deployment dpl_Sr3mDr1uRvAJcRAVTNhXxMiWAEfy at the base revision. This resolves the README publication inspection hold for this release only.

Validation: npm run build passes; npm test 67/67 passes; git diff --check passes; SWE debt scan of all four edited/new JS modules reports zero findings. Existing behavior and prior vCard red-green test are retained; this release isolates tested files and changes only presentation/navigation, so no new behavior-bearing implementation requires a new red-green cycle. Prior mobile checks at 360/390px had no horizontal overflow. Physical device contact import remains a manual test gap. No dependencies or form JavaScript changes.

Review: changes are confined to the requested route and dependencies; reused inquiry handler preserves validation, visible failures and redirect only after confirmed success. New assets contain public approved brand/contact information, no credentials. Rollback: redeploy preceding production revision through the normal release workflow. Admin checkout has an unrelated untracked docs/digital-workforce-worker-card-mockup.html to preserve.
