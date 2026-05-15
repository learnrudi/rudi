# RUDI Survey System - Setup Instructions

## What Changed

Your survey system now has **auto-generated survey links**! No more manual admin work.

---

## 🔧 Setup Steps (Do These Now)

### Step 1: Update Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit
2. Go to **Extensions → Apps Script**
3. **Delete all existing code**
4. **Paste the new code** from `/tmp/updated-apps-script.gs` (see below)
5. Click **Save** 💾
6. Click **Deploy → Manage deployments**
7. Click the **pencil icon** ✏️ on your existing deployment
8. Change "Version" to **New version**
9. Click **Deploy**
10. ✅ Done! (The webhook URL stays the same)

### Apps Script Code (Copy This)

```javascript
/**
 * RUDI Survey - Google Apps Script
 * Handles two types of submissions:
 * 1. Assessment Requests (from framework.html)
 * 2. Survey Responses (from survey.html)
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Determine submission type based on presence of specific fields
    if (data.type === 'assessment_request') {
      // Assessment Request from framework.html
      return handleAssessmentRequest(spreadsheet, data);
    } else {
      // Survey Response from survey.html
      return handleSurveyResponse(spreadsheet, data);
    }

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle Assessment Request submission
 */
function handleAssessmentRequest(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Assessment Requests');

  if (!sheet) {
    throw new Error('Assessment Requests sheet not found');
  }

  // Prepare row data
  const row = [
    new Date(data.timestamp || new Date()),  // Timestamp
    data.name || '',                          // Name
    data.email || '',                         // Email
    data.organization || '',                  // Organization
    data.role || '',                          // Role
    data.surveyLink || '',                    // Survey Link
    data.email || ''                          // Created By (same as email)
  ];

  // Append to sheet
  sheet.appendRow(row);

  Logger.log('Assessment request saved: ' + data.organization);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Assessment request saved'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle Survey Response submission
 */
function handleSurveyResponse(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Sheet1');

  if (!sheet) {
    throw new Error('Sheet1 not found');
  }

  // Prepare row data matching existing columns
  const row = [
    new Date(data.timestamp || new Date()),   // Timestamp
    data.company || '',                        // Company
    data.age_range || '',                      // Age Range
    data.industry_sector || '',                // Industry
    Array.isArray(data.ai_tools_familiar)
      ? data.ai_tools_familiar.join(', ')
      : '',                                    // AI Tools
    data.ai_frequency || '',                   // AI Frequency
    data.organizational_ai_usage || '',        // Org AI Usage
    data.comfort_digital_tools || '',          // Comfort Level
    Array.isArray(data.ai_concerns)
      ? data.ai_concerns.join(', ')
      : '',                                    // AI Concerns
    data.sixty_day_priorities || '',           // 60-Day Priority
    data.created_by || ''                      // Created By
  ];

  // Append to sheet
  sheet.appendRow(row);

  Logger.log('Survey response saved for: ' + data.company);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Survey response saved'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Allow GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'RUDI Survey API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

---

## 📊 Google Sheet Structure

Your sheet now has **two tabs**:

### Tab 1: "Sheet1" (Survey Responses - EXISTING)
- **Purpose:** Actual survey answers from team members
- **Columns:** Timestamp | Company | Age Range | Industry | AI Tools | AI Frequency | Org AI Usage | Comfort Level | AI Concerns | 60-Day Priority | Created By

### Tab 2: "Assessment Requests" (NEW - you created this)
- **Purpose:** Track who requested survey links
- **Columns:** Timestamp | Name | Email | Organization | Role | Survey Link | Created By

---

## 🎯 How It Works Now

### User Journey (framework.html)

1. User visits **framework.html**
2. Fills out form:
   - Name: Jane Smith
   - Email: jane@warren.edu
   - Organization: Warren County ESC
   - Role: Director
3. Clicks "Request Assessment"
4. **INSTANTLY:**
   - Survey link generated: `https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu`
   - Link displayed with copy button
   - Request logged to "Assessment Requests" tab
5. Jane copies link and shares with her team

### Team Member Journey (survey.html)

1. Team member clicks Jane's survey link
2. Survey pre-filled with "Warren County ESC"
3. They complete 9 questions
4. Submit → Saved to "Sheet1" with `created_by=jane@warren.edu`

---

## 🔍 What You Can Track

### In "Assessment Requests" tab:
```
Who requested surveys?
When did they request?
What organization?
What was their survey link?
```

### In "Sheet1" tab:
```
All survey responses
Filter by company to see all responses for one org
Filter by created_by to see who generated the survey
```

### Example Query:
- Jane requested a survey on Jan 15, 2025
- Filter Sheet1 by `company="Warren County ESC"` → See all 47 responses
- Email Jane: "Hey! 47 people completed your survey. Ready for your analysis?"

---

## ✅ Testing Checklist

### Test 1: Request Assessment
1. Go to https://learnrudi.com/framework.html
2. Fill out the form
3. Click "Request Assessment"
4. ✅ You should see the survey link instantly
5. ✅ Copy button should work
6. ✅ Check "Assessment Requests" tab in Google Sheets → New row should appear

### Test 2: Take Survey
1. Copy the generated survey link
2. Open it in a new tab
3. ✅ Company name should be pre-filled
4. Fill out the 9 questions
5. Submit
6. ✅ Check "Sheet1" tab in Google Sheets → New row should appear with company and created_by

---

## 🎨 What Changed in framework.html

**Before:**
- Form submission opened email client
- You manually created survey links
- Manual follow-up required

**After:**
- Form submission generates survey link instantly
- Link displayed with copy button
- Auto-saved to Google Sheets
- No manual work needed

**New Features:**
- ✅ Auto-generates survey links
- ✅ Sends request data to Google Sheets
- ✅ Shows beautiful success message with link
- ✅ Copy button for easy sharing
- ✅ Next steps instructions

---

## 🚀 Deploy to Production

Once tested locally:

1. Commit changes:
```bash
cd "/Users/hoff/Desktop/My Drive/dev/projects/rudi-web"
git add framework.html js/config.js SETUP-INSTRUCTIONS.md
git commit -m "Add auto-generated survey links to framework.html"
git push
```

2. Deploy to Vercel (if not auto-deployed):
```bash
vercel --prod
```

3. ✅ Done! Your site is live with the new feature.

---

## 🛟 Troubleshooting

### Survey link not generating?
- Check browser console (F12) for errors
- Make sure `js/config.js` is loaded
- Verify `CONFIG.SHEETS_WEBHOOK_URL` is defined

### Data not saving to Google Sheets?
- Open Apps Script and check "Executions" log
- Make sure "Assessment Requests" sheet tab exists
- Verify webhook URL in `js/config.js` is correct

### Copy button not working?
- Requires HTTPS (works on learnrudi.com, may not work on localhost)
- Fallback: User can manually select and copy the link

---

## 📧 Support

If you have issues:
1. Check browser console (F12)
2. Check Apps Script execution logs
3. Email yourself at hoff@learnrudi.com

---

## 🎉 You're Done!

Your survey system is now **fully automated**:
- ✅ Self-service survey link generation
- ✅ Automatic data tracking
- ✅ No manual admin work
- ✅ Scales to unlimited organizations

Just update the Apps Script and you're ready to go! 🚀
