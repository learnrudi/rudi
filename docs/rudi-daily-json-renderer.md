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

After the page verifies, `update_daily_catalog.py` updates or inserts the index
card, sitemap entry/lastmod, and adjacent daily navigation. It accepts only
absolute regular files and supports `--check-only`. Both scripts fail before
writing on schema, date, identity, count, link, or layout mismatches.

Run the contract and static-site checks with:

```bash
python3 -m unittest discover -s internal/scripts -p 'test_*.py' -v
npm run build
```
