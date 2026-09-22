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
to a literal source-title substring among the bundle's accepted editorial
evidence roles: `news_story`, `tool_or_product`, `research_paper`, or
`social_post`. Sources with other roles remain in the visible catalog, source
counts, citations, and structured data, but they cannot make an otherwise
unique editorial binding ambiguous. A binding that matches zero or more than
one accepted editorial source fails before any page write. Plain text is
HTML-escaped by the renderer.

After the page verifies, `update_daily_catalog.py` updates the latest-edition
feature on `/insights/`, inserts or updates the edition in the dedicated
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
regions, retains seven featured edition rows, and gives every featured row a
bounded, HTML-escaped preview derived from that edition's single verified
`p.subtitle`; the mechanical trailing story-count sentence is omitted. Older
managed dates move into the chronological month groups with native disclosures. The
update remains idempotent when a first edition is later closed out. Only the
newest rendered date can advance the main latest-edition feature, and the
month-neutral archive heading remains accurate across month boundaries.

Both scripts fail before writing on schema, date, identity, count, link,
layout, missing/ambiguous ownership marker, malformed archive entry, duplicate
date, or path mismatches. `npm run build` also validates that the catalog
ownership markers and attributes remain present. It also requires one non-empty
`data-rudi-daily-preview` paragraph on every featured archive row, so a future
site redesign cannot silently remove the publication interface or reduce the
archive to title-only entries.

## Public design contract

The edition renderer passes each new page through `site_shell.apply_shell`.
`internal/scripts/site_shell.py` owns the shared static header and footer used
throughout the website. It emits four navigation groups, a native mobile menu,
the current wordmark, `/css/rudi-chrome.css` and `/js/site-navigation.js`.
`/css/rudi-legacy.css` follows the embedded edition styles to keep the article
on the bright Paper White / Ink / Teal system. The old runtime positioning
script is no longer loaded.

The pre-write verifier requires this shared shell, the RUDI LLC footer,
`rudi@learnrudi.com`, and the absence of decorative left or right border rules.
Historical article content and catalog ownership markers are preserved when
refreshing the shell; a design refresh must not regenerate dated editorials.

Run the contract and static-site checks with:

```bash
python3 -m unittest discover -s internal/scripts -p 'test_*.py' -v
npm run build
```

The newsletter promotion describes a free RUDI newsletter. Until an email provider
is connected, its destination explicitly states that email signup is coming soon.
No form collects addresses and no paid newsletter or Substack signup is advertised.
