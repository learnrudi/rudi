# Insight article refresh — September 22, 2026

Scope: three named older insight articles and `public/css/rudi-insight-articles-refresh.css`. Base: `04d2dd3c4267e339263426328d25f38f96df3089`; branch: `codex/insight-articles-refresh-20260922`.

Read the actual articles, README, copy standard, brand contract, newer people-leaders and human-centered articles, synthetic-cadence-editor skill, and SWE engineering quick reference. No nested AGENTS.md was found in the worktree or its intermediate ancestors; provided workspace instructions apply.

## Editorial changes

- Higher education: retain practice, coaching, institutional support, and task-specific evaluation. Remove unsupported historical adoption timelines and generalizations about campus capability. Add named ownership, the three Cs, and a practical pilot evaluation approach.
- Integrations: retain seven manual handoffs, labeled as design patterns. Replace unverified vendor pairings, automatic behavior and setup-time promises with inputs, approvals, failure recovery, and accountable ownership. Explain MCP's boundary versus scheduling and workflow implementation.
- Enterprise labor: retain the concern about workforce consequences, released capacity, and changed human work. Verify the selected Stanford cases and headcount figures; distinguish findings from forecasts and local recommendations. Remove unsupported worker-tier sizes, personality claims, market winners, and capability extrapolations. Correct report author names.
- Preserve original publication dates (2025-11-01, 2026-05-19, 2026-05-16); show actual modified date 2026-09-22. Replace stale FAQ schema alongside removed repetitive FAQs. Align headline/social/Article metadata.
- Use bright paper/teal, readable unboxed prose, horizontal rules, and a shared existing button style. Every new CSS selector is scoped beneath `.insight-refresh`, used only by these three pages. No JS implementation added; obsolete inline navigation code removed with the old templates. Shared navigation script retained.

## Sources checked and cited on-page

- UNESCO, Guidance for generative AI in education and research: https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research
- MCP architecture (live documentation resolves to 2026-07-28): https://modelcontextprotocol.io/docs/learn/architecture
- MCP tools specification (explicit 2025-11-25 revision): https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- Pereira, Elisa; Graylin, Alvin Wang; Brynjolfsson, Erik. Enterprise AI Playbook, April 2026: https://digitaleconomy.stanford.edu/app/uploads/2026/03/EnterpriseAIPlaybook_PereiraGraylinBrynjolfsson.pdf — methodology pp. 6–8; oversight/task-selection discussion pp. 28–31; headcount discussion pp. 51–57. Findings from selected successful deployments are not population estimates.

## Verification

- `npm test`: 54 passed, zero failures.
- `npm run build`: static site layout check passed.
- `python3 internal/scripts/site_shell.py --check`: zero pages need updating.
- `git diff --check`: passed.
- HTML inspection: original shared header/footer identical to base; all original IDs retained; Article JSON-LD parses; one H1 per page.
- Headless Chromium on task-owned `127.0.0.1:18743`: all three pages at 1440×900 and 390×900; no horizontal overflow or page runtime errors. Full-page screenshots taken; desktop labor and mobile workflow screenshots reviewed, plus higher-education mobile viewport review. Keyboard skip link moves focus to `#content`; CTA opens `/start-here/`.
- Port 8093 was occupied; it was left untouched. Port 8088 was never touched. Task preview server stopped after checks.
- Static editorial/layout work: no speculative content tests added and no red-green behavior loop needed. No JS/TS files edited; no JS debt scan required.

Integration remains with the coordinating task. No push, PR, merge, deployment, canonical checkout change, or admin-Mac synchronization performed. Browser checks cover representative desktop/mobile Chromium layouts, not all browsers or assistive technologies. Workflow examples are recommendations, not exercised integrations or reported client results.
