# RUDI Website Structure - Reorganization Plan

## Current Issues
- Too many nested routes under `/rudi`
- Duplicate assessment pages (`/assessment` and `/rudi/assessment`)
- Playground/development routes mixed with production content
- Unclear primary navigation paths
- Complex URL structures that are hard to remember

## Proposed New Structure

### 🏠 Primary Routes (Top-Level Navigation)

| Route | Purpose | Current Location |
|-------|---------|------------------|
| `/` | Landing page with Learn/Build/Govern blocks | ✅ Keep as is |
| `/assessment` | Interactive AI literacy assessment with radar chart | ✅ Keep as is |
| `/framework` | RUDI Framework Matrix (technical/non-technical) | ✅ Keep as is |
| `/resources` | Consolidated learning resources hub | 🆕 NEW (from assessment results) |
| `/about` | About RUDI, methodology, team | 🆕 NEW |
| `/contact` | Schedule consultation, get started | 🆕 NEW |

### 📚 Program Routes (Secondary Navigation)

| Route | Purpose | Current Location |
|-------|---------|------------------|
| `/program` | RUDI program overview | 🔄 Rename from `/rudi` |
| `/program/training` | Training curriculum & tiers | ✅ Keep from `/rudi/training` |
| `/program/certification` | Company certification info | ✅ Keep from `/rudi/certification` |
| `/program/community` | Community & support | 🔄 Rename from `/rudi/circle` |

### 🧪 Development Routes (Separate Area)

| Route | Purpose | Recommendation |
|-------|---------|----------------|
| `/demo` | Playground menu | 🔄 Move from `/playground` |
| `/demo/video-player` | Video player demos | 🔄 Consolidate playground routes |
| `/demo/courses` | LMS preview | 🔄 Move from `/playground/courses` |
| `/demo/database` | Database inspector | 🔄 Move from `/playground/database` |

### ❌ Routes to Remove/Merge

- `/rudi/assessment` → Merge content into main `/assessment`
- `/rudi/curriculum-pdf` → Add as download button in `/program/training`
- `/playground/basic`, `/advanced`, `/config`, `/multiple` → Consolidate into single demo page

## Navigation Structure

### Primary Navigation (Header)
```
RUDI AI | Framework | Assessment | Resources | Program | Contact
```

### Program Dropdown
```
Program ▼
  ├── Overview
  ├── Training
  ├── Certification
  └── Community
```

### Footer Links
```
About | Blog | Documentation | API | Privacy | Terms
Training | Certification | Community | GitHub | Discord
```

## Key User Journeys

### 1. Organization Exploring RUDI
```
Landing (/)
  → Program Overview (/program)
  → Training Details (/program/training)
  → Contact for Quote (/contact)
```

### 2. Individual Self-Assessment
```
Landing (/)
  → Take Assessment (/assessment)
  → View Resources (/resources)
  → Join Community (/program/community)
```

### 3. Technical Implementation
```
Framework (/framework)
  → Resources (/resources)
  → Documentation (/about)
  → API/Demo (/demo)
```

### 4. Training & Certification Path
```
Program (/program)
  → Training Tiers (/program/training)
  → Certification Requirements (/program/certification)
  → Schedule Consultation (/contact)
```

## Implementation Priority

### Phase 1: Core Reorganization
1. Create `/resources` page with integrated learning materials
2. Create `/about` page with RUDI methodology
3. Create `/contact` page with forms/scheduling
4. Rename `/rudi` to `/program`
5. Update navigation in Header.tsx

### Phase 2: Consolidation
1. Merge `/rudi/assessment` content into `/assessment`
2. Move curriculum PDF to `/program/training`
3. Rename `/rudi/circle` to `/program/community`
4. Consolidate playground routes under `/demo`

### Phase 3: Polish
1. Update all internal links
2. Add proper redirects for old URLs
3. Improve breadcrumb navigation
4. Add sitemap.xml
5. Update meta tags and SEO

## Benefits of New Structure

✅ **Clearer Mental Model** - Easier to understand site hierarchy
✅ **Better SEO** - Flatter structure with descriptive URLs
✅ **Improved UX** - Fewer clicks to reach key content
✅ **Easier Maintenance** - Clear separation of concerns
✅ **Scalability** - Room to grow without complexity

## URL Redirects Needed

```
/rudi → /program
/rudi/training → /program/training
/rudi/certification → /program/certification
/rudi/circle → /program/community
/rudi/assessment → /assessment
/playground → /demo
/playground/* → /demo/*
```