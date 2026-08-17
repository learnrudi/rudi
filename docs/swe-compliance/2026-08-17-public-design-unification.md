# Public design unification checklist

Date: 2026-08-17

Status: Git publication approved; PR review pending

## Scope

- Keep current architecture pages on `rudi-2026.css`.
- Give legacy public pages one shared RUDI compatibility stylesheet.
- Replace the retired clay palette in deployable HTML.
- Remove decorative left and right border declarations from deployable styles.
- Use `rudi@learnrudi.com` for every public email link.
- Update the RUDI Daily renderer so future generated editions inherit the same contract.
- Preserve page content, article graphics, URLs, and forms.
- Do not deploy, commit, or push without explicit approval.

## Acceptance checks

- [x] Red: the public design contract fails on unbridged legacy pages.
- [x] Green: every dynamically discovered public HTML page loads an approved RUDI design layer.
- [x] Green: publishing another RUDI Daily does not require updating a fixed page count.
- [x] Green: no deployable HTML contains the retired clay palette.
- [x] Green: no deployable HTML or shared CSS contains decorative side-border declarations.
- [x] Green: every public `mailto:` link uses `rudi@learnrudi.com`.
- [x] Green: navigation and footer identity say RUDI LLC and include Start Here.
- [x] Green: the Daily generator emits the shared stylesheet, shell script, LLC footer, and admin email.
- [x] Green: the Daily pre-write verifier rejects retired clay colors and side borders.
- [x] Green: the static build and local crawler pass.
- [x] Green: edited JavaScript passes the local debt scan.

## Known boundary

Legacy articles, daily news pages, and standalone visuals retain their content-specific layouts. The compatibility layer standardizes their palette, typography, navigation, calls to action, canvas, and footer without converting each artifact into the current component architecture.

Deployment and PR merging remain separate approval gates.
