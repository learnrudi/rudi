# LearnRUDI resource and page refresh — September 22, 2026

This batch implements the owner's review of the prompting guide, older insights,
regional index, managed services, About page, and Learn & Resources menu.
The base was `04d2dd3c4267e339263426328d25f38f96df3089`.

## Ownership and integration

Four user-requested tasks used isolated website worktrees. Their reviewed commits
were cherry-picked into `codex/resources-refresh-20260922`:

- Regional index: `d71bad764fe959878c726ed92b8179b6ad5ca8d0`.
- Managed services: `475d6f756c44208ed0a7e09f51749ae61cfa0b34`.
- About: `b2cf525c423e1ea342d3ff5b333db050a3a72284`.
- Three insight articles: `e90fdc1e123eddd5e91c311ff45ba17744875b44`.

Each task has a scoped evidence document under docs/. The coordinator owns
prompting.html, its CSS, Insights listings, sitemap dates, and the shared shell.
The original canonical local checkout's unrelated work was not touched.

## Prompting guide

Replaces the long model-trick/template catalogue with a work brief, relevant
context, a worked example, three optional task templates, review criteria, and
actual system permissions for agent actions. Retains CRAFT as a practical
checklist and preserves original section anchors. Removes obsolete inline
animation and navigation code; uses native details and the existing shared menu.
Original publication date retained; modification date is September 22, 2026.

Current primary sources checked and linked on-page:

- Microsoft Copilot: https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-writing-prompts-in-microsoft-365-copilot
- OpenAI context and prompting: https://developers.openai.com/api/docs/guides/prompt-engineering
- Google examples and format: https://ai.google.dev/gemini-api/docs/prompting-strategies
- Anthropic success criteria: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- OpenAI agent risk and approvals: https://developers.openai.com/api/docs/guides/agent-builder-safety

Examples are original illustrative work briefs. No live integration or promised
outcome is implied. Permissions must be enforced by the application; a prompt
alone cannot establish an access boundary.

## Shared navigation

Edit source: internal/scripts/site_shell.py. Regenerate with
`python3 internal/scripts/site_shell.py`. Menu order: Insights & resources,
RUDI Daily, Workplace AI Playbook, Newsletter, Learning library, Prompting guide.
Footer begins with the same first four destinations. Both desktop and mobile
use the existing generator. The Daily renderer imports this shell for future
editions. Historical reporting content remains unchanged.

## Validation

- `npm test`: 54 tests pass.
- `npm run build`: layout, route, asset and anchor checks pass.
- `python3 internal/scripts/site_shell.py --check`: no drift.
- `python3 -m unittest discover -s internal/scripts -p 'test_site_shell.py'`: 3 pass.
- Local crawl: 148 HTML responses, 54 assets, 202 unique local URLs; pass.
- `git diff --check`: pass.
- Verified all 127 generated HTML diffs outside the separately edited Insights
  listing equal apply_shell(previous source), with no other content changes.
- Article structured data parses. Existing URLs and original anchors retained.
- Coordinator browser review: desktop prompting, managed-worker illustration,
  regional index, resources menu and labor article; mobile prompting at 390px
  and 320px with no overflow; template opens by keyboard; mobile menu has the
  same six destinations in the requested order and no overflow.
- Additional page-specific desktop/mobile and CTA checks are in task evidence.

No new JS/TS implementation, dependencies, forms, or backend behavior. Static
editorial changes and menu data do not warrant new mirrored-content tests;
existing behavior tests and direct keyboard checks cover retained interactions.
No new red/green loop or JS/TS debt scan applies. Browser coverage is Chromium,
not an exhaustive browser/assistive-technology matrix.

Newsletter delivery configuration remains with its existing separate task.
Publication and release-peer verification are performed by the coordinator
against the exact integrated revision.
