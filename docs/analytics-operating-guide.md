# Website analytics operating guide

Use the Learn RUDI Website GA4 property and stream `G-1WX561P8EV`.
The website installation is the source of truth for successful form outcomes;
GA4 holds key-event definitions and reporting configuration.

## Business outcomes

| Event | Success condition | Counting |
| --- | --- | --- |
| `generate_lead` | Formspree accepts the inquiry request | Once per accepted submission |
| `newsletter_signup` | The embedded Tally newsletter form confirms submission from its validated origin, frame, and form ID | Duplicate messages for the same submission are ignored within the page |

Mark both events as key events, once per event, with no invented monetary value.
Never derive these outcomes from a button click, iframe load, attempted form
submit, or an unguarded thank-you-page view. Never send form contents, email
addresses, names, or provider submission IDs as analytics parameters.

The newsletter's external fallback link opens Tally outside the website. Its
completed signups are recorded by the provider but are not included in the
website's confirmed-signup event. Reconcile provider totals separately. A
browser that blocks analytics can still submit either form successfully.

## Reports and weekly review

Use a RUDI Website collection with traffic acquisition, landing pages, content
performance, inquiry outcomes, and newsletter outcomes. Use an inquiry funnel
to inspect the path from the inquiry page through form start to confirmed lead.
Review production hostname traffic separately from previews and QA traffic.

Once a week, compare the last 28 complete days with the previous 28 days:

1. Check sessions, engaged sessions, confirmed inquiries, confirmed newsletter
   signups, and the key-event rate for each outcome separately.
2. Compare traffic channels and campaign source/medium. Investigate unexplained
   changes before assigning success to a campaign.
3. Review top landing pages and content by page path. Group Daily editions,
   guides/resources, service pages, and case studies when interpreting trends.
4. Inspect inquiry funnel abandonment. Treat provider success totals as a
   separate check on browser measurement coverage.
5. Record one actionable finding and any launch, campaign, or measurement change.

Realtime is a collection diagnostic. Standard reports need processing time and
cannot reconstruct visits from before the installation. With little initial
traffic, prefer multiweek counts and trends over unstable percentage changes.

## Campaign naming

Use lowercase, consistent values on external campaign links:

| Field | Examples |
| --- | --- |
| `utm_source` | `linkedin`, `rudi_newsletter`, an actual partner name |
| `utm_medium` | `social`, `email`, `referral`, `cpc` for paid search |
| `utm_campaign` | `q4_2026_workshops`, `rudi_daily_2026_09` |
| `utm_content` | `hero_link`, `footer_link`, `post_01` |

Example: `https://learnrudi.com/start-here/?utm_source=linkedin&utm_medium=social&utm_campaign=q4_2026_workshops&utm_content=post_01`.
Do not add UTMs to internal navigation or put personal information into URLs.

## Configuration and safe filtering

Keep enhanced measurement and email redaction enabled. Event history should be
14 months for useful explorations. Link the canonical HTTPS Search Console
property and publish its reports after ownership is verified.

Define internal traffic using verified public IPs. Test the rule first; inspect
the Test data filter name dimension before activating exclusion. Active filters
permanently discard matching incoming data. Recheck the rule when the public IP
changes. Keep IP values and account-specific setup receipts out of Git.

## Verification

Run `npm test` and `npm run build`. The conversion tests cover provider failures,
untrusted newsletter messages, duplicates, blocked storage, missing or blocked
analytics, bounded delivery time, production-only conversion dispatch, and PII
exclusion. Use intercepted provider responses and analytics requests for browser
QA so test submissions do not create real leads, subscribers, or GA4 conversions.
Do not claim a real provider submission was tested when responses were mocked.

After deployment, verify the deployed modules match the release and confirm the
key-event definitions remain enabled in GA4. Genuine conversion data begins
with successful visitor submissions after deployment.
