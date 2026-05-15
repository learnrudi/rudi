# RUDI AI SEO Guidelines & Config Reference

## Overview

This document explains how to use `internal/config/seo.json` to maintain consistent SEO metadata across all pages and how to implement SEO best practices on each page.

---

## 1. SEO Config Structure

The `internal/config/seo.json` file is the **single source of truth** containing:

### Global Settings
- **site**: Domain, description, organization name
- **organization**: Schema.org EducationalOrganization data
- **social**: Social media links
- **seo.keywords**: Global keywords and page-specific keywords

### Page-Specific Data
- **pages**: Unique metadata for each page (title, description, H1, keywords)
- **clients**: Partner organizations for testimonials
- **certifications**: Course/certification level definitions

### Metadata
- **metadata**: Charset, language, viewport settings

---

## 2. How to Use Config on Each Page

### Step 1: Reference Organization Data

All pages should include this schema in the `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "RUDI AI",
  "alternateName": "Responsible Use of Digital Intelligence",
  "description": "Professional AI certification and training provider specializing in responsible AI education and workforce development",
  "url": "https://learnrudi.com",
  "email": "learnrudi@gmail.com"
}
</script>
```

### Step 2: Use Page-Specific Metadata

For example, on `index.html`:

```html
<!-- From config.pages.index -->
<title>RUDI AI - Responsible AI Certificate & Program Training | TechCred Eligible</title>
<meta name="description" content="Professional AI training with TechCred-eligible certificates...">
<meta name="keywords" content="AI certification, responsible AI training, AI literacy, TechCred-eligible, professional AI courses">
<link rel="canonical" href="https://learnrudi.com/">

<h1>Responsible AI Certificate & Program Training</h1>
```

### Step 3: Add Open Graph Tags

Every page should have:

```html
<meta property="og:site_name" content="RUDI AI">
<meta property="og:title" content="[Page title from config]">
<meta property="og:description" content="[Page description from config]">
<meta property="og:type" content="website">
<meta property="og:url" content="[Page canonical from config]">
<meta property="og:image" content="[Page og_image from config]">
<meta property="og:locale" content="en_US">
```

### Step 4: Add Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@RUDIAI">
<meta name="twitter:title" content="[Page title]">
<meta name="twitter:description" content="[Page description]">
<meta name="twitter:image" content="[og_image]">
```

---

## 3. Page Configuration Reference

| Page | Config Key | Title Length | Keywords |
|------|-----------|--------------|----------|
| index.html | pages.index | 83 chars | AI certification, responsible AI training |
| certificates-business.html | pages.certificates-business | 77 chars | Business AI training, corporate AI certification |
| certificates-education.html | pages.certificates-education | 77 chars | AI for educators, teacher AI training |
| contact.html | pages.contact | 73 chars | Contact RUDI, AI training consultation |
| ohio.html | pages.ohio | 62 chars | Ohio TechCred, TechCred funding, Upskill Ohio |
| courses.html | pages.courses | 66 chars | AI courses, AI training programs |
| framework.html | pages.framework | 70 chars | AI competency framework, AI assessment |
| research.html | pages.research | 78 chars | AI training research, MIT AI studies |
| resources.html | pages.resources | 67 chars | Free AI resources, AI training materials |
| partners.html | pages.partners | 73 chars | RUDI AI partners, strategic partnerships |
| get-certificate.html | pages.get-certificate | 75 chars | Claim certificate, AI literacy certificate |

**Note:** Title length should be 50-60 characters for optimal display in search results

---

## 4. Required Tags for All Pages

Every page needs these minimum tags:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[From config.pages.{page}.title]</title>
  <meta name="description" content="[From config.pages.{page}.description]">
  <meta name="keywords" content="[From config.pages.{page}.keywords]">
  <meta name="author" content="RUDI AI">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="[From config.pages.{page}.canonical]">

  <!-- Open Graph -->
  <meta property="og:site_name" content="RUDI AI">
  <meta property="og:title" content="[Page title]">
  <meta property="og:description" content="[Page description]">
  <meta property="og:type" content="website">
  <meta property="og:url" content="[Page canonical]">
  <meta property="og:image" content="[From config.pages.{page}.og_image]">
  <meta property="og:locale" content="en_US">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@RUDIAI">
  <meta name="twitter:title" content="[Page title]">
  <meta name="twitter:description" content="[Page description]">
  <meta name="twitter:image" content="[og_image]">
</head>
```

---

## 5. Schema.org Markup by Page Type

### Homepage (index.html)
- ✅ EducationalOrganization
- ✅ Course (3x for each certification level)
- ✅ AggregateRating

### Certificate Pages (business/education)
- ✅ EducationalOccupationalCredential
- ✅ Course (12x for each credential)
- ✅ Organization

### Contact Page
- ✅ ContactPage
- ✅ FAQPage (if FAQ section exists)
- ✅ Organization with contactPoint

### Resource Pages
- ✅ CollectionPage
- ✅ AggregateOffer (for resources)

