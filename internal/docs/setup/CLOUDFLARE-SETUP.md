# Cloudflare Stream Setup Guide

## Overview
Your videos will be hosted on Cloudflare Stream, a video platform optimized for streaming with global CDN, automatic encoding, and built-in player.

## Setup Steps

### 1. Create Cloudflare Account
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/sign-up)
2. Sign up for a free account
3. Verify your email

### 2. Enable Cloudflare Stream
1. In your dashboard, go to "Stream" in the sidebar
2. Enable Stream (pricing starts at $5/month for 1000 minutes)
3. Note your **Account ID** from the dashboard URL or right sidebar

### 3. Create API Token
1. Go to [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template with these permissions:
   - **Account** → Cloudflare Stream:Edit
   - **Zone** → Zone:Read (optional, for custom domains)
4. Click "Continue to summary" → "Create Token"
5. **Save the token** (you won't see it again!)

### 4. Configure Environment Variables

```bash
# Add to your .env.local or export in terminal:
export CLOUDFLARE_ACCOUNT_ID="your-account-id-here"
export CLOUDFLARE_STREAM_API_TOKEN="your-api-token-here"
```

### 5. Test Upload

```bash
# Test with a single video
node scripts/upload-to-cloudflare.js "/path/to/video.mp4"

# If successful, you'll see:
# ✅ Upload successful!
# Video ID: abc123...
# Playback URL: https://customer-xxx.cloudflarestream.com/abc123/manifest/video.m3u8
```

### 6. Run Full Import

```bash
# Import Module 01 with video uploads
node scripts/import-with-cloudflare.js
```

## Video Management

### Cloudflare Stream Dashboard
- View all uploaded videos: https://dash.cloudflare.com/[account-id]/stream
- Get embed codes, analytics, and manage settings
- Set allowed origins for security

### Video URLs
After upload, each video gets:
- **Stream ID**: Unique identifier (e.g., `f4f1c5d8a5b9c2e7d3a6b9c2`)
- **HLS URL**: For adaptive streaming
- **Thumbnail**: Auto-generated poster image
- **Embed URL**: For iframe embedding

### Database Storage
The import script stores in your database:
- `videos.provider_asset_id` → Cloudflare Stream ID
- `videos.video_provider` → 'cloudflare'

## Playback Options

### 1. Cloudflare Player (Recommended)
```html
<iframe
  src="https://customer-[account-id].cloudflarestream.com/[video-id]/iframe"
  style="border: none; position: absolute; top: 0; height: 100%; width: 100%"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  allowfullscreen="true"
></iframe>
```

### 2. Custom Player (HLS.js)
```javascript
const video = document.getElementById('video');
const src = 'https://customer-[account-id].cloudflarestream.com/[video-id]/manifest/video.m3u8';

if (video.canPlayType('application/vnd.apple.mpegurl')) {
  // Native HLS support (Safari)
  video.src = src;
} else if (Hls.isSupported()) {
  // HLS.js for other browsers
  const hls = new Hls();
  hls.loadSource(src);
  hls.attachMedia(video);
}
```

### 3. Direct MP4 (Fallback)
```html
<video controls>
  <source src="https://customer-[account-id].cloudflarestream.com/[video-id]/downloads/default.mp4" type="video/mp4">
</video>
```

## Pricing

### Cloudflare Stream Pricing (as of 2024)
- **Storage**: $5 per 1000 minutes stored per month
- **Streaming**: $1 per 1000 minutes viewed
- **Encoding**: Included free
- **No bandwidth charges**

### Example Monthly Cost
For Module 01 (23 minutes of video):
- Storage: ~$0.12/month
- Streaming: ~$0.02 per 1000 views

## Security Features

### 1. Signed URLs (Optional)
Require time-limited tokens for playback:
```javascript
// In your API
const signedUrl = await generateSignedStreamUrl(videoId, expiresIn);
```

### 2. Allowed Origins
Restrict where videos can be embedded:
```javascript
// Set in upload metadata
allowedorigins: 'https://yourdomain.com,https://app.yourdomain.com'
```

### 3. Hotlink Protection
Prevent embedding on unauthorized sites via Stream dashboard settings.

## Troubleshooting

### Common Issues

1. **"Insufficient permissions"**
   - Check API token has Stream:Edit permission
   - Verify account ID is correct

2. **"Upload failed"**
   - Check file size (max 30GB)
   - Ensure video format is supported (MP4, MOV, AVI, etc.)
   - Verify network connection for large files

3. **"Video not playing"**
   - Wait 30-60 seconds after upload for processing
   - Check allowed origins if using embed
   - Verify CORS settings for custom domain

### Check Video Status
```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/stream/{video_id}" \
  -H "Authorization: Bearer {api_token}"
```

## Alternative: YouTube (Free Option)

If you don't want to use Cloudflare Stream:

1. Upload videos to YouTube (unlisted)
2. Get video IDs from YouTube URLs
3. Update database:
```sql
UPDATE videos 
SET video_provider = 'youtube',
    provider_asset_id = 'youtube-video-id'
WHERE id = 'video-uuid';
```

4. Embed with YouTube player:
```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>
```

## Next Steps

1. **Set up Cloudflare account** and get credentials
2. **Test upload** with one video
3. **Run full import** for all modules
4. **Build video player** component in your app
5. **Configure security** settings as needed