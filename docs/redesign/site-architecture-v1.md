# RUDI Public Site Architecture V1

Status: proposed redesign direction  
Scope: information architecture, homepage narrative, content ownership, and migration constraints  
Production impact: none; this document does not authorize deployment

## Positioning Thesis

RUDI is an organizational AI enablement company.

The public site should help a visitor understand four things in order:

1. AI adoption is already an organizational issue, not merely a tool-selection issue.
2. RUDI builds the leadership, learning, workflow, and governance capacity required to guide it.
3. RUDI has a concrete, human-centered way of doing that work.
4. A visitor can begin with a useful next step that matches their context.

The market-facing method language is:

- **RUDI Workflow Discovery & Design** — understand how work happens and redesign it with practitioners.
- **RUDI AI Role Decision** — decide whether AI should automate, augment, be avoided, or require new human work to be added.
- **RUDI RESPECT Human-Centered AI Design** — determine whether the proposed design is responsible and what controls it requires.

The supporting mechanics may still use Discuss–Develop and Automate–Add internally, but `5D` and `4A` should not lead public copy.

## Service Architecture

RUDI has three service lines. They form a coherent progression, but they are not a mandatory funnel; an organization may enter through the line that matches its current decision and readiness.

| Service line | Primary audience | Outcome |
| --- | --- | --- |
| **Organizational AI Strategy & Enablement** | Executives and organizational leadership | Strategy, leadership alignment, readiness, governance, priorities, and an adoption roadmap |
| **Applied AI Learning** | Workforce, managers, and practitioners | Practical fluency, responsible-use judgment, workforce upskilling, custom training, and workflow-centered learning |
| **RUDI Digital Coworkers** | Operations leaders, workflow owners, and implementation teams | Bounded AI agents designed, integrated, deployed, governed, and measured inside the organization |

The Live AI Workflow Clinic and Camp Claude are delivery formats within **Applied AI Learning**. They are not separate service lines.

Applied AI Learning helps people work effectively with AI. RUDI Digital Coworkers perform or coordinate bounded work inside the organization. A digital coworker must have a named human owner, approved knowledge and tools, visible controls, explicit handoffs, recoverable failure behavior, and measurable performance.

## Primary Navigation

| Label | Purpose | Proposed canonical route |
| --- | --- | --- |
| How RUDI Helps | The three service lines and the organizational decisions each one supports | `/how-rudi-helps/` |
| Methods | RUDI Workflow Discovery & Design, AI Role Decision, and RESPECT | `/methods/` |
| Case Studies | Source-backed examples of work and outcomes | `/case-studies/` |
| Insights | RUDI Daily, perspectives, and field notes | `/insights/` |
| Resources | Diagnostics, briefs, guides, and practical starting tools | `/resources/` |
| About | RUDI, Brandon Z. Hoff, partners, and operating point of view | `/about/` |

The persistent action is **Talk with RUDI**, pointing to `/contact/` once the Astro route exists. During migration, it continues to point to `/contact.html`.

The three service lines should be visible high on the homepage and on the How RUDI Helps landing page. The primary navigation does not need a separate link for every service line.

## Site Tree

```text
/
├── how-rudi-helps/
├── ai-strategy-enablement/
│   ├── first-90-days/
│   └── organizational-readiness/
├── applied-ai-learning/
│   ├── custom/
│   └── live-workflow-clinic/
├── digital-coworkers/
├── methods/
│   ├── workflow-discovery-design/
│   ├── ai-role-decision/
│   └── respect/
├── case-studies/
│   └── [case-study]/
├── insights/
│   ├── rudi-daily/
│   ├── perspectives/
│   └── field-notes/
├── resources/
│   └── [resource]/
├── about/
│   ├── founder/
│   └── partners/
└── contact/
```

This is a content model, not an instruction to create empty pages. A route should be introduced only when it has real content and a migration rule.

## Homepage Narrative

The homepage should answer one question per section.

