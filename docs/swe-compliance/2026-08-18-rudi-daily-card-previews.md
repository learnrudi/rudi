# RUDI Daily Card Previews — SWE Compliance Checklist

Date: 2026-08-18

Status: implementation and local verification green; production release pending

Risk tier: Medium — user-visible archive content and an unattended publication contract change, followed by an authorized production deployment.

## Scope

- [x] Add a concise, source-derived preview to each of the seven featured RUDI Daily archive cards.
- [x] Reuse the rendered edition subtitle; do not generate new editorial copy in the site layer.
- [x] Preserve the latest-first archive, older chronological links, month rollover, and idempotent first/final publication behavior.
- [x] Fail closed on missing, ambiguous, empty, or overlong edition subtitles.
- [x] Add a build guard requiring exactly one non-empty preview paragraph per featured card.
- [x] Keep LinkedIn and Substack disabled; this change is site-only.

## Red / Green Evidence

- [x] Red: focused test import failed because `extract_edition_preview` did not exist.
- [x] Green: focused catalog suite passed after subtitle extraction and archive rendering were implemented.
- [x] Full Python suite: 15 passed; JavaScript suite: 24 passed.
- [x] Static layout build, Python compile, and `git diff --check` passed.
- [x] Real production archive source is backfilled with seven verified previews ranging from 199 to 281 characters.
- [x] A real-file `--check-only` rerun reported no changes, proving the backfill is idempotent.

## Release

- [ ] Commit and push an isolated branch.
- [ ] Open a production PR and wait for all registered checks.
- [ ] Merge only when checks and local verification are green.
- [ ] Read back the live archive and verify seven dated cards with non-empty previews.
- [ ] Confirm the Editorial `rudi-daily-status` command remains healthy with no recovery pending.
