# Clean Project Structure

The production organization is intentionally simple: vanilla site files live in `public/`; non-public project material lives in `internal/`.

## Current Layout

```text
rudi-web/
├── public/                 # Vercel output directory and public website root
│   ├── *.html              # Top-level pages
│   ├── case-studies/       # Public case-study pages
│   ├── insights/           # Public insight pages
│   ├── webinars/           # Public webinar pages
│   ├── css/                # Shared styles
│   ├── js/                 # Shared vanilla JavaScript
│   ├── images/             # Public media
│   └── assets/             # Public supporting assets
│
├── internal/               # Not intended for direct website access
│   ├── config/
│   ├── archive/
│   ├── docs/
│   ├── scripts/
│   ├── tests/
│   └── tools/
│
├── package.json
├── vercel.json
└── README.md
```

## Rules

- Public visitor-facing files go in `public/`.
- Setup docs, planning docs, historical drafts, and maintenance utilities go in `internal/`.
- Keep public URLs stable by preserving paths inside `public/`.
- Run `npm run build` before deployment.
