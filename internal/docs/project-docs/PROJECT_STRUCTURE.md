# RUDI Web Project Structure

RUDI Web is a vanilla static site. There is no Next.js, Vite, React, or runtime backend in this repository. Vercel deploys the `public/` directory as the website root.

## Directory Organization

```text
rudi-web/
├── public/                 # Deployable website root
│   ├── index.html
│   ├── training.html
│   ├── consulting.html
│   ├── studio.html
│   ├── framework.html
│   ├── assessment.html
│   ├── case-studies/
│   ├── insights/
│   ├── webinars/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── assets/
│
├── internal/               # Repository material that should not ship as website content
│   ├── config/             # Internal SEO/reference config
│   ├── archive/            # Deprecated pages and historical drafts
│   ├── docs/               # Planning, setup, SEO, and survey documentation
│   ├── scripts/            # Google Sheets and maintenance scripts
│   ├── tests/              # Local smoke tests
│   └── tools/              # Internal QR/certificate utilities
│
├── package.json            # Static-site scripts and maintenance dependencies
├── vercel.json             # Vercel deploy configuration
└── README.md
```

## Public Surface

Only files under `public/` should be reachable on `learnrudi.com`.

- Page URLs stay unchanged because `public/` is the deploy root.
- Relative links such as `training.html`, `images/...`, and `../css/styles.css` continue to resolve from the deployed root.
- Internal docs, scripts, archive pages, and utility tools stay in `internal/`.

## Validation

Run:

```bash
npm run build
```

The check verifies that required public files exist, internal folders are not present in `public/`, `.DS_Store` files are not in the deploy output, and local `href`/`src` references in public HTML resolve to existing files.

## Local Development

Run:

```bash
npm start
```

Then open `http://localhost:8080`.
