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
| `index.html` | Homepage |
| `training.html` | AI training programs and workshops |
| `camp-claude.html` | Camp Claude resource hub and cohort landing page |
| `consulting.html` | AI consulting and advisory services |
| `studio.html` | RUDI Studio - AI workspace application |
| `framework.html` | AI Readiness Framework and assessment generator |
| `assessment.html` | Anonymous AI readiness assessment (9 questions) |
| `get-certificate.html` | Certificate verification |
| `ohio.html` | Ohio TechCred partnership information |
| `about.html` | About RUDI |
| `contact.html` | Contact form |
| `partners.html` | Partner organizations |

## Tech Stack

- Static HTML/CSS/JavaScript
- IBM Plex Sans typography
- Tally.so for form handling
- Vercel for hosting

## Local Development

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx http-server -p 8080
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
rudi/
├── index.html              # Homepage
├── training.html           # Training programs
├── camp-claude.html        # Camp Claude resource and cohort landing page
├── consulting.html         # Consulting services
├── studio.html             # RUDI Studio app
├── framework.html          # AI Readiness Framework
├── assessment.html         # Assessment survey
├── get-certificate.html    # Certificate verification
├── about.html              # About page
├── contact.html            # Contact form
├── ohio.html               # Ohio TechCred info
├── partners.html           # Partners
├── images/                 # Site images and media
│   ├── hero-orb.mp4
│   ├── framework-pyramid.png
│   ├── training-hero.png
│   └── ...
├── archive/                # Deprecated pages
└── test-form.js            # Playwright test
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
