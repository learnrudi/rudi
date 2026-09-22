# Responsible AI and RESPECT website copy

Updated September 22, 2026.

The website uses the following RESPECT wording, based on the current editorial
direction: Responsible; Equitable access; Safety; Privacy; Efficient and
effective; Control; Transparency. Every digital worker has a named human manager
with the information, time, and authority to review, correct, and stop its work.
Automation does not transfer accountability away from people or the organization.

Earlier training editions use Reliability for R and Choice and control for C.
The website now emphasizes responsible human ownership; reliability remains part
of evaluating safety, quality, and effectiveness. This update does not revise
historical articles, surveys, or separately maintained curriculum and slide decks.

## Placement

- `/insights/human-centered-ai/` explains all seven principles, gives a workplace
  question for each, and applies them to an illustrative weekly report.
- `/approach/responsible-ai/` is the shorter overview and service entry point.
- The homepage, approach overview, human-centered approach, and five service
  pages introduce the relevant responsibilities and link to the framework.
- The insights index and sitemap expose the article. The insights newsletter
  invitation now reflects the signup form published in the preceding release.

The article identifies RESPECT as RUDI's framework. Further reading links to
NIST's AI Risk Management Framework characteristics chapter and the OECD AI
Principles. The article does not present those organizations as its authors.

## Validation

This is static HTML, CSS, and sitemap work; no application behavior, dependencies,
server endpoints, or subscriber processing changes. A new red/green test was not
appropriate for the copy changes. Existing regression tests, public-layout build,
shared-shell checks, and a local crawl cover integration. Manual browser review
covers desktop and 390px/320px layouts, the principle anchors, and the article CTA.
The article has one H1, seven principle sections, unique IDs, valid local anchors,
Article metadata, and a canonical URL. The shared site header and footer remain
owned by `internal/scripts/site_shell.py`.

Publication uses a feature-branch PR and the existing GitHub/Vercel deployment
path. Validate the same revision on the admin Mac before publishing, preserve
machine-local runtime files, and compare the deployed pages with the committed
source after merge.
