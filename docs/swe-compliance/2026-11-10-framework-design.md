# Framework page design review

Target: `https://learnrudi.com/framework.html`.
Base: `8ca38a6f3fffe9e1c1cf81688a21d1cb041477aa`, isolated branch
`codex/framework-design-20261110`. This continues the requested RUDI website
design update after the Pyramid publication. The stable page URL is retained.

## Scope and invariants

- Replace the page's legacy inline styles and boxed layout with a page-scoped
  stylesheet, an accessible SVG pyramid, readable section rows, and downloads.
- Use the current content-and-brand authority: IBM Plex Sans/Mono, Ink
  `#0F1115`, Paper Light `#FBF8F1`, Paper `#F2EDE3`, Paper Deep `#E6DFD0`,
  Node Teal `#1FB8A8` with Ink text, and Deep Teal `#177F74` for inline links.
- Retain four readiness stages, three competency dimensions, five proficiency
  levels, all 15 original competency descriptions, and responsible-use guidance.
- Preserve `#content` and `#contact-readiness`. Add a short contents navigation
  and a resource section linking the four existing public publications/PDFs.
- Keep the shared header, footer, navigation script, GA4 tag, Vercel Analytics,
  approved wordmark, and resource files intact. Remove obsolete page-only
  reveal animations and the superseded mobile-menu script.
- Update the README page description, resource map, and framework sitemap date. No dependencies,
  forms, services, global styles, routing configuration, or private records change.

## Verification

- `npm test`: 67 passed, zero failures.
- `npm run build`: skills catalog and static layout checks passed.
- `git diff --check`: passed.
- `site_shell.apply_shell(..., page_path='framework.html')` produces identical
  HTML. The shared shell and tracking snippet remain canonical.
- Source comparison confirms all 15 original competency descriptions survive.
  All 15 distinct links in the main content resolve to local resources or
  existing in-page IDs. IDs are unique.
- Browser review at 320, 390, 768, and 1280 pixels: no horizontal overflow;
  readable pyramid labels, competency rows, and responsive download links.
- Mobile Menu opens and closes. Section links land below the fixed header;
  page margins account for the shell's existing 96px scroll padding.
- Reduced-motion emulation produces `scroll-behavior: auto`. Emulation and
  viewport overrides were reset after review.
- All eight resource links have 44px-high targets at 320px. The page remains
  static HTML, and native disclosure navigation does not depend on the removed
  animation/menu code. No inquiry form was submitted during QA.
- Local analytics requests were blocked. The standalone design-preview export
  omits analytics and embeds the existing approved fonts and wordmark.

This is a static HTML/CSS presentation change. No new behavior-bearing JS/TS
was introduced, so no red-green unit-test cycle or JS/TS debt scan was added.
Existing integration tests and direct rendered checks cover this change.
Browser inspection is not a formal screen-reader or full accessibility audit.

## Design rulebook audit

### Scanner findings

`audit-ui-tells.mjs --fail-on strong` reports zero findings for both
`public/framework.html` and `public/css/rudi-framework.css`.

### Manual findings and laws review

The old stacked cards, decorative animation, and low-emphasis heading were
replaced by type hierarchy, rules, and a labeled diagram. A duplicate anchor
offset found during mobile review was corrected. No unresolved visual misses
were found in the reviewed widths. The primary hero action downloads the
Pyramid PDF; secondary navigation exposes the page's four sections.

### Kept on purpose

- The three-column groups reflect the framework's actual three dimensions and
  three models; they are content structure rather than decorative card trios.
- Mono labels identify stages, levels, and section numbers. The 3 × 5 = 15
  expression explains the competency model.
- Thin rules and alternating paper bands separate long sections. The original
  framework terms and proficiency descriptions remain recognizable.

## Release preflight

On November 10, 2026, both Vercel projects were rechecked before publication.
The live dashboard links both `rudi-web` and `learnrudi` to `learnrudi/rudi`;
CLI inspection confirms root `.` for both. Neither project has deploy hooks.
The accepted base and this branch retain `git.deploymentEnabled: false` for
all branches, including previews. The root configuration sets `framework:
null`, build `npm run build`, and output `public`, overriding the production
project's dashboard Next.js preset. No provider settings were changed.

`rudi-web` serves `learnrudi.com`. Its pre-release production deployment is
`dpl_6KoMTM6S5fc2XBiPvo4hjA9jnAnL`, available as a rollback target.
Release proceeds through GitHub review/CI, accepted main, a staged manual
production deployment, verification, and promotion to the existing domain.

Admin starts on clean tracked main at the base revision. Its unrelated untracked
`docs/digital-workforce-worker-card-mockup.html` and ignored machine-local state
must be preserved. The mockup SHA-256 is
`7d34d32fa47014f52bcb72ef83d96a5c20b2ac4b7ed50abf7e4fe4d5b242752c`.
Adopt the accepted revision by fast-forward, rerun tests/build, and verify the
revision and preserved file before completing the release.
