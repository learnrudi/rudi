# Google Sheets Setup Guide for RUDI Assessment

This guide will help you set up Google Sheets to collect assessment responses without any login system.

## Quick Setup (10 minutes)

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "RUDI Assessment Responses"
4. In row 1, add these headers:

```
A1: Timestamp
B1: Organization
C1: Operational Score
D1: Conceptual Score
E1: Governance Score
F1: Overall Score
G1: Level
H1: Current Usage
I1: Tools Used
J1: Learning Interest
K1: Confidence
L1: Understanding
M1: Verification
N1: Concerns
O1: Priority
P1: Role
Q1: Org AI Usage
```

5. Name the first sheet "Responses"
6. Copy the Sheet ID from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
   - Copy the `[SHEET_ID]` part

### Step 2: Create Service Account (One-time setup)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click Enable

4. Create Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" > "Service account"
   - Name: "rudi-assessment-writer"
   - Click "Create and Continue"
   - Skip the optional steps, click "Done"

5. Generate Key:
   - Click on your new service account
   - Go to "Keys" tab
   - "Add Key" > "Create new key"
   - Choose JSON
   - Download the file

6. Copy from the JSON file:
   - `client_email`: This is your service account email
   - `private_key`: This is your private key (keep the quotes and \n)

### Step 3: Share Sheet with Service Account

1. Go back to your Google Sheet
2. Click "Share" button
3. Paste the service account email (looks like: `name@project.iam.gserviceaccount.com`)
4. Give "Editor" permission
5. Uncheck "Notify people"
6. Click "Share"

### Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
```

### Step 5: Test

1. Restart your dev server: `npm run dev`
2. Complete an assessment at `/assessment`
3. Check your Google Sheet - new row should appear!

## What Gets Stored

- **No personal information** - Everything is anonymous
- **Organization name** (if provided)
- **Assessment scores** (Operational, Conceptual, Governance)
- **Individual question responses**
- **Timestamp**

## Viewing Results

Open your Google Sheet to see:
- Real-time responses as they come in
- Use Google Sheets features:
  - Charts for visualizing scores
  - Filters for specific organizations
  - Pivot tables for aggregate analysis
  - Share with stakeholders (view-only)

## Troubleshooting

### "Failed to save assessment" in console
- Check service account email has Editor access to sheet
- Verify Sheet ID is correct
- Make sure private key includes BEGIN/END lines

### No data appearing
- Check browser console for errors
- Verify API endpoint is returning 200 status
- Try refreshing the Google Sheet

### Rate Limits
- Google Sheets API: 300 requests per minute
- More than enough for assessments

## Privacy & Security

- ✅ **No login required** - Completely anonymous
- ✅ **No cookies or tracking**
- ✅ **Data stays in your Google account**
- ✅ **Service account only has access to this one sheet**
- ✅ **Can delete data anytime from Sheet**

## Next Steps

Once you have data collecting:
1. Create charts in Google Sheets
2. Set up email notifications for new responses
3. Build a dashboard using Google Data Studio
4. Export to CSV for advanced analysis

That's it! You now have a simple, free, no-login-required data collection system.