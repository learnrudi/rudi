# AI Readiness Pyramid brand revision

Status: design approved; publication to the existing URL authorized November 10, 2026.
Release proceeds through GitHub review and CI, then a manual production deployment.
Base: origin/main 155cffb, isolated worktree codex/pyramid-brand-20261110.

## Scope

- Rebuild the existing Pyramid as a one-page publication using the same
  paper/ink/teal visual system as the RESPECT and AI Literacy Matrix PDFs.
- Preserve the four stages, their order, the source explanations, and the
  conceptual/operational/governance literacy dimensions.
- Keep the existing public image path, including its historical `Pyrmid`
  spelling, so the link already emailed to William remains valid on release.
- Add a Letter-size PDF companion. Add the Pyramid to the existing Insights guides listing and document the public
  resource locations. No application behavior or shared navigation changes.

## Files

- Editable, standalone HTML: `internal/docs/brand/ai-readiness-pyramid.html`.
- Existing image replacement: `public/images/RUDI-AI-Readiness-Pyrmid.png`.
- PDF companion: `public/assets/documents/ai-readiness-pyramid.pdf`.

The HTML embeds IBM Plex fonts and the unchanged approved horizontal full-name
SVG master. Master SHA-256:
`65bb6c71437a6327d10d3e622f8109d45482fcb0d436d2621a88624a6583e2b6`.
Authority: Admin content-and-brand/BRAND.md and brand-assets/README.md,
read through /Volumes/RUDI/business/content-and-brand on November 10, 2026.

## Rebuild

Use the RUDI web-export `html_to_png_pdf` tool with the HTML source above:
`mode: artboard`, `artboard_size: letter`, `page_selector: .page`,
`viewport_width: 816`, `viewport_height: 1056`, `scale: 3`, `dpi: 288`.
Use the full viewport height; the default 720-pixel viewport clips PNG output.
Inspect the PDF with Poppler after export. Preserve the existing public image
filename when copying the accepted PNG to its serving location.

## Verification

- One PDF page, US Letter (612 x 792 points).
- PNG: 2448 x 3168 pixels; Paper Light #FBF8F1 canvas.
- Full-page PDF render inspected; all four tiers and all explanations visible.
- Required source phrases and stage names verified from PDF extraction.
- No text outside the page. Embedded font families are IBM Plex Sans and Mono.
- Actual Ink text contrast: Paper Light 17.82:1, Paper 16.20:1,
  Paper Deep 14.24:1, Node Teal 7.63:1. Tiers have direct numeric labels and
  Ink outlines where the paper/teal fills need a clear boundary.
- Logo matches the approved master byte-for-byte inside the editable source.
- No JS/TS changes. No behavior-bearing code; red-green tests do not apply to
  this static asset/layout revision. Repository checks cover integration.
- `npm run build`: passed. `npm test`: all 67 tests passed.
- `git diff --check`: passed. Final PDF and PNG visually inspected in full.

## Release preflight, November 10, 2026

Both live Vercel projects were inspected in the dashboard and CLI before push.
Both connect to `learnrudi/rudi` at root `.`. `rudi-web` serves `learnrudi.com`;
its dashboard Next.js preset is overridden by the root `vercel.json` static
configuration (`framework: null`, build `npm run build`, output `public`).
`learnrudi` uses Other, build `npm run build`, output `public`. Both dashboard
Ignored Build Step controls are Automatic, with no deploy hooks configured.
Current main and this unchanged branch configuration set
`git.deploymentEnabled: false` for all branches, including previews, as defined
by [Vercel's Git configuration](https://vercel.com/docs/project-configuration/git-configuration).
This resolves the publication preflight for this release. No provider settings
were changed. The previous production deployment is
`dpl_GFLuhA2ai4hrx6PVn5yc96Zan3RX` for rollback if needed.

The approved PNG SHA-256 is
`e7673b3d9692004ddf8a5635b52fd657cc117afc0400b4b8748d8277fa805880`;
the PDF SHA-256 is
`8876d88a5efc88106a14b9488f21532c2dad6c9b5daaec21dddc9f0c4931acae`.
Verify these bytes at the existing image URL and new PDF URL after release.
Admin adoption preserves its unrelated untracked document and machine-local
ignored state. Updating the image requires no additional email to William.
