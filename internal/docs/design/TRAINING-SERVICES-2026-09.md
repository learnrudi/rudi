# Training and services — September 2026

## Accepted scope

The homepage leads with “Help your team put AI to work.” Visitors can choose team training, a department workflow engagement, agents and small applications, or AI workspace setup and support. The five-stage approach remains below the service choices and evidence; readiness assessment stays available through its existing route. This implements the approved broader offer without adding prices, delivery guarantees or new client claims.

The authored pages are the homepage, service overview, workforce programs, implementation, managed digital workers, inquiry and inquiry confirmation pages, plus three new pages:

- `/how-we-help/team-workflows/`
- `/how-we-help/ai-workspace-management/`
- `/ai-training/q4-2026/`

The Q4 page is a separate October–December 2026 campaign. Review its seasonal links after December; the department page is the evergreen destination. No automated expiry or redirect is introduced.

## Visuals and ownership

- The homepage uses a generic weekly operations report: documents, email and business data feed a draft, followed by team review and a report/dashboard. It is labeled as an example, with no live execution or provider requirement. The original animation controls, suspension and reduced-motion behavior are retained.
- Five simple SVG icons in `public/images/workflow/` were authored for this interface: `documents.svg`, `email.svg`, `business-data.svg`, `draft.svg`, `report.svg`. They contain only static paths and shapes; no scripts, external references or additional dependencies.
- The existing public ULI participant photograph (`uli-cincinnati-workshop-room.png`) illustrates team learning. The existing ULI event graphic replaces the homepage Avanade preview; case-study galleries are retained.
- The department process map and workspace diagram use semantic HTML and `public/css/rudi-services.css`, with visible human-review and access labels.
- `public/images/rudi-daily-application.jpg` is a real browser capture of the RUDI Daily publication/archive on September 22, 2026, at 1181 × 1054. It contains only already-public publication content and is labeled as a RUDI example, not client software. It is an illustrative screenshot, not a live feed.
- The vendor-specific research-briefing diagram is now a static example on the managed digital workers page; its existing logo assets are retained.
- `internal/scripts/site_shell.py` owns shared navigation and footer markup. Regenerate with `python3 internal/scripts/site_shell.py`. Of 124 modified existing HTML pages, 117 change only in these generated regions. Three new pages bring the shared-shell total to 127.

## Inquiry routing and input boundary

Existing Formspree submission and thank-you behavior remain. The main training CTA selects `ai-enablement`; department work selects `team-workflows`; builds select `ai-implementation`; workspace support selects `ai-workspace-management`.

The Q4 CTA supplies `interest=team-workflows`, `offer=q4-team-program` and `source=q4-2026`. Existing allowlisted ad attribution survives the link and is copied into the form. Both new interest values, the offer and source are explicitly allowlisted by `public/js/start-here-prefill.mjs`; unknown input continues to be dropped. Without JavaScript, the form remains usable through manual service selection. No external inquiry was submitted during verification.

## Verification — September 22, 2026

- Red: `node --test internal/tests/start-here-prefill.test.mjs` failed for the new department interest (empty result). Green: adding the scoped allowlist values passes all seven parser/attribution tests. After layout and copy refinement, `npm test` passes 52 tests.
- `npm run build`: passed. `python3 internal/scripts/site_shell.py --check`: zero drift. `python3 -m unittest discover -s internal/scripts -p 'test_site_shell.py'`: three passing tests.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8088/`: 147 HTML responses, 51 asset responses, 198 unique local URLs passed. `git diff --check`: clean.
- Packaged SWE debt scans of two production JS/MJS files and four changed test files: zero findings. Browser script/test entrypoints were declared explicitly because the scanner does not infer HTML script tags.
- Browser review: desktop, 390px and 320px; no horizontal overflow on the homepage, training, department, workspace, implementation or Q4 pages. The narrow workflow labels fit without clipping. The expanded desktop menu scrolls within a 600px-tall viewport. Images load.
- Actual CTA clicks select training, department, implementation and workspace interests. The Q4 link preserves its offer, source and UTM values; actual form DOM attributes confirmed all four campaign values. Browser review initially loaded an old cached script; retesting current assets confirmed the new service selections. Temporary viewport, cache and media overrides were restored.
- Review covered authored content, generated-only shell diffs, source attribution, SVG safety, navigation, metadata, preserved assessment/ad routes, form input boundaries and static fallback. No new runtime dependency or backend was added. CSS, copy and static diagrams were verified visually and through existing layout/link checks rather than new implementation-mirroring tests.

Known gaps: browser layout review used the Codex Chromium browser, without a separate Safari/Firefox run. Contact delivery was not exercised against Formspree; existing submission behavior tests remain green. Aggregate engagement figures and case-study claims are retained from the approved site, not newly audited in this change.