| Order | Visitor question | Homepage answer |
| --- | --- | --- |
| 1. Promise | What does RUDI help us do? | Build the capacity to guide AI. |
| 2. Organizational problem | Why is this larger than training or software? | AI is already entering work; leadership needs visibility, judgment, and ownership. |
| 3. Enablement system | What capacity must be built? | Leadership, learning, workflows, and governance. |
| 4. Ways to work together | What can we actually engage RUDI to do? | Align leadership, equip the workforce, or deploy responsible digital coworkers. |
| 5. Method | How does RUDI approach the work? | Understand the work. Decide AI's role. Design responsibly. |
| 6. Evidence | Has this been used in real settings? | Case studies across education, civic leadership, and enterprise operations. |
| 7. Current intelligence | Does RUDI stay current as AI changes? | RUDI Daily plus perspectives and field notes. |
| 8. Next move | What can I do now? | Use a resource, take the diagnostic, or start a conversation. |

## Content Collections

Astro should own presentation and derive shared surfaces from structured content.

| Collection | Required fields | Derived surfaces |
| --- | --- | --- |
| `daily` | title, date, summary, stories, categories, sources, slug, publication status | Edition, Daily archive, Insights index, RSS, sitemap |
| `perspectives` | title, description, publish date, author, topics, body, related content | Article, topic index, Insights index, RSS, sitemap |
| `field-notes` | title, context, observation date, topics, body, publication status | Note, Insights index, related content, RSS |
| `case-studies` | organization, sector, challenge, work, outcomes, publishability, body | Case page, case index, homepage proof |
| `resources` | title, audience, format, description, destination or body, status | Resource page, resource index, homepage entry points |

Automation may write validated Markdown or JSON into these collections. It must not generate navigation, footers, page chrome, SEO markup, archive pages, RSS, or sitemaps.

## URL Compatibility Invariants

1. Existing public URLs remain valid until an explicit redirect or compatibility output is verified.
2. Existing RUDI Daily `.html` links remain valid permanently.
3. A redirect is added only after its destination exists in the production output.
4. Redirects preserve query strings unless a documented exception requires otherwise.
5. `vercel.json`, the generated sitemap, canonical tags, and internal links must agree.
6. Preview routes remain `noindex` and outside the production output until approved.

### Initial Compatibility Map

| Existing URL | Future ownership | Migration treatment |
| --- | --- | --- |
| `/index.html` and `/` | Astro homepage | Preserve `/`; redirect `/index.html` only after launch verification |
| `/consulting.html` | Organizational AI Strategy & Enablement | Preserve, then redirect to `/ai-strategy-enablement/` |
| `/capabilities.html` | How RUDI Helps | Preserve until its unique material is incorporated |
| `/framework.html` | Methods | Preserve, then redirect to `/methods/` |
| `/ai-training.html` | Applied AI Learning | Preserve, then redirect to `/applied-ai-learning/` |
| `/ai-training/custom.html` | Custom applied learning | Preserve, then redirect to `/applied-ai-learning/custom/` |
| `/ai-training/live-workflow-clinic.html` | Applied AI Learning: Live AI Workflow Clinic | Preserve permanently or redirect only after campaign-link review |
| `/case-studies/*.html` | Case studies | Preserve old URLs as outputs or permanent redirects |
| `/insights/*.html` | Insights collections | Preserve all published article URLs, including Daily editions |
| `/survey.html` | Readiness diagnostic | Preserve until the resource route reproduces the complete flow |

## Migration Sequence

1. Approve the information architecture and homepage narrative.
2. Establish shared Astro site shell, metadata contract, and navigation.
3. Build the homepage and the three service-line routes as production-ready Astro pages.
4. Define and validate the content schemas before migrating Insights.
5. Convert RUDI Daily automation to emit editorial content only.
6. Generate archive, RSS, sitemap, and related-content surfaces from collections.
7. Migrate methods, case studies, resources, About, and offer pages incrementally.
8. Switch the Vercel output only after route parity, redirect tests, accessibility checks, and a rollback plan pass.

## Decision Record for This Preview

- The new homepage is previewed at `/home-preview/`.
- The current production homepage remains `public/index.html`.
- The preview uses only existing destinations and in-page anchors.
- The preview is intentionally `noindex` through the shared Astro preview layout.
- No hosting or production configuration changes are part of this step.