### All Pages
- ✅ Breadcrumb schema (site hierarchy)
- ✅ Organization schema (in footer/nav)

---

## 6. Keyword Strategy

### Primary Keywords (High Volume, High Competition)
- AI certification
- Responsible AI training
- AI literacy
- Professional AI courses
- Enterprise AI training

### Secondary Keywords (Medium Volume)
- TechCred-eligible
- AI readiness framework
- AI competency assessment
- Corporate AI training
- Ohio TechCred

### Long-tail Keywords (Low Volume, Low Competition)
- 30-point AI framework
- AI implementation failure
- 92% AI failure rate
- Workforce AI readiness
- AI training ROI

### Geo-targeted Keywords
- Ohio TechCred
- Upskill Ohio
- Ohio AI training
- Ohio workforce development

---

## 7. Internal Linking Strategy

### Homepage Links To:
- `/certificates-business.html` (primary CTA)
- `/certificates-education.html` (primary CTA)
- `/contact.html` (secondary CTA)
- `/framework.html` (education)
- `/ohio.html` (regional)

### Certificate Pages Link To:
- `index.html` (back to home)
- Other certificate variant (business ↔ education)
- `/contact.html` (enrollment CTA)
- `/courses.html` (course details)

### Research Page Links To:
- `index.html` (home)
- `/framework.html` (methodology)
- `/resources.html` (additional learning)

---

## 8. SEO Checklist for New Pages

When creating a new page, verify:

- [ ] Page entry added to `internal/config/seo.json`
- [ ] Title tag: 50-60 characters, includes primary keyword
- [ ] Meta description: 150-160 characters, includes CTA
- [ ] H1 tag: Unique, includes page topic
- [ ] H2/H3 tags: Logical hierarchy (5-8 H2s recommended)
- [ ] Keywords: 5-10 natural keyword mentions
- [ ] Schema markup: Appropriate for page type
- [ ] Open Graph tags: All required tags present
- [ ] Twitter Card: summary_large_image format
- [ ] Canonical URL: Points to learnrudi.com
- [ ] Internal links: 3-5 relevant internal links
- [ ] External links: 2-3 authoritative external sources
- [ ] Image alt text: All images have descriptive alt text
- [ ] Mobile responsive: Tested on mobile devices
- [ ] Page speed: Core Web Vitals optimized

---

## 9. Monitoring & Updates

### Monthly Tasks:
- [ ] Check Google Search Console for new keyword opportunities
- [ ] Monitor average position for target keywords
- [ ] Review click-through rates (CTR)
- [ ] Check for indexed pages without canonical issues

### Quarterly Tasks:
- [ ] Update `internal/config/seo.json` with new keywords/insights
- [ ] Review and optimize underperforming pages
- [ ] Add new content addressing gap keywords
- [ ] Update client list and testimonials

### Annually:
- [ ] Full SEO audit
- [ ] Update Schema markup versions
- [ ] Review and refresh old content
- [ ] Backlink profile analysis

---

## 10. Tools & Resources

### Free Tools:
- Google Search Console: Monitor indexing and keywords
- Google Analytics: Track traffic and user behavior
- Google Pagespeed Insights: Check performance
- Schema.org Validator: Verify structured data
- Ubersuggest: Keyword research

### Paid Tools:
- SEMrush: Competitor analysis, keyword tracking
- Ahrefs: Backlink analysis, keyword research
- Moz: Domain authority, SEO recommendations

---

## 11. Current SEO Status

**Overall Score: 7.1/10**

### Strengths ✅
- Strong homepage and framework page optimization
- Good internal linking strategy
- Comprehensive content quality
- Mobile responsive

### Gaps ⚠️
- Missing schema on certificate pages
- Missing meta descriptions on some pages
- Domain inconsistency (learnrudi.com vs oairudi.org)
- Limited blog content

### Quick Wins 🚀
1. Add schema to certificate pages (+5% CTR potential)
2. Add meta descriptions to all pages (+3% CTR)
3. Consolidate domain to learnrudi.com (+10% authority)
4. Add FAQ schema (+8% CTR for FAQ results)

---

## 12. Next Steps

Priority order for SEO improvements:

1. **Immediate (This Week)**
   - [ ] Fix domain references (all to learnrudi.com)
   - [ ] Add missing meta descriptions
   - [ ] Add schema to certificate pages

2. **Short-term (2-4 Weeks)**
   - [ ] Implement breadcrumb schema
   - [ ] Add FAQ schema to contact page
   - [ ] Create blog/resources content

3. **Medium-term (1-3 Months)**
   - [ ] Build backlinks from partner sites
   - [ ] Create content for gap keywords
   - [ ] Implement advanced schema (LocalBusiness, VideoObject)

4. **Long-term (3-12 Months)**
   - [ ] Establish topical authority (AI training expert)
   - [ ] Build content clusters around main topics
   - [ ] Develop proprietary research/insights
   - [ ] Create industry partnerships/backlinks

---

**Last Updated:** October 20, 2025
**Config Version:** 1.0
**Next Review:** January 20, 2026
