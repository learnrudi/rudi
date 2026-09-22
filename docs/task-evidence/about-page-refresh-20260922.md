# About page refresh — 2026-09-22

Scope: `public/about.html` and new page-scoped `public/css/about-refresh-20260922.css`.
Reduced eight main sections to four; leads with customer work, retains concise founder credentials and selected experience, and replaces card/panel layouts with open columns and horizontal rules. Preserved `#founder`, `#partners`, canonical URL, founder PDF/social links, and unchanged shared header/footer/scripts. No shared assets changed.

## Public-repo evidence

- Accepted `04d2dd3c4267e339263426328d25f38f96df3089:public/about.html`: founder role, predictive-lending background, Hoff Digital, Propel Center/UIS curriculum, EDHEC MBA and IBM/DeepLearning.AI/MIT xPRO training.
- `public/case-studies/enterprise-ai-adoption-strategy/index.html`: Walker SCM strategy and rollout scope of 1,200 employees (not a measured outcome).
- `public/case-studies/warren-county-esc.html`: executive AI literacy and educator programs.
- `public/case-studies/index.html`: AfroTech and Mercantile Library speaking/community work; linked on page.
- Existing public service destinations support the four customer paths. No new changing vendor/product specifications or technical claims were introduced; no external verification was needed.

## Validation

- `npm test`: 54/54 pass.
- `npm run build`: static layout/link/anchor checks pass.
- `python3 internal/scripts/site_shell.py --check`: zero pages need updating.
- `git diff --check`: pass.
- Browser preview on isolated `http://127.0.0.1:8093/about.html`: desktop 1280px and mobile 390px; inspected title, headings, service links, founder layout and selected experience. At 390px, document scroll width equals viewport width. Both anchors exist exactly once; founder mobile jump and settled partners desktop jump verified. Temporary viewport override reset.
- Static HTML/CSS only: no behavior-bearing JS, so red/green tests and JS/TS debt scan are inapplicable. No speculative copy tests added.

## Limits and handoff

The existing shared newsletter popup appeared during browser inspection and its embedded form was blank locally; unchanged and outside this task. No new credentials, clients, outcome claims or private records used. Commit only on the assigned branch; integration, publishing and admin-Mac synchronization belong to the coordinating task.
