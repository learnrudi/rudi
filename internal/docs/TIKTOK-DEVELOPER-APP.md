# TikTok Developer App Setup

Use this for the RUDI Sandbox app in TikTok for Developers. Do not commit TikTok client secrets or access tokens.

## App details

App name:

```text
RUDI
```

Category:

```text
Education
```

Description:

```text
RUDI helps creators prepare educational AI videos and upload approved drafts to their connected TikTok account.
```

Terms of Service URL:

```text
https://learnrudi.com/terms.html
```

Privacy Policy URL:

```text
https://learnrudi.com/privacy.html
```

Integration information URL:

```text
https://learnrudi.com/tiktok.html
```

App icon:

```text
public/images/rudi-tiktok-app-icon.png
```

Platform:

```text
Web
```

Local sandbox redirect URI:

```text
http://127.0.0.1:8787/auth/tiktok/callback
```

Use this as a Desktop redirect URI for local sandbox testing. Keep the Web redirect URI for the later hosted implementation.

## Products and scopes

Start with the lowest-risk review surface:

```text
Product: Content Posting API
Scopes: user.info.basic, video.upload
```

Do not request `video.publish` until direct publishing is implemented, tested, and ready for review. The first implementation should upload a creator-selected video to TikTok for final review inside TikTok.

## Scope explanation for review

```text
RUDI helps creators prepare educational short-form videos, review captions, and upload approved videos to their connected TikTok account.

user.info.basic identifies the connected TikTok account so RUDI can show the creator which account is connected.

video.upload lets RUDI upload only the selected video file and caption metadata that the creator approved. The creator completes the final review in TikTok before the video goes live.

RUDI stores posting status and post URLs in the creator's publishing log. TikTok tokens are stored server-side and encrypted. RUDI does not sell TikTok data or use it for advertising profiles.
```

## Sandbox target users

Add the TikTok account that will test the integration. For review, the demo video should show:

1. Open RUDI in the browser.
2. Select a finished short-form video.
3. Review title, caption, and hashtags.
4. Connect TikTok through OAuth.
5. Approve upload to TikTok.
6. Complete final review in TikTok.
7. Return to RUDI and show the publishing log/status.

## Secret handling

Store these values only in RUDI secrets or the deployment secret manager:

```text
TIKTOK_CLIENT_KEY
TIKTOK_CLIENT_SECRET
TIKTOK_REDIRECT_URI
```

Rotate the client secret if it has been saved in a local note, committed, pasted into a shared channel, or exposed in logs.
