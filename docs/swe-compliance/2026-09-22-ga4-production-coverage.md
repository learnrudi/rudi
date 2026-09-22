# GA4 production-page coverage

## Outcome and scope

GA4 `G-1WX561P8EV` is generated once in the head of all 131 current visitor
pages: 128 sitemap pages plus privacy, terms, and inquiry thanks. The anonymous
survey and embedded chart payloads are excluded. Future Daily editions already
call the shared shell and inherit the same tag.

Implementation base: `8cc0ed0d03c8348c84006221b8052c806757d1ca` (GitHub main).
Its sitemap matched production during discovery. The earlier 90-page attempt
was on an older branch missing 83 main commits and is not the release baseline.
The original 93 dirty paths remain untouched.

## Implementation and invariants

- `site_shell.py` owns tag generation; it rejects conflicting, duplicate,
  misplaced, malformed, or excluded-page tracking. Repeated generation is stable.
- `analytics-coverage.mjs` independently checks emitted markup. The existing
  `check-public-layout.mjs` invokes it for every public HTML file during the
  Vercel build, including pages not listed in the sitemap.
- Generator and coverage tests verify exclusions, duplicates, malformed scripts,
  exact measurement IDs, initialization, and content preservation.
- Page regeneration changed only the analytics snippet. Privacy additionally
  discloses GA4 cookies and identifiers; its current date and other disclosures
  remain intact. URLs, sitemap, retired-page redirects, and article content are
  unchanged. No dependency, DNS, or custom conversion-event changes.
- Local and preview copies contain the same tag. Offline checks below do not
  send analytics. Browser previews must block Google requests to avoid test traffic.

## Proof

Red/green: `python3 -m unittest discover -s internal/scripts -p test_site_shell.py`
first failed on missing GA4, then on survey/conflict/malformed-input behavior.
`node --test internal/tests/analytics-coverage.test.mjs` first failed on missing
tracking and then on invalid/forbidden tracking. All passed after implementation.
The actual `npm run build` rejected all 131 untagged pages before regeneration
and passed afterward. Separate reversible mutation checks confirmed that the
real build rejects a missing tag, a duplicate tag, and tracking on the survey.

Verified on primary and admin Macs using isolated worktrees at the same base:

```sh
npm run build
npm test
python3 -m unittest discover -s internal/scripts -p 'test_*.py'
python3 internal/scripts/site_shell.py --check
git diff --check
```

Results: 57 JavaScript tests, 25 Python tests, zero shell drift, successful build.
All 138 implementation/output files matched SHA-256 across the two worktrees.
The admin canonical checkout and its untracked mockup were preserved.

Additional primary-Mac checks: local crawl passed 201 URLs (146 HTML responses,
55 asset responses). Offline execution of all 131 actual page bootstrap scripts
queued exactly one initialization and one configuration for the expected ID.
The scoped JS/TS debt scan examined all three edited/new JS files with heuristics
enabled and returned zero findings. Review caught and fixed whitespace inside
the measurement ID and unclosed tracking-script validation gaps.

## Release boundary

No commit, push, pull request, merge, deployment, or production activation is
included in this implementation checkpoint. Publishing requires separate approval.
Before release, recheck current main and incorporate intervening site/Daily work
without replacing newer content. After the approved release, reconcile canonical
peer checkouts through Git, crawl every live eligible route and legacy redirect,
verify the survey remains untagged, and confirm an actual page view reaches GA4
Realtime/DebugView. Local checks and a tag in source do not prove live collection.
