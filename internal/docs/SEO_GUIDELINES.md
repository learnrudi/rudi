# RUDI SEO and URL Maintenance

`internal/config/seo.json` is the reference for current public-page metadata. Page markup remains the deployed source of truth, so update the config and the corresponding HTML together.

## Current positioning

RUDI helps organizations put AI to work through team training, workflow
improvement, custom agents and applications, and AI workspace support. Use
specific service language in titles and summaries while retaining the service
architecture:

- AI Readiness
- AI Strategy
- AI Enablement
- AI Adoption
- AI Implementation

Human-centered, responsible, and governed AI span that continuum. Workforce
training remains beneath AI Enablement in the URL structure. Greater Cincinnati
is RUDI's home region; the service market remains national.

## Search presentation

- Keep homepage `WebSite` structured data, `og:site_name`, and visible branding
  consistent with the name RUDI. Keep the organization entity separate and
  reference it as the website publisher.
- Write each page's introduction as a useful standalone summary. Keep titles,
  descriptions, social metadata, and structured data aligned with the page.
- Keep the favicon URL stable and crawlable. Google decides whether to display it.
- Update sitemap modification dates when the corresponding page changes, not
  merely to suggest freshness.
- Check URL Inspection after publication. Request indexing for changed key pages
  when appropriate; record confirmation separately from an actual recrawl.
- Google chooses snippets and sitelinks. Do not promise particular wording,
  sitelinks, ranking, or a refresh date.

## Canonical entry points

| Purpose | Canonical URL |
| --- | --- |
| Organization overview | `https://learnrudi.com/` |
| Services | `https://learnrudi.com/how-we-help/` |
| Workforce programs | `https://learnrudi.com/how-we-help/ai-enablement/workforce-programs/` |
| Readiness assessment | `https://learnrudi.com/how-we-help/ai-readiness/assessment/` |
| Start a conversation | `https://learnrudi.com/start-here/` |
| Founder | `https://learnrudi.com/about.html#founder` |
| Partners | `https://learnrudi.com/about.html#partners` |
| Research and RUDI Daily | `https://learnrudi.com/insights/` |

The legacy `framework.html` page remains public because it contains unique competency and responsible-use material. The standalone `survey.html` page retains a configured submission flow but has no current inbound public link; it must not be retired until the survey owner confirms that it is inactive.

## Retired URLs

Do not use legacy Training, Consulting, Capabilities, Contact, Camp Claude, standalone founder, standalone partner, or old custom-training URLs in page markup, metadata, sitemap entries, or generators. `vercel.json` preserves those URLs with direct permanent redirects, while `npm run build` verifies that:

- retired HTML files are absent;
- required redirect mappings remain permanent and direct;
- redirect destinations and fragments exist;
- redirected URLs are absent from the sitemap; and
- HTML and JavaScript do not reference removed local targets.

Internal links should always point to the final canonical destination, never to a redirect source.

## Required metadata

Every indexable page should include:

- one descriptive `<title>`;
- one meta description;
- one canonical URL;
- Open Graph title, description, URL, and `https://learnrudi.com/og.png` image;
- a large-image Twitter card;
- exactly one H1; and
- useful links into the service architecture and `/start-here/` funnel.

Directory routes must include a trailing slash in internal links. This avoids a redirect before the page resolves.

## New-page checklist

- [ ] Add accurate metadata to `internal/config/seo.json`.
- [ ] Add the final canonical URL to `public/sitemap.xml`.
- [ ] Use the shared navigation and clear, current service language.
- [ ] Link directly to canonical routes with valid anchors.
- [ ] Add the page to the architecture checks when it is a core route.
- [ ] Run `npm run build`, the Daily generator tests, redirect checks, and the local crawl.
