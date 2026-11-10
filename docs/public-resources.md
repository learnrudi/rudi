# Public RUDI resources

Use this map to find the published framework materials and their serving files.
The public collection is [Insights & Resources](https://learnrudi.com/insights/#guides).
All paths below are relative to this repository unless they begin with a URL.

| Resource | Public reading link | Download | Serving source |
| --- | --- | --- | --- |
| AI Readiness Pyramid Framework | [One-page image](https://learnrudi.com/images/RUDI-AI-Readiness-Pyrmid.png) | [One-page PDF](https://learnrudi.com/assets/documents/ai-readiness-pyramid.pdf) | `public/images/RUDI-AI-Readiness-Pyrmid.png`; `public/assets/documents/ai-readiness-pyramid.pdf` |
| RESPECT Responsible Use Model | [Web edition](https://learnrudi.com/insights/respect/) | [Two-page PDF](https://learnrudi.com/assets/documents/responsible-use-model.pdf) | `public/insights/respect/index.html`; `public/assets/documents/responsible-use-model.pdf` |
| AI Literacy Framework Matrix | [Web edition](https://learnrudi.com/insights/ai-literacy-framework/) | [Three-page PDF](https://learnrudi.com/assets/documents/ai-literacy-framework-matrix.pdf) | `public/insights/ai-literacy-framework/index.html`; `public/assets/documents/ai-literacy-framework-matrix.pdf` |
| AI Familiarity and Comfort Survey: Sample Summary | [Web edition](https://learnrudi.com/insights/ai-survey-summary-sample/) | [Five-page PDF](https://learnrudi.com/assets/documents/ai-survey-summary-sample.pdf) | `public/insights/ai-survey-summary-sample/index.html`; `public/assets/documents/ai-survey-summary-sample.pdf` |
| Full AI framework | [Framework page](https://learnrudi.com/framework.html) | [All framework downloads](https://learnrudi.com/framework.html#downloads) | `public/framework.html`; `public/css/rudi-framework.css` |

The sample summary is illustrative, not an organization's results. Client-specific
survey links and private reports belong in the client workspace, not this catalog.

## Editing and organization

- `public/` is the deployed website. `public/insights/index.html` owns the public
  guides listing; `public/assets/documents/` holds downloadable publications.
- `internal/docs/brand/ai-readiness-pyramid.html` is the editable Pyramid master.
  Its adjacent review record documents the export settings and visual checks.
  The other resource web editions are editable HTML; their approved PDFs are
  serving artifacts. Do not assume an exported PDF is an editable source.
- `docs/` holds website operating references and review records. `internal/`
  holds maintenance scripts, authoring sources, tests, and historical material.
  Neither directory is deployed as public content.
- Brand authority is the shared content-and-brand library, reached through the
  private `content-and-brand` skill. See [the website brand note](brand/README.md)
  for the public asset copies and current palette.

Keep the historical `Pyrmid` image filename: previously shared links depend on
that exact path. The framework page uses `.html`; do not substitute `/framework`.
When adding or revising a resource, update its public listing and this map together.
Verify the actual public links and download bytes after deployment.

## Checkout and release

The application checkout is `/Users/hoff/RUDI/apps/public-sites/learnrudi` on RUDI
Mac and `/Users/admin/RUDI/apps/public-sites/learnrudi` on Admin. The Git repository
is `learnrudi/rudi`; `main` is the accepted source branch. A local folder may be on
an older working branch, so inspect its state and use a feature worktree from
current `origin/main` without disturbing existing work.

Run `npm test` and `npm run build`. Follow the [release preflight](../README.md#deployment)
before publishing. GitHub integration, manual Vercel deployment, and Admin checkout
adoption are distinct steps; a pushed branch does not update the public website.
