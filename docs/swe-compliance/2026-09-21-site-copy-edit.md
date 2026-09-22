# Website copy review

## Scope and exit criteria

User requested a site-wide synthetic-cadence-editor pass, specifically rejecting
“Readiness is a system, not a score.” Inventory all 130 public HTML documents;
read the service, approach, company, regional, resource, and evergreen article
copy; inspect dated Daily headlines and prose for the same pattern. Rewrite
unsupported aphorisms, abstract contrasts, and repetitive slogan structures.
Preserve factual claims, meaningful qualifications, client quotations, source
links, routes, forms, CSS, and application behavior. Keep metadata consistent.

Existing authorization to publish site updates continues to apply. Work begins
from origin/main 41dab517dadb0b6794a271af13353121b4fee03b on a clean feature
branch. Unrelated legal edits in the original canonical checkout remain there.

## Verification plan

This is an editorial change. No new tests that merely assert replacement wording
will be added, and red-green behavior testing is inapplicable. Run the existing
Node tests, static layout build, shared-shell check, and local route crawl.
Compare structural HTML attributes and linked sources against the base, review
metadata and the complete diff, then inspect representative desktop/mobile pages.
Bring the admin Mac to the accepted Git revision without touching runtime state.

## Results

- Inventoried 130 public HTML documents. Revised 39 documents, including five
  article visuals, across service, approach, company, regional, case-study,
  resource, and evergreen article pages. Dated Daily reporting and attributed
  participant quotations retain their wording. The dated archive was scanned
  for headline patterns; factual distinctions and attributed reporting were
  retained rather than treated as slogans.
- Replaced the readiness slogan with “What we assess before you invest in AI.”
  Updated related headings, body copy, internal article labels, social previews,
  and FAQ structured data. Added the durable public copy standard to the README.
- Removed misleading identical-output guarantees from the prompting and people
  leadership guides. OpenAI’s [prompt engineering documentation](https://developers.openai.com/api/docs/guides/prompt-engineering)
  explicitly describes generated content as nondeterministic. This is an
  editorial pass, not a new fact-check of every historical article or provider
  comparison.
- `npm test`: 48 passing. The first run found one assertion hardcoding the
  superseded homepage slogan. Removed that wording-only assertion; the same test
  still checks all approved entry links and the employee count. No behavior or
  functional assertions were removed.
- `npm run build`: passed. `python3 internal/scripts/site_shell.py --check`:
  zero drift. Local crawl: 141 HTML responses, 35 assets, 176 unique URLs.
- Structural comparison against the base confirms links, image attributes,
  element IDs, forms, executable scripts, and styles are unchanged. All edited
  JSON-LD parses successfully.
- Debt scan of the single edited test file: one file reported, zero findings.
- Browser review: readiness section verified at desktop and 390px widths;
  representative mobile pages checked for horizontal overflow. Release and peer
  verification will be recorded with the accepted commit.
