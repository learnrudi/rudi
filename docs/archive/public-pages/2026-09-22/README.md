# Retired higher-education article graphics

These six HTML graphics were embedded in an earlier version of
`/insights/ai-adoption-higher-ed.html`. The September 22 article rewrite removed
those embeds and replaced the article with current design and revised guidance.
The graphics remained directly reachable despite having no public consumers.

Preserved here byte-for-byte from accepted main revision
`174224a06ad5500c5edf45335776ad02db6bf779`:

- adoption-curves-visual.html
- catch-22-visual.html
- deterministic-visual.html
- institutional-gap-visual.html
- investment-model-visual.html
- tool-vs-skill-visual.html

These are historical assets, not current public copy or reusable approved design.
The deployable `public/` directory excludes this archive. Exact permanent redirects
in `vercel.json` send each old `.html` URL and its extensionless equivalent to the
updated higher-education article. No wildcard reserves future visualization URLs.

Regression: `python3 -m unittest discover -s internal/tests -p 'test_legacy_visual_archive.py'`.
After deployment, verify the six original URLs return a permanent redirect and
the destination returns 200. Local static serving alone cannot prove Vercel routing.
