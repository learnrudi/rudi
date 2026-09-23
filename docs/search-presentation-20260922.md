# Search presentation cleanup

## Scope and completion criteria

Prepare homepage website-name structured data, clearer metadata and introductions
for About, Greater Cincinnati, workforce training, and Our Work. Align the SEO
reference with current page markup and update modification dates only for pages
changed here. Preserve routes, navigation, forms, analytics, published evidence,
the service architecture, and the existing crawlable favicon.

Completion requires valid JSON-LD and metadata, repository checks, a local link
crawl, and desktop/mobile review of changed headings. These are static content
and metadata changes; no application behavior or dependencies are introduced.
No new unit tests are planned for copy. Existing checks and direct output
validation cover the change.

## Observations

- The supplied screenshots show older homepage and About titles.
- Search Console reports the homepage indexed, with a successful smartphone
  crawl on September 16, 2026 at 11:43:20 AM (as displayed by Google), indexing
  allowed, and the inspected homepage selected as canonical.
- The sitemap was already discovered at `https://learnrudi.com/sitemap.xml`.
- Search Console overview performance and indexing reports are still processing.
- RUDI was absent from the first result page shown in the user's Arc tab for
  `AI training cincinnati`. This is one location-specific observation, not a
  general rank report.
- The favicon is linked, accessible as a 64-by-64 PNG, and not blocked by
  robots.txt. Retain its stable URL; appearance in Google is not guaranteed.
- The SEO reference contains older copy than the deployed HTML. Page markup
  remains the deployment source of truth.

## Publication handoff

Prepared on `codex/search-presentation-20260922`, based on `04430d5` from freshly
fetched `origin/main`. The canonical checkout's 93 existing changes were left
untouched. The user approved committing, publishing and merging a PR, syncing
the admin Mac, and verifying deployment on September 22, 2026. The final PR
and task completion record carry the resulting commit and deployment evidence.

The admin Mac was inspected read-only: matching repository and base revision,
with one unrelated untracked document preserved. Verify the accepted commit in
an isolated admin checkout before publication, then fast-forward the canonical
admin checkout after merge while preserving that unrelated document. Transfer
only Git source history; no machine-local files will be copied.

### Reviewable copy

| Page | Prepared title |
| --- | --- |
| Home | AI Training, Workflows & Custom Tools \| RUDI |
| About | About RUDI \| Team Training & AI Development |
| Greater Cincinnati | AI Training & Implementation in Cincinnati \| RUDI |
| Our Work | AI Case Studies, Training & Workshops \| RUDI |
| Workforce programs | Workforce AI Training & Enablement Programs \| RUDI |

Homepage description: “RUDI helps organizations put AI to work with hands-on
team training, workflow improvement, custom agents and applications, and ongoing
support.”

Home, About, and workforce titles retain the current wording. Search and social
summaries are aligned on all five pages. About has a distinct H1; the regional
H1 and introduction name training and implementation. The case-study summary
names two engagements already described on the page. The SEO reference was
reconciled to current HTML, including existing reference entries for pages whose
HTML did not change. Dates changed only on the two edited pages with older
sitemap dates; the other three already have the current date.

### Validation

- `npm run build`: passed.
- `npm test`: 62 passed.
- `python3 -m unittest discover -s internal/scripts -p 'test_*.py'`: 25 passed.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8093/`: passed,
  146 HTML responses and 55 asset responses, 201 unique URLs.
- Direct metadata validation: one title, H1, canonical and each relevant meta
  tag per edited page; unique titles; all JSON-LD parses; the homepage website
  publisher resolves to its organization entity.
- Regional and About browser previews inspected with desktop/mobile sizing.
  DOM geometry showed no horizontal page overflow. The in-app screenshot
  capture showed duplicated edge strips, limiting screenshot-based layout QA;
  page text and DOM geometry were checked independently.
- `git diff --check`: passed.
- No behavior-bearing code changed, so red-green tests and a JS/TS debt scan
  were not applicable. Existing application tests were run as regressions.

### Search Console actions

Google accepted indexing requests for the currently live homepage and About
page. Both last crawls were September 16, 2026; About showed 5:13:06 AM in the
interface. Both are indexed, allow crawling and indexing, fetch successfully,
and have matching selected canonicals. Queue acceptance is not a completed
recrawl and does not publish the local changes prepared here.

After the approved changes deploy, inspect the changed key pages and request a
refresh as needed. Do not repeatedly submit already queued URLs: Google says
repeat submissions do not improve queue position or priority.

### Measurement once reports finish processing

Compare the latest 28 complete days with the preceding 28 days. Record clicks,
impressions, CTR and average position for brand queries (`RUDI`, `learnrudi`,
and the expanded company name), separately from service and regional queries.
Inspect the homepage, regional page, training page, and case-study landing pages.
Use the existing GA4 confirmed inquiry event to evaluate business outcomes;
Search Console clicks alone do not establish lead quality. Do not invent a
baseline while reports are processing. This is a review procedure, not a newly
scheduled automation.

## Google controls and limits

Google chooses titles, snippets, sitelinks, and site names. Website-name markup,
clear page summaries, and accurate internal links supply consistent signals;
they do not guarantee a chosen result or ranking. Do not suppress the learning
library with `data-nosnippet`: it remains a relevant result for learning queries.

References:
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/appearance/sitelinks
- https://developers.google.com/search/docs/appearance/favicon-in-search
