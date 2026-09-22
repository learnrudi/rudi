# RUDI brand assets

The September 2026 identity uses a lowercase rudi wordmark and a separate R
monogram. The approved vector masters are maintained in RUDI's internal brand
asset library. Their exact public copies in `public/brand/` are the source for
this website's delivery exports. The earlier combined R + wordmark and Indigo
generated-artwork direction are retired.

## Name and palette

Use **RUDI** in prose, **Responsible Use of Digital Intelligence** as the
descriptor, and **RUDI LLC** for legal identity. The logo itself is lowercase.

| Color | Hex | Use |
| --- | --- | --- |
| Paper White | `#FFFDF8` | Main page backgrounds |
| Ink | `#15181F` | Wordmark and text |
| Deep Teal | `#177F74` | Buttons, links and focus indicators |
| Node Teal | `#1FB8A8` | Small graphic accents |
| Light surface | `#FBF8F1` | Subtle secondary surfaces |

Keep the site bright. Do not restore the darker paper backgrounds `#F2EDE3`
or `#E6DFD0`. Node Teal is a graphic accent, not a body-text color.

## Serving assets

| File | Role |
| --- | --- |
| `public/brand/rudi-wordmark.svg` | Primary ink/teal vector wordmark |
| `public/brand/rudi-wordmark-paper.svg` | Light vector wordmark for dark artwork |
| `public/brand/rudi-mark.svg` | Separate vector monogram |
| `public/brand/rudi-wordmark-1200.png` | 1200 × 550 transparent wordmark |
| `public/brand/rudi-mark-512.png` | 512 × 512 square monogram export |
| `public/favicon.svg` | Vector browser icon |
| `public/favicon-64.png` | 64 × 64 browser icon |
| `public/apple-touch-icon.png` | 180 × 180 touch icon |
| `public/og.png` | 1200 × 630 sharing image |

Preserve proportions and clear space. Do not typeset substitutes, combine the
monogram with the wordmark, or add gradients, shadows or extra marks.

Regenerate delivery assets from the serving vectors with
`python3 internal/scripts/export_brand_assets.py`, then run
`node --test internal/tests/rudi-brand-assets.test.mjs`.
The exporter requires `rsvg-convert` (librsvg). It does not generate a new logo.

## Speaking assets

`speaking-assets.json` records original filenames, checksums and optimized
WebP derivatives for the approved AfroTech, Avanade and ULI event creatives.
Originals remain in the relevant client workspaces. Existing AfroTech and
Mercantile Library stage photography is reused from the public image library.
Private recordings and unclassified ULI photography are excluded.

Historical exploration documents and dated images elsewhere in `docs/` are
retained as history. This document and the current serving vectors define the
active website identity.
