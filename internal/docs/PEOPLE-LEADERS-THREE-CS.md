# AI for people leaders: three Cs

Updated September 22, 2026. The existing public URL remains
`/insights/ai-for-people-leaders.html`.

## Editorial direction

The article follows Compliance, Competency, Cost. Compliance covers the
organization's policy and the employee's instructions. Competency covers a
practical baseline, role-based learning, accessible support, and workflow
practice. Cost covers licenses, metered usage, administration, integrations,
and the work of reviewing results.

Copilot and Gemini are evaluated in the context of an existing workplace suite.
ChatGPT/Codex and Claude/Claude Code may serve department requirements or broader
organizational use. This is a proposed adoption pattern, not a claim that a
vendor is limited to one organizational layer. The article links to RESPECT and
requires accountable human management of digital workers.

The previous universal security-tier hierarchy, blanket retention assurances,
unsupported vendor rankings, and cost-first sequence were replaced. The old
page's unused navigation listener and embedded style system were removed; the
page uses the existing generated shell and shared navigation assets. The article
and its FAQ metadata now agree. Original publication date is retained and the
revision date, Insights listing, and sitemap are updated.

## Vendor facts and sources

Checked against official pages on September 22, 2026:

- https://openai.com/business/pricing/ — ChatGPT Business standard/premium seats:
  $20/$100 per user/month billed annually, $25/$125 monthly. Enterprise has
  negotiated pricing and credit/token options. Business includes Codex.
- https://help.openai.com/en/articles/9039756 — ChatGPT and API billing are separate.
- https://claude.com/pricing — Team standard/premium seats use the same published
  annual/monthly amounts above. The published Enterprise offer has a seat fee
  plus usage at API rates; its controls differ from Team.
- https://workspace.google.com/pricing.html — Workspace includes Gemini features;
  app availability and access vary by edition. Personal AI plans are separate.
- https://www.microsoft.com/en-us/microsoft-365-copilot/pricing — Copilot plans,
  suite bundles, and licensing prerequisites; avoid implying all paid Copilot
  capabilities are included in every Microsoft 365 subscription.
- https://platform.claude.com/docs/en/about-claude/pricing and
  https://ai.google.dev/gemini-api/docs/pricing — model/token pricing plus
  feature-specific meters.
- https://www.microsoft.com/en-us/microsoft-365-copilot/microsoft-copilot-studio —
  Copilot Credits and pay-as-you-go options, with licensed-use distinctions.
- https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview —
  supported connector permission models.

Published prices are explicitly dated, in USD, before tax. Verify vendor pages
again before revising the price examples. The 25-employee budget is illustrative:
20 standard seats at $20 plus 5 premium seats at $100 equals $900/month, or
$10,800 annually, excluding all other costs. It is not a vendor quote.

## Verification

Static content and styles only; no new application behavior or test runner.
Existing Node tests, build, shared-shell check, Python shell tests, and local
crawl are the regression gates. The first Node run caught a decorative side
border prohibited by the brand contract; the stylesheet was corrected and the
test was retained unchanged. No JS/TS files were edited.

Manual browser review covers the page, three section links, mobile layouts,
table scrolling, and the inquiry CTA. Structural checks cover one H1, unique
IDs, anchors, Article metadata, and exact FAQ/schema agreement. The page keeps
the existing public route and shared navigation.
