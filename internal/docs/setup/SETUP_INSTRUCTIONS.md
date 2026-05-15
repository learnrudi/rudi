# RUDI Platform Setup Instructions

## Module 01: AI Foundations - Complete Setup

### Step 1: Run Database Migrations

1. Go to your Supabase Dashboard SQL Editor:
   https://supabase.com/dashboard/project/ahsrercfjhmxnyfrxxqh/sql

2. Run the Phase 1 Core Foundation migration:
   - Copy the contents of `supabase/migrations/001_phase1_core_foundation.sql`
   - Paste and run in SQL Editor

3. Run the Content Assets migration:
   - Copy the contents of `supabase/migrations/002_content_assets.sql`
   - Paste and run in SQL Editor

### Step 2: Create Storage Buckets

In Supabase Dashboard > Storage:

1. Create bucket "transcripts"
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: text/plain, text/markdown, application/pdf

2. Create bucket "slides"
   - Public: Yes
   - File size limit: 50MB
   - Allowed MIME types: image/png, image/jpeg, image/webp, application/pdf

3. Create bucket "course-materials"
   - Public: Yes
   - File size limit: 50MB
   - Allowed MIME types: application/pdf, application/msword, text/plain, text/markdown

### Step 3: Upload Videos to Cloudflare

Since the videos are large (100MB - 1GB+), upload them manually:

1. Go to Cloudflare Stream Dashboard:
   https://dash.cloudflare.com/de8f377bc5bf1f2a41887f15db62c02e/stream/videos

2. Click "Upload video" and upload these files:
   - `/Module_01_AI_Foundations/01_Introduction_to_AI/video.mp4` (15MB)
   - `/Module_01_AI_Foundations/02_Foundations_of_AI/video.mp4` (13MB)
   - `/Module_01_AI_Foundations/04_Large_Language_Models/video.mp4` (18MB)
   - `/Module_01_AI_Foundations/05_LLM_Limitations/video.mp4` (16MB)
   - `/Module_01_AI_Foundations/06_Responsible_AI/video.mp4` (16MB)

3. After upload, copy each video ID

### Step 4: Seed Database with Course Data

1. Update `supabase/seeds/module-01-ai-foundations.sql` with your Cloudflare video IDs
   - Replace all instances of `68a81cf087f84826931f12e58b94027d` with actual IDs

2. Run the seed file in SQL Editor:
   - Copy contents of `supabase/seeds/module-01-ai-foundations.sql`
   - Paste and run in SQL Editor

### Step 5: Upload Course Assets

Run the asset upload script:

```bash
# Install dependencies if needed
npm install

# Upload transcripts, slides, and materials
node scripts/upload-course-assets.js
```

This will upload:
- Transcripts (.txt files)
- Slide images (.png files)
- Lab instructions (.md files)
- Other course materials

### Step 6: Test the System

1. Visit the playground:
   http://localhost:3000/playground/video-library

2. You should see:
   - Left panel: Module navigation with all lessons
   - Main panel: Video player (using test video for now)
   - Progress tracking
   - Asset downloads (transcripts, slides)

## Video IDs Reference

For testing, you can use the test video ID for all videos:
- Test ID: `68a81cf087f84826931f12e58b94027d`

Once you upload the actual videos, update these mappings:

| Lesson | File Path | Duration | Video ID |
|--------|-----------|----------|----------|
| Introduction to AI | 01_Introduction_to_AI/video.mp4 | 5:43 | (pending) |
| Lab: AI Foundations | 01_Introduction_to_AI/lab/Lesson_02_Foundations/video.mp4 | 4:00 | (pending) |
| Demystifying AI | 02_Foundations_of_AI/video.mp4 | 5:04 | (pending) |
| Lab: Traditional AI | 02_Foundations_of_AI/Lab_Lesson_03_Traditional_AI/video.mp4 | 3:00 | (pending) |
| Large Language Models | 04_Large_Language_Models/video.mp4 | 7:00 | (pending) |
| Lab: LLM Recap | 04_Large_Language_Models/Lab_Lesson_04_Recap/video.mp4 | 2:30 | (pending) |
| Lab: Working with LLMs | 04_Large_Language_Models/Lab_Lesson_05_LLM/video.mp4 | 5:00 | (pending) |
| LLM Limitations | 05_LLM_Limitations/video.mp4 | 6:00 | (pending) |
| Lab: Testing LLM Limits | 05_LLM_Limitations/Lab_Lesson_06_LLM_Limitations/video.mp4 | 4:00 | (pending) |
| Responsible AI | 06_Responsible_AI/video.mp4 | 8:00 | (pending) |

## Content Structure

```
Module 01: AI Foundations/
├── 10 video lessons (main + labs)
├── Transcripts for each video
├── Slide decks (PNG images)
├── Lab instructions (Markdown)
├── Lesson information files
└── Additional resources

Total Duration: ~55 minutes
Total Files: 100+ assets
```

## Next Steps

1. Upload remaining modules (2-8)
2. Implement user authentication
3. Add payment processing with Stripe
4. Enable progress tracking
5. Generate completion certificates
6. Add discussion forums
7. Implement search functionality

## Troubleshooting

If you encounter issues:

1. **Database errors**: Check Supabase logs in Dashboard > Logs
2. **Storage errors**: Verify bucket permissions are set to public
3. **Video playback**: Ensure Cloudflare Stream videos are not restricted
4. **Asset upload**: Check Node.js console for detailed error messages

## Support

For questions about:
- Database schema: See `/supabase/schema.json`
- Video player: See `/src/components/VideoPlayer.tsx`
- Course structure: See `/src/app/playground/video-library/page.tsx`