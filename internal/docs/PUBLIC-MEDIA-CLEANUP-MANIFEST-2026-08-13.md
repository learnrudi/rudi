# Public Media Cleanup Manifest - 2026-08-13

**Approval status:** review only. Do not delete these files without explicit user approval.

## Result

- Public media files scanned: 53
- Media files with verified references: 15
- Potentially orphaned candidates: 38
- Candidate size: 50,999,795 bytes (48.64 MiB / 51.00 MB)
- Tracked candidates: 38
- Untracked candidates: 0
- Public HTML pages scanned: 85
- Total reference surfaces scanned: 111

This independent result does not reproduce the earlier estimate of 33 candidates / 45.19 MB. The manifest reflects the post-consolidation tree and the current SEO metadata, which now uses the shared `og.png` rather than legacy page images.

## Verification method

Run `node internal/scripts/audit-public-media.mjs` from the repository root to reproduce the audit. The script inventories deployable image, video, audio, icon, SVG, and PDF files; resolves local media references from public HTML, CSS, JavaScript, XML, and JSON; checks internal SEO/config metadata and generator scripts; and records Git tracking status.

Evidence code `E0` means no reference to the path was found across the scanned surfaces. Every candidate below is tracked in Git and is therefore recoverable from repository history after a future approved deletion. The audit also records SHA-256 checksums in its JSON output for pre-deletion verification.

## Candidates

| Path | Exact bytes | Tracked / recoverable | Reference evidence |
| --- | ---: | --- | --- |
| `public/assets/images/rudi-ohio-qr-code.png` | 3,700 | Yes / Git history | E0 |
| `public/assets/images/rudi-qr-code.png` | 2,018 | Yes / Git history | E0 |
| `public/assets/rudi-qr-code.png` | 4,240 | Yes / Git history | E0 |
| `public/images/Abstract Geometric Texture from Midjourney.png` | 1,438,541 | Yes / Git history | E0 |
| `public/images/Abstract Geometric Visualization (1).png` | 1,030,579 | Yes / Git history | E0 |
| `public/images/Abstract Geometric Visualization.png` | 1,167,589 | Yes / Git history | E0 |
| `public/images/Ascending Steps Growth Curve Visualization.png` | 1,141,827 | Yes / Git history | E0 |
| `public/images/Diverse Business Team in Office (1).png` | 1,268,363 | Yes / Git history | E0 |
| `public/images/Diverse Business Team in Office (2).png` | 1,301,112 | Yes / Git history | E0 |
| `public/images/Diverse Business Team in Office (3).png` | 1,321,874 | Yes / Git history | E0 |
| `public/images/Diverse Business Team in Office.png` | 1,302,589 | Yes / Git history | E0 |
| `public/images/RUDI-AI-Readiness-Pyrmid.png` | 351,678 | Yes / Git history | E0 |
| `public/images/about-hero.png` | 1,561,119 | Yes / Git history | E0 |
| `public/images/abstract-circular-flow.png` | 679,545 | Yes / Git history | E0 |
| `public/images/ai-certification-levels.png` | 907,308 | Yes / Git history | E0 |
| `public/images/brandon-hoff-afrotech.jpg` | 3,556,904 | Yes / Git history | E0 |
| `public/images/brandon-z-hoff-headshot.jpg` | 211,521 | Yes / Git history | E0 |
| `public/images/brandonzhoff.png` | 3,684,727 | Yes / Git history | E0 |
| `public/images/consulting-hero.jpg` | 211,136 | Yes / Git history | E0 |
| `public/images/consulting-hero.png` | 1,240,905 | Yes / Git history | E0 |
| `public/images/framework-visualization.png` | 614,853 | Yes / Git history | E0 |
| `public/images/hero-orb-pingpong.mp4` | 1,986,420 | Yes / Git history | E0 |
| `public/images/hero-orb.gif` | 4,013,626 | Yes / Git history | E0 |
| `public/images/hero-orb.mp4` | 4,003,015 | Yes / Git history | E0 |
| `public/images/homepage-hero.jpg` | 172,265 | Yes / Git history | E0 |
| `public/images/mercantile-library.jpg` | 449,570 | Yes / Git history | E0 |
| `public/images/network-connections-visualization.png` | 1,285,006 | Yes / Git history | E0 |
| `public/images/rudi-framework-QR-Code.png` | 24,698 | Yes / Git history | E0 |
| `public/images/rudi-qr-code (4).png` | 4,248 | Yes / Git history | E0 |
| `public/images/rudi-qr-code.png` | 3,980 | Yes / Git history | E0 |
| `public/images/rudi-tiktok-app-icon.png` | 18,065 | Yes / Git history | E0 |
| `public/images/studio-demo.mp4` | 7,962,663 | Yes / Git history | E0 |
| `public/images/training-hero.jpg` | 296,028 | Yes / Git history | E0 |
| `public/images/training-hero.png` | 1,339,292 | Yes / Git history | E0 |
| `public/images/uli-cincinnati-agent-screen.png` | 2,333,275 | Yes / Git history | E0 |
| `public/images/uli-cincinnati-workshop-room.png` | 2,356,185 | Yes / Git history | E0 |
| `public/images/warren-county-esc.jpg` | 284,989 | Yes / Git history | E0 |
| `public/insights/assets/rudi-daily-thumbnail-v1.png` | 1,464,342 | Yes / Git history | E0 |

## Explicit exclusions

The audit found current references for 15 media files and excluded them from deletion candidates. These include the shared `public/og.png`; the linked `public/founder-profile.pdf`; its two generator inputs (`brandon-headshot.png` and `afrotech-2025.jpg`); the retained framework, Ohio, Codex, Live Workflow Clinic, and original-insight media; and current Ohio partner logos. Review the audit script's `referencedMedia` output for exact file-and-line evidence.

## Approval gate

If deletion is approved later, rerun the audit immediately before removal, compare checksums and totals, delete only the approved paths, then rerun the complete build, local crawl, sitemap/redirect checks, and deployment-size measurement.
