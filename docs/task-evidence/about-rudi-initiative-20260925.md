# About RUDI initiative refresh

Scope: About page copy and page-scoped layout, plus its entry in the SEO reference configuration. Based on `origin/main` at `1ada04d`. The canonical checkout and existing worktrees were preserved.

The page now leads with RUDI as an initiative for responsible, human-centered AI, explains its AI-literacy motivation, and introduces live, learn, and work as three pillars. Practical guidance links to the existing human-centered approach, RESPECT framework, learning library, and Workplace AI Playbook. The founder profile is a supporting part of the team section. Existing `#founder` and `#partners` destinations, public experience claims, profile links, shared shell, and analytics installation remain intact.

Copy follows the owner's September 25 direction and existing RUDI origin material about AI literacy. Founder credentials and engagement descriptions derive from the existing public page. No founding date, employee count, named team roster, or new partnership or outcome claim was added. Reviewed against `docs/site-copy-standard.md` and the synthetic-cadence-editor skill.

The founder section shows program design and oversight, agentic infrastructure, education, and applied real estate systems. The owner supplied the public-facing scope for The Propel Center, The Co-Llab Group, Apple community education, and Urban Land Institute. Existing résumé and event records support the education and program descriptions. Apple is described as participation; its [official education announcement](https://www.apple.com/newsroom/2024/10/apple-launches-new-resources-for-teachers-expands-education-grant-program/) supports the initiative's global scope. The ULI activity is supported by the site's existing April 28, 2026 event entry. MIT xPRO is identified as professional training, with the course name from the résumé. Propel wording describes developing curricula and helping shape programs, without presenting proposed infrastructure as a completed deployment. All four profile and video links remain. No private client records or project specifics were copied into this repository.

Validation:

- `npm test`: 62 passed, using the Codex bundled Node runtime because the Homebrew Node executable could not load its simdjson library.
- `npm run build`: passed.
- `python3 internal/scripts/site_shell.py --check`: zero pages need updating.
- About metadata matches the SEO reference entry; all local section links resolve to unique IDs.
- `git diff --check`: passed.
- In-app browser: compared the live About page to the starting source, then reviewed the draft at desktop 1280px and mobile 390px. No horizontal overflow; the pillars stack into one column on mobile; fonts loaded. The mobile pillar jump settled below the fixed header. Founder and partner anchors remain unique.
- Local preview analytics requests blocked. The existing newsletter prompt appeared with an unloaded embedded form during review; the component is outside this copy change.

This is static copy and CSS with no new input boundary or application behavior. No new unit tests or red/green loop were warranted, and no JS/TS files changed.

Publication scope: the owner approved the reviewed page for commit and push on `codex/about-rudi-initiative-20260925`. The approved file set is `public/about.html`, `public/css/about-refresh-20260922.css`, `internal/config/seo.json`, and this evidence record. Private source notes remain outside the website repository. The admin Mac uses an isolated checkout of the same commit, preserving its canonical checkout and unrelated mockup. Merge and production deployment are separate delivery steps.
