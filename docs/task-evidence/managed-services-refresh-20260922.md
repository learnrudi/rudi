# Managed services page refresh — 2026-09-22

Scope: two service HTML pages and `public/css/managed-workers-refresh-20260922.css`. No shared assets, navigation, scripts or canonical checkout changed.

Workspace management now describes accounts/licenses, approved tools, permissions, connectors, policy configuration and usage support. Managed digital workers now describes a defined recurring workflow, review/approval boundaries, exceptions and a named human manager. Each page links to the complementary service and to training, workflow mapping and agent/application building.

Replaced the unrelated worker hero photo with a static, semantic HTML/CSS flow on bright paper. Removed simulated activity states and unverified claims about certification, continuous monitoring, QuickBooks reconciliation and a live dashboard. Project operations is explicitly an illustrative scope. Preserved the project-operations and rudi-workflow-hero anchors, existing CTA destinations and inquiry types.

Primary sources checked on 2026-09-22, linked on workspace page:
- https://help.openai.com/en/articles/8411955 — workspace administration/settings.
- https://support.anthropic.com/en/articles/9267276-roles-and-permissions — organization roles and plan-dependent controls.
- https://help.openai.com/en/articles/11750701 — connected source permissions remain relevant.

Verification:
- `npm test`: 54 passed.
- `npm run build`: passed.
- `python3 internal/scripts/site_shell.py --check`: 0 pages need updating.
- `git diff --check`: passed.
- Local browser at 127.0.0.1:8097: desktop and 390 × 844 mobile render checks; both pages have document width 390 at mobile size, without horizontal overflow.
- Clicked each hero CTA: primary_interest selected ai-workspace-management and ai-implementation respectively. No form submitted.
- Shared headers/footers checked unchanged against HEAD.

No behavior-bearing JS changed; red-green tests and JS/TS debt scan do not apply to this static editorial/CSS work. Existing automated checks plus proportional browser verification used instead of speculative copy tests.

Limitations: examples are proposed scopes, not evidence of deployed client capabilities. Integration, publication and admin-Mac synchronization remain with the coordinating task as explicitly instructed. Existing port 8088 server untouched.
