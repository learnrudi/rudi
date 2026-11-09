# Survey sample radar label spacing

The sample report's radial scale names crossed the profile lines on page 2.
Replace the five names inside the plot with numbered markers and put their
full meanings in a single scale key below the chart. The web edition and PDF
use the same corrected SVG. Keep the existing public URLs.

## Scope and invariants

- Change only the sample web page, its PDF and this review record.
- Preserve every grid, profile polygon and point-marker coordinate. All 33
  geometric elements are unchanged; the chart remains explicitly illustrative.
- Retain the five proficiency levels, nine dimensions, existing page size,
  page count, brand colors and open layout.
- No JavaScript, TypeScript, dependency, form, scoring or delivery behavior
  changes. A new red-green test is not warranted for this static visual fix.

## Verification

- Web Export CSS-print output: five US Letter pages, no export warnings.
- `pdftoppm -png -r 150` and pixel comparison: pages 1, 3, 4 and 5 are identical
  to the previously published PDF; only page 2 changes.
- Visual review of page 2: all scale labels readable, separate from profile
  lines, with no clipping or footer overlap.
- SVG comparison: geometry identical between the old and revised chart.
- `npm test`: 67 passing tests.
- `npm run build`: skills catalog and static layout checks pass.
- No JS/TS changes, so the JS/TS debt scan does not apply.

## Publication preflight

Starting main: `2161d56fb15211760ca973e9f1cba9d4f29f6b88`.
Both live Vercel projects were rechecked on November 9. `rudi-web` and
`learnrudi` both link `learnrudi/rudi` at the repository root. The effective
`rudi-web` override is static output `public`, `npm run build`, framework null,
and `git.deploymentEnabled: false`. The secondary `learnrudi` project's older
deployed override omits that flag and its dashboard remains Automatic; this
branch and current main retain the root configuration disabling automatic Git
deployments for every branch, including previews. Provider settings are unchanged.

Deliver through GitHub integration, adopt the accepted main revision on Admin,
then manually deploy it to `rudi-web`. Verify the unchanged sample URLs and the
downloaded PDF hash after promotion. Rollback is the prior production deployment
`dpl_Ee8a6hArRZdVZfEtGvxHAfkEEfpZ`. No data migration occurs.
