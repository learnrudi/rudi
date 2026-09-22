# Homepage digital worker workflow

The homepage replaces the founder stage photograph with the approved branching workflow. The root uses the canonical RUDI monogram and “Digital worker / Managed by RUDI”; no AI provider is prescribed. The example gathers context from Drive, Gmail and Sheets, drafts in Docs, pauses for human review and shares in Slack. It is labeled as an example and does not report live worker activity.

## Scope and ownership

- `public/index.html`: hero markup and links to its stylesheet and deferred script. Header, footer and primary conversion copy are unchanged.
- `public/css/rudi-workflow-hero.css`: white canvas, responsive node positions and connectors.
- `public/js/rudi-workflow-hero.js`: illustrative playback and accessible controls; no API calls, persistence or new dependencies.
- `public/images/workflow/`: five approved prototype assets copied without modification.
- `internal/tests/workflow-hero.test.mjs`: playback and suspension behavior.

## Rendering contract

The static HTML/CSS and eight SVG paths must remain readable without JavaScript. Node positions and paths share a 604px vertical grid. Branch centers are at one-sixth, one-half and five-sixths of the available width. The script animates the existing paths and does not position content.

Playback follows a 22-second illustrative cycle. Human review precedes sharing. Pause releases the animation frame; offscreen and hidden-tab suspension preserve elapsed time and explicit user pause. Reduced motion starts with a still review stage. Visitors may explicitly play or replay it. Screen readers receive a complete workflow description, with live announcements only for playback controls.

## Asset provenance

Copied from the user-selected RUDI software logo collection, `business/research-and-intelligence/claude-connectors/logos/final/`. These are the same assets used in the approved prototype. Google SVGs are the existing monochrome Simple Icons assets; Slack uses the existing color PNG. The RUDI mark is already published at `/brand/rudi-mark.svg`. Vendor names identify example tools, not endorsements.

| Asset | SHA-256 |
|---|---|
| `google-drive.svg` | `7e678aba9e463140ec8603f0e6cc78bb80f6caf9cd3ee73335026a90729a1a40` |
| `gmail.svg` | `a537f5d85d9a27efa3a5d6086e8df6072ee93f76b4d176639a5e483f74b74b9f` |
| `google-sheets.svg` | `5f28308c62e37d7d5533f52bbff5b48dc8630189d1c9d9dcbd8d7821f50d877f` |
| `google-docs.svg` | `880b39680b64812e5203f366c08779e86c824e3a6264a8eefca2a56afbf79fa6` |
| `slack.png` | `d4feca88cc5065c204fa68df2a7c517d367ca459ae96dac58e652d8ec5d91faa` |

## Verification — 2026-09-21

- Red/green command: `node --test internal/tests/workflow-hero.test.mjs`. Initial implementation was absent; review/pause then passed. Added reduced-motion and visibility tests each failed before their corresponding behavior was implemented, then passed. The focused suite passes all three tests.
- `npm test`: 51 passing tests; `npm run build`: passed.
- `python3 internal/scripts/site_shell.py --check`: zero drift.
- `node internal/scripts/crawl-public.mjs http://127.0.0.1:8088/`: 141 HTML and 43 asset responses passed.
- Packaged SWE debt scans of the script and test: zero findings with their explicit browser/test entrypoints. The first script scan reported an orphan because it does not infer the HTML script tag; verified homepage wiring and reran with the real entrypoint.
- Browser checks: desktop 1181px, mobile 390px and 320px; no horizontal overflow or node text clipping. All six logos loaded. Keyboard Enter paused playback and retained focus. Reduced-motion mode showed the still review stage. Disabled JavaScript left seven nodes and eight connectors readable, with playback controls hidden. Browser settings restored after testing.
- Review: scope, SVG safety, assets, failure fallback, animation lifecycle, keyboard controls and source diff reviewed. No external input or worker execution is introduced.
- Known gap: layout checked in the desktop app browser; no separate Safari/Firefox run. The test uses a DOM/clock harness; actual SVG geometry was checked in the browser.
