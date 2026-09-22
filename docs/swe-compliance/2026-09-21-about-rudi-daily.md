# About RUDI Daily: digital-worker example

## Contract and scope

User requested replacing the About the Rundown page with About RUDI Daily and explaining the Daily as RUDI's autonomous digital worker for AI news across industries, domains, and research. Connect this example to digital workforces for research, invoicing, finance, and operations, mention Microsoft Copilot, Claude, ChatGPT, and Codex as tools organizations may use, and provide a route to speak with RUDI.

Existing authority to commit and push website updates continues on `codex/learnrudi-bright-site-20260911`. This follow-up is one coherent content-and-route migration from base `cf4f668b509e5313de874287ecce59276fb8afd8`. No PR, merge, deployment, subscription-provider setup, or cleanup is included.

The worktree was clean before the change. No unrelated files were absorbed.

## Confirmed impact map

| Path | Action | Purpose |
| --- | --- | --- |
| `public/insights/about-rudi-daily/index.html` | Add | Canonical worker story, profile, workflow, coverage, examples, and service/inquiry links |
| `public/insights/about-the-rundown.html` | Replace through route migration | Retire old About page while preserving the URL through a permanent redirect |
| `public/css/rudi-daily-about.css` | Add | Scoped editorial layout and responsive profile, steps, and use cases |
| `vercel.json` | Modify | Direct permanent redirects for old `.html` and extensionless addresses |
| `public/insights/index.html`, `public/insights/rudi-daily/index.html` | Modify | Link directly to the new canonical page |
| `public/insights/rudi-*-ai-news-*.html` | Modify | Exactly 73 existing editions; change only the About link destination |
| `internal/scripts/build_daily_edition.py` | Modify | Future editions use the new canonical About link |
| `public/sitemap.xml` | Modify | Replace the old About URL and update its modification date |
| `internal/scripts/test_update_daily_catalog.py` | Modify | Keep the catalog fixture consistent with the canonical route |
| `internal/scripts/check-public-layout.mjs` | Modify | Require new page, retire old file, and enforce permanent redirect |

Order: add migration guards; observe failure; implement page and migration; verify article preservation, source template, routes, browser behavior, and checks; review; publish the same feature branch and verify source on the admin Mac.

The shared shell comes from `internal/scripts/site_shell.py`; the new page was passed through `apply_shell` and checked for idempotence. Existing edition prose is preserved rather than regenerated. The catalog updater preserves the non-edition sitemap entry and the archive's unmanaged About link.

## Content and status decisions

- Daily describes the intended edition cadence; it is not a live operational status.
- A worker profile explains role, sources, cadence, output, and editorial oversight.
- No live worker-status endpoint or scheduler exists in this static site repository. Do not claim that the agent is online or actively running. A real indicator would require an operational status feed and freshness/failure behavior; none is fabricated here.
- Coverage is the complete set found and verified for an edition, not an exhaustive guarantee of every AI story on the web.
- Earlier Rundown editions retain their historical names and news content.
- The inquiry link uses the existing supported `interest=ai-implementation` value. No new form behavior, provider integration, or submission is introduced.

## Verification

- Red: `npm run build` after adding migration guards failed on the missing canonical page, returned retired page, old sitemap route, missing new sitemap route, and missing permanent redirect. Output: `/tmp/learnrudi-about-daily-red.txt` (machine-local evidence).
- Green: `npm run build` passed after implementing the page and migration with unchanged guards. An intermediate build caught the missing shared 2026 script; the page now loads it.
- `npm test`: 48 passed, 0 failed.
- `python3 -m unittest discover -s internal/scripts -p 'test_*.py'`: 20 passed.
- `python3 internal/scripts/site_shell.py --check`: zero pages need updating.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8088/`: 131 HTML responses, 35 assets, 166 unique local URLs passed.
- Exact edition preservation: each of the 73 current files equals its HEAD content after only replacing the old About href with `/insights/about-rudi-daily/`.
- Debt scan of `internal/scripts/check-public-layout.mjs` under graph root `internal`: one file reported, zero findings. JSON is stored alongside this record. An initial scan used the default absent `src` graph and was discarded; it did not constitute coverage.
- Browser: desktop layout and direct 390px mobile screenshot inspected; content width equals viewport width with no horizontal overflow. Exactly one worker profile and four workflow steps. Temporary viewport overrides reset.
- Browser: clicking the digital-worker CTA reached the real inquiry form with AI Implementation selected. No form submitted.
- `git diff --check`: passed.

No new unit tests were added for static copy or styles. The existing layout guard provides the route regression check. Production HTTP redirects require Vercel deployment; the Python preview server does not execute `vercel.json`. The configuration contract is verified locally and on the peer, with production verification deferred until deployment is authorized.

## Review and delivery

Independent review passed Standards, Spec, and Proof with no actionable findings. The reviewer independently reran 48 Node tests, 20 Python tests, build, shell check, crawl, whitespace, debt scan, and all 73 edition preservation comparisons. Exact pushed revision and peer verification are recorded at closeout. Retain the development and peer verification worktrees; no cleanup is authorized.
