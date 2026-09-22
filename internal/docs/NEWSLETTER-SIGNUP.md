# Newsletter signup

The free RUDI newsletter collects selected AI developments, highlights from the
public RUDI Daily archive, and practical workplace tips. It is a separate email
publication, not a subscription to every daily edition.

## Capture

- Tally form: `eqbdbx`, **The free RUDI newsletter**, in RUDI's existing account.
- Public form: https://tally.so/r/eqbdbx
- Email is required. The newsletter consent checkbox is required and unchecked
  by default. Tally stores the consent wording, email, and submission time.
- The website supplies `signup_source` (`popup` or `newsletter-page`) and
  `consent_version` (`2026-09-22`). These query values are attribution metadata,
  not proof of consent; the required checkbox records consent.
- Email block: `622dc7bc-a772-44f7-b0db-000000000003`.
- Consent block: `622dc7bc-a772-44f7-b0db-000000000004`.
- Hidden fields: `622dc7bc-a772-44f7-b0db-000000000008`.
- Form settings are Tally defaults: no self or respondent email notifications,
  no partial submissions; save-for-later is enabled. The privacy page discloses
  local draft storage. No email is sent when the form is submitted.

The popup and `/newsletter/` embed the same published form. A direct form link
remains available when scripts or third-party frames are blocked. After 12 seconds
without a trusted form-loaded event, the empty frame is hidden. A late successful
load restores it. The dedicated page eagerly loads its primary signup form;
invitation embeds load when the invitation is shown.

Only a submission event from `https://tally.so`, the embedded window, and this
form ID suppresses future invitations for 90 days. RUDI's script stores only the
suppression date and does not forward subscriber answers to analytics.

## Email delivery is still pending

This release collects subscribers. It does not configure a sending platform,
welcome emails, double opt-in, or an automated digest of RUDI Daily. Before sending
editions, connect an email platform with unsubscribe handling, deduplicate emails,
exclude test submissions, and honor requests received at rudi@learnrudi.com.
Do not treat inquiry-form leads or existing readiness submissions as subscribers.

## Verification — September 22, 2026

- A synthetic `.invalid` address was submitted through the actual popup. Tally
  read-back confirmed a completed submission with checkbox wording, popup source,
  and consent version. This is QA data, not a subscriber; exclude `.invalid`
  addresses from any later import. No marketing or test email was sent.
- Empty email/consent and malformed email were rejected by the provider UI.
- Chrome: desktop, 390px, and 320px layouts; keyboard moves from email to consent;
  confirmed signup suppresses a subsequent invitation. The small popup scrolls
  vertically without horizontal overflow.
- Codex's in-app browser blocked the third-party iframe; the compact direct-link
  fallback was verified. The public Tally form loads in that browser.
- Red/green: `node --test internal/tests/newsletter-signup.test.mjs` first failed
  for missing trusted-submission handling, then for missing timeout fallback;
  each passed after implementation. The tests reject wrong origins, windows,
  forms, malformed events, and unconfirmed submissions.
- Existing checks were updated to require the connected form and correct privacy
  revision date. Full Node tests, build, shared-shell checks, and local crawl pass.
- Debt scans of the changed public scripts, internal tests, and build checker
  report no findings.

Provider references: https://developers.tally.so/widgets/embeds and
https://developers.tally.so/widgets/events. Capture and field definitions were
verified against the authenticated Tally API, not inferred from the success UI.
