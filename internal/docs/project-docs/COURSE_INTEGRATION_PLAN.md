# 🚀 LLM-Ops Course Integration Plan for Rudi-Web

## Overview
Integrate your complete LLM-Ops curriculum from `/Users/hoff/My Drive/projects/LLM-Ops/curriculum/LLM-Ops-Curriculum-Organized` into your existing Next.js/Supabase site.

---

## 📊 Current Assets

### Course Content Ready:
- **25 video lessons** (2.7 hours total)
- **38 text lessons** 
- **36 micro-lessons**
- **5 business applications** with labs
- **All organized** in module structure

### Site Infrastructure Ready:
- Next.js app configured
- Supabase database with course schema
- Cloudflare Stream for video hosting
- Course pages already scaffolded
- Payment structure in place

---

## 🎬 Phase 1: Video Upload (Day 1)

### Step 1: Upload Videos to Cloudflare Stream
```bash
# Use the existing script
cd /Users/hoff/My Drive/dev/rudi-web
./scripts/upload-videos-to-cloudflare.sh

# Videos to upload from:
# /Users/hoff/My Drive/projects/LLM-Ops/curriculum/LLM-Ops-Curriculum-Organized/
```

### Step 2: Document Video IDs
Create a mapping file of:
- Video filename → Cloudflare Stream ID
- Module/Lesson → Video ID

---

## 💾 Phase 2: Database Setup (Day 1)

### Step 1: Run Existing Migration
```sql
-- In Supabase SQL Editor
-- Run: supabase/phase1_complete.sql
-- Run: supabase/seed_actual_courses.sql
```

### Step 2: Add Your Course Data
Update the seed file with your actual:
- Course titles and descriptions
- Video IDs from Cloudflare
- Pricing (Foundation: $397, Complete: $997)
- Module structure

---

## 📁 Phase 3: Content Migration (Day 2)

### Step 1: Copy Course Content
```bash
# Copy your curriculum to the site
cp -r "/Users/hoff/My Drive/projects/LLM-Ops/curriculum/LLM-Ops-Curriculum-Organized" \
      "/Users/hoff/My Drive/dev/rudi-web/content/courses/llm-ops"
```

### Step 2: Create Module Pages
For each module, create:
- `/src/app/courses/llm-ops/[module-slug]/page.tsx`
- Lesson listing pages
- Video player integration

---

## 🎨 Phase 4: UI Implementation (Day 2-3)

### Course Catalog Page Updates
```tsx
// src/app/courses/page.tsx
// Add featured course cards:
- LLM-Ops Complete ($397)
- Business Track ($197)
- Foundation Package ($297)
```

### Module Viewer Components
```tsx
// Create new components:
- CourseModuleList
- LessonViewer
- VideoPlayer (with Cloudflare)
- LabInstructions
- MicroLessonAccordion
```

### Learning Dashboard
```tsx
// src/app/dashboard/page.tsx
- Progress tracking
- Module completion
- Certificate generation
```

---

## 💰 Phase 5: Pricing & Access (Day 3)

### Pricing Tiers in Database:
```sql
-- Foundation Package ($297)
INSERT INTO products (name, price_cents, access_scope)
VALUES ('LLM-Ops Foundation', 29700, 'bundle:foundation');

-- Complete Course ($397 launch / $997 regular)
INSERT INTO products (name, price_cents, access_scope)
VALUES ('LLM-Ops Complete', 39700, 'course:llm-ops-complete');

-- Business Track ($197)
INSERT INTO products (name, price_cents, access_scope)
VALUES ('Business Track', 19700, 'bundle:business-track');
```

### Access Control:
- Use Supabase RLS policies
- Check user purchases
- Grant module access

---

## 🚢 Phase 6: Launch Preparation (Day 4)

### Pre-Launch Checklist:
- [ ] All 25 videos uploaded to Cloudflare
- [ ] Database seeded with course data
- [ ] Course pages rendering correctly
- [ ] Video playback working
- [ ] Payment flow tested
- [ ] Access control verified

### Marketing Pages:
- [ ] Landing page with course benefits
- [ ] Pricing comparison table
- [ ] Student testimonials section
- [ ] FAQ page
- [ ] About instructor page

---

## 📋 Quick Start Commands

### 1. Start Development
```bash
cd /Users/hoff/My Drive/dev/rudi-web
npm run dev
# Site runs at http://localhost:3000
```

### 2. Upload First Video (Test)
```bash
# Upload one video to test
curl -X POST \
  https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT/stream \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F file=@"path/to/video.mp4"
```

### 3. Create Course in Database
```sql
-- Quick course creation
INSERT INTO courses (slug, title, description, price_cents)
VALUES ('llm-ops-beta', 'LLM-Ops Beta Access', 'Early bird pricing', 29700);
```

---

## 🎯 Revenue Projections

### Soft Launch (Week 1)
- 10 beta users @ $297 = $2,970
- Use feedback for improvements

### Full Launch (Week 2-4)
- 50 users @ $397 = $19,850
- Add testimonials

### Scale (Month 2+)
- 100+ users @ $497 = $49,700+
- Add advanced modules

---

## 📊 Module-to-Page Mapping

```
curriculum/                    → site/
Module_01_AI_Foundations/     → /courses/llm-ops/ai-foundations
Module_02_Prompting_Mastery/  → /courses/llm-ops/prompting
Module_03_CS_Fundamentals/    → /courses/llm-ops/cs-fundamentals
Business_Track/               → /courses/llm-ops/business-track
```

---

## 🔥 Day 1 Priority Actions

1. **Upload 5 test videos** to Cloudflare
2. **Run database migrations**
3. **Create one module page** as template
4. **Test video playback**
5. **Set up Stripe/payment** (if not done)

---

## 💡 Pro Tips

### Video Organization:
- Name files: `module-01-lesson-01-title.mp4`
- Keep under 500MB per video
- Use Cloudflare's HLS streaming

### Content Structure:
```
/content/courses/llm-ops/
├── module-01-ai-foundations/
│   ├── metadata.json
│   ├── lesson-01-intro/
│   │   ├── video-id.txt
│   │   ├── transcript.md
│   │   └── slides/
│   └── lesson-02-llms/
├── module-02-prompting/
└── business-track/
```

### Database Best Practices:
- Use UUIDs for all IDs
- Store video IDs in `lesson_resources` table
- Track completion in `user_progress` table

---

## ✅ Success Metrics

### Technical Success:
- [ ] All videos playable
- [ ] Lessons load < 2 seconds
- [ ] Mobile responsive
- [ ] Progress saves correctly

### Business Success:
- [ ] First sale within 24 hours
- [ ] 10 sales in week 1
- [ ] 5-star reviews
- [ ] < 5% refund rate

---

## 🚀 You're 4 Days from Launch!

Your site infrastructure is ready. Your content is ready. Just need to connect them!

**Day 1:** Videos + Database
**Day 2:** Content + Pages
**Day 3:** Polish + Test
**Day 4:** LAUNCH! 🎉