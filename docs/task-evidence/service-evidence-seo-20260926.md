# Service evidence and search presentation

## Scope

Strengthen the existing AI Readiness Assessment and AI Implementation pages
after reviewing the proposed search-discovery work. Keep their canonical URLs,
inquiry routing, analytics, shared navigation, and existing project evidence.
Use current main (`5b6427b`) and an isolated, clean task checkout; preserve the
canonical checkout's unrelated work. Publish these content changes as one slice.

Completion for this slice requires aligned metadata, valid links and markup,
repository checks, peer source verification, and matching deployed pages.
Search Console measurement and retirement of the separate legacy Vercel site
are separate work items; this change does not claim to complete either one.

## Changes and sources

- Assessment: explain the four deliverables, clarify the existing Warren County
  program evidence, and answer questions about participants, scope, timing,
  price-setting, and when training or workflow work may be a better entry point.
- Implementation: add an attributed link to AfroTech's September 3 workshop
  coverage, retain the live RUDI Daily example, and explain testing, handover,
  platform fit, scope, and ongoing support. Identify the workshop as a
  demonstration without claiming production outcomes.
- Align descriptions across HTML and Service structured data; add the two pages
  to the SEO reference. Update only their sitemap modification dates.

Evidence already public:

- `/case-studies/enterprise-ai-adoption-strategy/`: Walker SCM strategy and
  rollout scope across 1,200 employees; no quantified client outcomes added.
- `/case-studies/warren-county-esc.html`: baseline assessment and an eight-week
  executive literacy program involving 30 leaders.
- `/insights/about-rudi-daily/`: the operating publication and its workflow.
- https://afrotech.com/ai-edge-workshop-claude-automated-workflows

## Verification

- `npm test`: 62 passed.
- `npm run build`: passed.
- `python3 internal/scripts/site_shell.py --check`: zero pages need updating.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8097/`: passed;
  150 HTML responses, 55 assets, 205 unique local URLs.
- Direct HTML checks: one title, H1 and canonical per page; metadata, JSON-LD,
  and SEO reference agree; three native FAQ disclosures per page; inquiry links
  retain their service interest and form anchor.
- `git diff --check`: passed.

Static copy and native HTML disclosures reuse existing styles. No JavaScript,
CSS, dependencies, or form logic changed, so new unit tests, a red-green loop,
and a JS/TS debt scan are not applicable. Browser control was unavailable during
this pass; desktop/mobile visual inspection remains a validation limitation.
