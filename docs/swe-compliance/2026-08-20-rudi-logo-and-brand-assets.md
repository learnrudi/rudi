# RUDI Logo and Public Brand Assets — SWE Compliance Checklist

Date: 2026-08-20

Status: implementation, local verification, user visual approval, and production deployment complete; Git publication pending

## Scope and risk

- [x] Risk: medium. This changes public identity assets and metadata across a static site, but does not change application behavior, payments, authentication, or deployment configuration.
- [x] In scope: create an original retro-futurist RUDI logo system using the approved Indigo/Teal-led palette.
- [x] In scope: establish a canonical brand-asset source of truth and explicitly retire the unused clay-era image set.
- [x] In scope: provide square and horizontal SVG/PNG assets suitable for the website and advertiser-account onboarding.
- [x] In scope: add favicon declarations to every published HTML page and the daily-edition generator.
- [x] In scope: wire an absolute logo URL into homepage organization schema and repair the broken logo URL in `prompting.html`.
- [x] Expected source files: `docs/brand/README.md`, `public/brand/rudi-mark.svg`, `public/brand/rudi-wordmark.svg`, `public/favicon.svg`, `public/index.html`, `public/prompting.html`, `internal/scripts/build_daily_edition.py`, `internal/tests/rudi-brand-assets.test.mjs`, and this checklist.
- [x] Expected generated files: official concept crops `public/brand/rudi-mark-ai-1024.png` and `public/brand/rudi-wordmark-ai-2000.png`; delivery derivatives `public/brand/rudi-mark-512.png`, `public/brand/rudi-wordmark-1200.png`, `public/favicon-64.png`, and `public/apple-touch-icon.png`.
- [x] Expected mechanical edits: favicon declarations in every existing `public/**/*.html` file.
- [x] Non-goals: page-copy redesign, navigation redesign, CSS-system replacement, Git publication, or copying the Jetsons trademark/letterforms. Production deployment was later authorized separately.

## Brand contract

- [x] Exact name: `RUDI`.
- [x] Exact expansion: `Responsible Use of Digital Intelligence`.
- [x] Inspiration boundary: original atomic-age/Googie motion and optimism; no Jetsons characters, name, exact swash, exact letterforms, or copied composition.
- [x] Primary colors: RUDI Indigo `#4355D8`, Ink `#15151A`, Canvas `#F6F6F2`, and Teal `#1F7F79`.
- [x] Supporting colors remain Coral `#D95F49`, Gold `#D3A62C`, Violet `#7657C9`, and Magenta `#B95B91`; the logo uses supporting color sparingly.
- [x] The logo remains legible at favicon and advertiser-thumbnail sizes.

## Red-Green-Refactor

- [x] Red: `node --test internal/tests/rudi-brand-assets.test.mjs` first failed because the vector masters did not exist, then failed on the missing raster exports, page icon declarations, and canonical metadata URLs.
- [x] Green: implemented each asset and metadata contract without weakening the assertions; the targeted suite passes 5/5 tests.
- [x] Refactor verification: regenerated the refined horizontal raster, reran targeted tests, and confirmed the full suite and static-site build remain green.

## Verification

- [x] `node --test internal/tests/rudi-brand-assets.test.mjs` (5/5 tests passed).
- [x] `python3 internal/scripts/test_build_daily_edition.py` (4/4 tests passed). The package-style `python3 -m unittest ...` invocation is unsupported because the existing test imports its sibling module directly.
- [x] `npm test` (28/28 tests passed).
- [x] `npm run build` (`Static site layout check passed.`).
- [x] JS structural debt scan for `rudi-brand-assets.test.mjs` and `check-public-layout.mjs` with both package entry points declared (0 findings).
- [x] `git diff --check`.
- [x] Rendered and visually inspected the square mark, horizontal lockup, and 180 px touch icon.
- [x] Served the site locally and confirmed 200 responses and correct content types for the homepage, square SVG/PNG, horizontal PNG, and favicon.
- [x] Reviewed the final diff: all 95 HTML files have exactly one icon pair, 93 pages changed only by that pair, `index.html` adds organization logo metadata, `prompting.html` replaces its broken image URL, and no retired logo URL remains.

## Definition of done

- [x] RUDI has canonical, deterministic, current-palette logo assets in the repository.
- [x] A 512 px square PNG is ready to upload to the OpenAI advertiser account.
- [x] The public site consistently declares the favicon.
- [x] Organization/publisher schema references a real absolute logo URL.
- [x] Future RUDI Daily pages inherit the favicon automatically.
- [x] The old clay-era files are clearly documented as retired and cannot be mistaken for the active brand kit.
- [x] Local tests and static-site build pass; production deployment was separately authorized and verified. Git publication remains a separate gate.

## Handoff gates

- [x] User approved the generated visual direction and selected exact raster crops as the official masters.
- [ ] Git publication is separately authorized.
- [ ] Admin Mac synchronization is completed through normal Git history after publication approval, or explicitly reported as deferred.

## Visual refinement

After side-by-side review against the generated concept, the first deterministic interpretation was rejected as too heavy and blocky. A closer flat vector approximation was created, but the user selected the generated artwork itself as the visual master. The square mark and horizontal lockup were therefore cropped directly from the concept sheet, checked for clipping, and upscaled with deterministic Lanczos resampling and restrained sharpening. The concept's subtle gradient is now intentional. The flat SVGs remain utility approximations; official delivery PNGs derive from the exact raster crops.

## Deployment verification

- [x] Production deployment completed through the existing linked Vercel project on 2026-08-20.
- [x] `https://learnrudi.com/` returns `200 text/html` with the deployed favicon and organization-logo references.
- [x] `https://learnrudi.com/brand/rudi-mark-512.png` returns `200 image/png`, reports 512 × 512 dimensions, and its SHA-256 checksum matches the verified local delivery file.
- [x] `https://learnrudi.com/brand/rudi-wordmark-ai-2000.png` returns `200 image/png` and reports 2000 × 820 dimensions.
