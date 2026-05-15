# RUDI - Responsible Use of Digital Intelligence

AI readiness training, consulting, and tools for organizations. Static website deployed on Vercel.

**Live Site:** [learnrudi.com](https://learnrudi.com)

## Overview

RUDI helps organizations build AI competency through:

- **Training** - Applied AI training across three maturity levels: Ambient AI, Chat Interfaces, and Agent Workflows
- **Consulting** - Strategic AI consulting through a 4-phase engagement process
- **Framework** - Comprehensive AI readiness assessment and competency framework
- **Studio** - Free, open-source AI workspace for learning and productivity

## Pages

| Page | Description |
|------|-------------|
| `public/index.html` | Homepage |
| `public/training.html` | AI training programs and workshops |
| `public/camp-claude.html` | Camp Claude resource hub and cohort landing page |
| `public/consulting.html` | AI consulting and advisory services |
| `public/studio.html` | RUDI Studio - AI workspace application |
| `public/framework.html` | AI Readiness Framework and assessment generator |
| `public/assessment.html` | Anonymous AI readiness assessment (9 questions) |
| `public/get-certificate.html` | Certificate verification |
| `public/certificates-business.html` | Business certificate page |
| `public/certificates-education.html` | Education certificate page |
| `public/ohio.html` | Ohio TechCred partnership information |
| `public/about.html` | About RUDI |
| `public/contact.html` | Contact form |
| `public/partners.html` | Partner organizations |

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
apps/learnrudi/
├── public/                 # Deployable website root
│   ├── index.html          # Homepage
│   ├── training.html       # Training programs
│   ├── camp-claude.html    # Camp Claude resource hub
│   ├── consulting.html     # Consulting services
│   ├── studio.html         # RUDI Studio app
│   ├── framework.html      # AI Readiness Framework
│   ├── assessment.html     # Assessment survey
│   ├── get-certificate.html
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

The assessment system allows organizations to:

1. Generate a custom assessment link with their organization name
2. Share the link with team members
3. Collect anonymous responses (only org name is tracked)
4. Optionally leave contact info for follow-up

Assessment data is collected via Tally.so forms.

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
