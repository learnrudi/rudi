# AI platform service pages — 2026-09-22

## Scope and acceptance

Provide dedicated RUDI service pages for Microsoft Copilot, Anthropic Claude,
OpenAI ChatGPT/Codex, and Google Gemini. Each page explains training, workspace
support, and scoped implementation; includes an illustrative workflow with human
review; links to responsible AI guidance and official provider resources; and
routes interested visitors to the existing inquiry form.

Three new routes join the refreshed `openai-codex-enablement.html` URL. The
existing OpenAI URL and `#content` anchor are preserved. The shared navigation
adds AI platforms under How We Help. Homepage, training, and workspace pages
link to all four pages; How We Help has an unboxed platform directory. No new
form backend, tracking, dependencies, or paid signup is introduced.

## Sources and claims

Official Microsoft, Anthropic, OpenAI, and Google product/documentation pages
linked in each page were checked on 2026-09-22. Links resolve to current official
destinations. Copy avoids fixed prices and universal feature or access claims;
scope depends on the customer's plan, configuration, and approved systems.

The Microsoft launch task supplied the owner-confirmed statement: “RUDI LLC is
a member of the Microsoft AI Cloud Partner Program.” The page uses this exact
membership wording without a designation, certification, or badge claim.
The Marketplace public-profile URL is excluded because public access has not
been verified. Workflow examples are explicitly illustrative, not client results.

## Verification

- `npm test`: 54 tests passed.
- `npm run build`: passed after the three new root directories were registered
  in the route allowlist. Before registration this command failed for exactly
  those three unexpected directories; the guard remains active.
- `python3 internal/scripts/site_shell.py --check`: no drift.
- `python3 -m unittest discover -s internal/scripts -p 'test_site_shell.py'`:
  three tests passed.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8088/`: 151 HTML and
  54 asset responses passed, 205 unique local URLs.
- `git diff --check`: passed.
- Compared each of the 123 navigation-only HTML diffs with the result of
  applying the current canonical shell to its HEAD version: exact matches.
- Service JSON-LD parses; each platform page has one H1 and three official links.
- SWE debt scan covered `internal/scripts/check-public-layout.mjs`, with
  `graph_root` and `scope` set to `internal/scripts`: 11 graph files, one reported
  file, zero findings/errors/warnings. No heuristics were needed.

Browser review covered desktop provider layout and platform directory, the
desktop and collapsed navigation, and all four provider pages at 320px without
horizontal overflow or missing local anchors. A 390px Claude page and the
stacked Gemini workflow were visually inspected. Training and implementation
links selected the corresponding inquiry type; no inquiry was submitted.
Cached preview HTML was identified and refreshed before the directory review.

This is static content and presentation work using existing inquiry behavior.
No tests that duplicate page copy were added. Provider licensing, actual customer
access, and the unpublished Marketplace profile remain outside this website
validation. The repository's existing behavior tests and route guard cover the
reused mechanisms.

## Publication boundary

Use a feature branch and pull request. Verify the committed revision on the
admin Mac release peer before publishing; preserve its existing untracked mockup
and ignored runtime/configuration files. Synchronize accepted Git history only.
Verify production responses after deployment and report the PR and deployed
revision in the task closeout.
