# Public AI resource pages and PDF downloads

The approved resource package needs public links for online reading and separate
PDF downloads. This change adds three continuous web editions to Insights &
Resources, preserves the reviewed companion PDFs, and links the pages from the
resource index and sitemap.

| Resource | Page | PDF |
| --- | --- | --- |
| RESPECT Responsible Use Model | `/insights/respect/` | `/assets/documents/responsible-use-model.pdf` |
| AI Literacy Framework Matrix | `/insights/ai-literacy-framework/` | `/assets/documents/ai-literacy-framework-matrix.pdf` |
| Illustrative survey summary | `/insights/ai-survey-summary-sample/` | `/assets/documents/ai-survey-summary-sample.pdf` |

## Content and design

- RESPECT uses Responsible, Equitable access, Safety, Privacy, Efficient and
  effective, Control, and Transparency. The names match the
  [published RUDI framework](https://learnrudi.com/insights/human-centered-ai/).
- The matrix retains all 30 competency descriptors across three dimensions,
  five levels, and two application tracks.
- The sample contains no organization results. Counts and comfort values are
  redacted, the radar is explicitly schematic, and roadmap targets are labeled
  illustrative. No scoring or report automation is introduced.
- Open layouts, typography, subtle horizontal dividers, and Paper surfaces
  preserve the approved design. Controls use Node Teal with Ink text. The new
  page styles are scoped; shared navigation source and existing pages retain
  their current behavior.
- The PDFs contain 2, 3, and 5 pages. All ten pages were rendered and visually
  checked. Local delivery returns `application/pdf` and the reviewed bytes.

## Verification

- `npm test`: 67 passing tests.
- `npm run build`: public layout, links, analytics coverage, and skills catalog
  checks pass.
- `git diff --check`: passes.
- Shared-shell comparison for each new page: passes.
- `python3 internal/scripts/site_shell.py --check`: reports pre-existing drift
  in `public/index.html`, `public/connect/index.html`, and
  `public/connect/thanks/index.html`. All three files are byte-identical to
  the starting main revision and already fail the same comparison there.
  They are outside this change. The required build and test checks pass.
- Browser review: one H1 per page, seven RESPECT principles, 30 matrix
  descriptors, and working PDF targets. At desktop and 433 CSS-pixel mobile
  width there is no document-wide horizontal overflow. The radar scrolls
  within its own region on small screens.
- Design-rulebook scan of the three pages and new stylesheet: no findings.
- No behavior-bearing application code, dependency, or JS/TS file changes.
  A new red-green test is not warranted for these static content and style
  additions; existing integration checks and rendered/link checks verify them.

## Release verification, November 9, 2026

The task was isolated from unrelated work at starting main revision
`04169bba9d215b64fa9d13a14edbf995d717a116`.

Both Vercel projects, `rudi-web` and `learnrudi`, were inspected in the live
dashboard and CLI. Both connect to `learnrudi/rudi` at the repository root.
`rudi-web` serves `learnrudi.com`; its effective configuration overrides the
dashboard's Next.js preset with static output `public`, `npm run build`, and
`git.deploymentEnabled: false`. The second project's older deployed
configuration omits the Git flag; its dashboard remains Automatic. The current
main and this task's unchanged root configuration explicitly disable Git
deployments for all branches, including previews, as defined by
[Vercel's Git configuration](https://vercel.com/docs/project-configuration/git-configuration).
No provider configuration was changed. These observations resolve the
publication preflight for this release, not a blanket approval of future
configuration changes.

Release is through reviewed GitHub integration followed by a manual deployment
of the accepted main revision to `rudi-web`. Before promotion, verify the three
pages, three PDFs, existing routes, and production-domain assignment. The prior
production deployment is `dpl_2BjbJYCQmCFLzoc8kVUojsVQdwoi`; restoring its aliases
is the application rollback if required. No database or data migration occurs.
