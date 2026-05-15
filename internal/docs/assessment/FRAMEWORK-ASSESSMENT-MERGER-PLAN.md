# Framework & Assessment Page Merger Plan

## Current State Analysis

### Framework.html (Current)
- **Content Volume:** ~450 lines
- **Key Sections:**
  1. 30-Point Framework overview
  2. Three-Dimensional Model explanation
  3. 3D cube visualization
  4. Five Proficiency Levels
  5. Detailed Domain breakdown (Conceptual, Operational, Governance)
  6. Visual competency tracking sample
  7. Reports overview

### Assessment.html (Current)
- **Content Volume:** ~420 lines
- **Key Sections:**
  1. Assessment platform overview
  2. Skills catalog interface image
  3. What We Measure
  4. Visual Competency Reports
  5. How It Works (4-step process)
  6. For Organizations features
  7. Assessment Administration details

---

## Proposed Combined Structure

### New "Framework & Assessment" Page Structure

#### 1. **HERO SECTION** - Unified Value Prop
```
Title: "30-Point Framework & Competency Assessment"
Subtitle: "Industry-standard AI literacy model with precision measurement"
Key Points:
- 30 competencies across 3 domains
- 5 proficiency levels
- Real-time assessment platform
- Individual & team tracking
```

#### 2. **THE FRAMEWORK** (From framework.html)
- Three-Dimensional Model explanation
- 3D cube visualization ✅ (already placed)
- Framework Scale (3 domains × 5 levels = 30 points)

#### 3. **COMPETENCY DOMAINS** (From framework.html)
- Conceptual Domain details
- Operational Domain details
- Governance Domain details
- Keep the detailed breakdowns

#### 4. **PROFICIENCY LEVELS** (From framework.html)
- Five levels with descriptions
- Target levels for each certificate

#### 5. **ASSESSMENT PLATFORM** (From assessment.html)
- Skills catalog interface image ✅ (already placed)
- "How We Measure" introduction
- Platform features

#### 6. **HOW ASSESSMENT WORKS** (From assessment.html)
- 4-step process
- Timeline
- Delivery methods

#### 7. **VISUAL REPORTING** (Merge both)
- Sample competency radar chart
- Growth tracking visualization
- Individual reports
- Team dashboards

#### 8. **ORGANIZATIONAL FEATURES** (From assessment.html)
- ROI tracking
- Export capabilities
- Administration options

#### 9. **CTA SECTION**
- Take assessment
- Schedule demo
- Download framework PDF

---

## Information Architecture Benefits

### Why This Combination Works:

1. **Logical Flow:** Framework (what) → Assessment (how) → Results (outcome)
2. **Reduced Redundancy:** Both pages reference the same 30 competencies
3. **Stronger Story:** Complete competency system in one place
4. **User Journey:** Single page for understanding AND measuring competencies
5. **Navigation Simplification:** 8 main pages → 7 main pages

### What Gets Cut/Consolidated:
- Duplicate explanations of the 30-point model
- Redundant CTAs
- Overlapping "What We Measure" sections
- Separate hero sections

### What Stays Distinct:
- Framework theory vs. Assessment practice
- Conceptual model vs. Platform features
- Learning objectives vs. Measurement methods

---

## Navigation Updates

### Current Navigation:
```
Courses | Certifications | Framework | Assessment | Ohio | Resources
```

### New Navigation:
```
Courses | Certifications | Framework | Ohio | Resources
```

### URL Strategy:
- Keep `/framework.html` as primary URL
- Redirect `/assessment.html` → `/framework.html#assessment`
- Add anchor links for smooth scrolling

---

## Implementation Steps

### Phase 1: Content Consolidation
1. Copy assessment-specific content to framework.html
2. Reorganize sections for logical flow
3. Merge duplicate content
4. Update section headers

### Phase 2: Visual Integration
1. Keep both hero images (3D cube + skills catalog)
2. Ensure visual hierarchy with proper spacing
3. Add section dividers for clarity

### Phase 3: Navigation Updates
1. Remove "Assessment" from main nav
2. Update all internal links
3. Add in-page navigation for long content

### Phase 4: Cleanup
1. Archive assessment.html
2. Update sitemap
3. Test all links

---

## Content Length Considerations

### Combined Page Stats:
- **Estimated Length:** ~700-800 lines
- **Sections:** 9 major sections
- **Images:** 2 primary (3D cube, skills catalog)
- **Interactive Elements:** Sample charts, possibly interactive

### Solutions for Length:
1. **Accordion/Collapsible Sections:** For detailed domain breakdowns
2. **Tabbed Interface:** For switching between Framework/Assessment views
3. **Jump Navigation:** Sticky sidebar with section links
4. **Progressive Disclosure:** Show summaries, expand for details

---

## Alternative Approach (If Too Long)

### Option B: Parent-Child Structure
Keep Framework as main page but make Assessment a sub-section:

```
Framework (parent)
├── Overview
├── Domains & Levels
└── Assessment Platform (linked section or modal)
```

### Option C: Tab-Based Single Page
```
[Framework] [Assessment] [Reports] [Resources]
```
All content on one URL but tabbed interface for organization.

---

## Recommendation

**Go with the full merger** but implement:
1. **Sticky navigation sidebar** for easy section jumping
2. **Collapsible domain details** to manage length
3. **Clear section breaks** with visual dividers
4. **"Back to top" buttons** between major sections

This creates the most cohesive experience while managing the information load effectively.