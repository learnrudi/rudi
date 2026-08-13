# RUDI - Responsible Use of Digital Intelligence

AI readiness and enablement for organizations preparing to adopt and implement AI responsibly. Static website deployed on Vercel.

**Live Site:** [learnrudi.com](https://learnrudi.com)

## Overview

RUDI helps organizations move across a connected transformation continuum:

- **AI Readiness** - Establish the organizational baseline and identify what should happen next
- **AI Strategy** - Decide where AI should create value and what deserves priority
- **AI Enablement** - Build workforce, leadership, workflow, governance, and technical capability
- **AI Adoption** - Turn capability into sustained behavior and changed workflows
- **AI Implementation** - Put selected tools, agents, integrations, and operating processes into production

Human-centered, responsible, and governed AI are principles spanning the full continuum. Greater Cincinnati is RUDI's beachhead market; the service market remains national.

## Pages

| Page | Description |
|------|-------------|
| `public/index.html` | Homepage |
| `public/how-we-help/` | Readiness-to-implementation service architecture |
| `public/how-we-help/ai-readiness/assessment/` | Primary commercial AI Readiness Assessment offer |
| `public/how-we-help/ai-enablement/workforce-programs/` | Workforce programs and training beneath Enablement |
| `public/approach/` | How RUDI works, including human-centered and responsible AI |
| `public/greater-cincinnati/` | Greater Cincinnati regional authority hub |
| `public/greater-cincinnati/ai-readiness-index/` | Canonical home of the developing regional index |
| `public/start-here/` | Readiness conversation funnel |
| `public/case-studies/` | Outcome- and scope-focused evidence |
| `public/insights/` | RUDI Research, guides, perspectives, and RUDI Daily |
| `public/about.html#founder` | Founder profile and selected experience |
| `public/about.html#partners` | Selected experience and collaborator overview |
| `public/framework.html` | Legacy but still unique competency and responsible-use framework |
| `public/survey.html` | Anonymous organization survey retained pending owner confirmation |
| `public/ohio.html` | Ohio workforce readiness and current TechCred guidance |
| `public/about.html` | About RUDI |

## Tech Stack

- Static HTML/CSS/JavaScript
- IBM Plex Sans typography
- Tally.so for form handling
- Vercel for hosting

## Local Development

```bash
# Validate public layout
npm run build

# Serve the public site
npm start
```

Visit `http://localhost:8080`

## Deployment

Auto-deploys to Vercel on push to main branch.

```bash
# Manual deploy
vercel --prod
```

## Project Structure

```
apps/public-sites/learnrudi/
├── public/                 # Deployable website root
│   ├── index.html          # Homepage
│   ├── about.html          # Company, founder, and partners
│   ├── framework.html      # Legacy but still unique competency framework
│   ├── survey.html         # Anonymous survey retained pending owner review
│   ├── approach/
│   ├── how-we-help/
│   ├── greater-cincinnati/
│   ├── start-here/
│   ├── case-studies/
│   ├── insights/
│   ├── webinars/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── assets/
├── internal/               # Not deployed as public website content
│   ├── config/             # Internal SEO/reference config
│   ├── archive/            # Deprecated pages and historical material
│   ├── docs/               # Project, setup, SEO, and survey docs
│   ├── scripts/            # Google Sheets and maintenance scripts
│   ├── tests/              # Local smoke tests
│   └── tools/              # Internal QR/certificate utilities
├── package.json
├── vercel.json             # Vercel deploys public/
└── README.md
```

## AI Readiness Assessment

The organizational AI Readiness Assessment is RUDI's primary commercial entry point. It evaluates leadership, people, workflows, technology, data, culture, governance, and operating capacity, then turns the findings into a prioritized roadmap. The separate readiness-conversation form is handled by Formspree.

The older `framework.html` page remains because its competency matrix and responsible-use model are not yet fully represented elsewhere. The standalone `survey.html` page still contains a configured Google Sheets submission path, although no current public page links to it and older survey documentation describes an admin/link-generation flow that is no longer deployed. Do not retire the survey until its owner confirms it is inactive and any retained data/workflow obligations are resolved.

## Retired URLs

Legacy Training, Consulting, Capabilities, Contact, Camp Claude, founder, partner, and custom-training pages are represented only by direct permanent redirects in `vercel.json`. Internal links must point at their canonical destinations rather than relying on redirects; `npm run build` enforces the retired-file, redirect, sitemap, link, and anchor rules.

## Cleanup Audits

- `internal/docs/PUBLIC-MEDIA-CLEANUP-MANIFEST-2026-08-13.md` is the review-only orphan-media manifest. No listed media should be deleted without explicit approval.
- Run `node internal/scripts/audit-public-media.mjs` to reproduce the media reference audit.
- Run `node internal/scripts/crawl-public.mjs http://127.0.0.1:8080/` while `npm start` is running to crawl every public HTML route and discovered local asset.
- Python bytecode under `internal/scripts/__pycache__/` is disposable, but cache removal is a separate approval gate.

## SEO & Discoverability

All pages include:
- Meta descriptions and keywords
- Open Graph tags for social sharing
- Twitter Card meta tags
- Schema.org structured data (JSON-LD)
- Canonical URLs

## License

MIT

## Contact

**RUDI** - Responsible Use of Digital Intelligence
Website: [learnrudi.com](https://learnrudi.com)
