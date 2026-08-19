# RUDI Daily JSON Renderer

The automated renderer is an explicit-input path alongside the historical
`daily_content.py` path. A headless build must provide all of:

```bash
python3 internal/scripts/build_daily_edition.py \
  --date YYYY-MM-DD \
  --edition-status first \
  --bundle /absolute/rundown_bundle.json \
  --editorial-json /absolute/editorial_copy.json \
  --modified-date YYYY-MM-DD
```

The bundle must be `rudi-rundown-bundle-v1` with reconciled entries, sources,
citations, and counts. The editorial document must be
`rudi-editorial-copy-v1`; every link segment and Q&A source binding must resolve
to a literal source-title substring in that bundle. Plain text is HTML-escaped
by the renderer.

After the page verifies, `update_daily_catalog.py` updates the latest-edition
card on `/insights/`, inserts or updates the edition in the dedicated
`/insights/rudi-daily/` archive, updates the sitemap entry/lastmod, and repairs
adjacent daily navigation. `--archive` accepts an explicit absolute archive
HTML path and defaults to `public/insights/rudi-daily/index.html`; all file
inputs must be absolute regular files. `--check-only` reports every file that
would change without writing any file.

The two catalog pages expose narrow machine-owned regions. The main Insights
page uses `RUDI_DAILY_LATEST_START` / `RUDI_DAILY_LATEST_END`; the archive uses
the month-neutral `RUDI_DAILY_ARCHIVE_HEADING_MONTH_NEUTRAL` marker,
`RUDI_DAILY_ARCHIVE_START` / `RUDI_DAILY_ARCHIVE_END`, and one
`data-rudi-daily-date` per managed edition. The updater replaces only those
regions, retains seven featured archive cards, moves older managed dates into
the chronological link list, and is idempotent when a first edition is later
closed out. Only the newest rendered date can advance the main latest-edition
card, and the month-neutral archive heading remains accurate across month
boundaries.

Both scripts fail before writing on schema, date, identity, count, link,
layout, missing/ambiguous ownership marker, malformed archive entry, duplicate
date, or path mismatches. `npm run build` also validates that the catalog
ownership markers and attributes remain present, so a future site redesign
cannot silently remove the publication interface.

## Public design contract

The edition renderer owns the HTML shell for every newly generated Daily. It
must emit `/css/rudi-legacy.css` after its embedded edition styles and load
`/js/legacy-positioning.js` before the closing body tag. The pre-write verifier
also requires the RUDI LLC footer, the `rudi@learnrudi.com` admin link, the RUDI
indigo palette, and the absence of decorative left or right border rules. A
future template change that drops any of these requirements fails before the
edition is written or the catalog updater runs.

Run the contract and static-site checks with:

```bash
python3 -m unittest discover -s internal/scripts -p 'test_*.py' -v
npm run build
```
