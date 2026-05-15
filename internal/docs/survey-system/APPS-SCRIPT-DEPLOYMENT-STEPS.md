# Apps Script Deployment - Step-by-Step Fix

## The Error You're Seeing:
```
Error: TypeError: Cannot read properties of undefined (reading 'postData')
```

**This means:** The deployment isn't configured to accept POST requests (web app mode).

---

## 🔧 Complete Fix (5 minutes)

### Step 1: Open Apps Script
1. Go to: https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit
2. Click **Extensions → Apps Script**

### Step 2: Replace Code
1. **Select all existing code** (Cmd+A / Ctrl+A)
2. **Delete it**
3. **Paste this code:**

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

4. Click **Save** (💾 icon or Cmd+S)

### Step 3: Deploy as Web App (IMPORTANT!)

**If you have an existing deployment:**

1. Click **Deploy** (top right)
2. Click **Manage deployments**
3. Click **✏️ Edit** on your existing deployment
4. **IMPORTANT:** Check these settings:
   - **Execute as:** Me (your-email@gmail.com)
   - **Who has access:** Anyone ⚠️ **MUST BE "Anyone"**
5. Click **Update**

**If you DON'T have a deployment yet:**

1. Click **Deploy** (top right)
2. Click **New deployment**
3. Click **⚙️ gear icon** → Select type: **Web app**
4. **Settings:**
   - Description: "RUDI Survey API v2"
   - Execute as: **Me** (your-email@gmail.com)
   - Who has access: **Anyone** ⚠️ **CRITICAL**
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → Go to [project name] (unsafe)
9. Click **Allow**
10. Copy the **Web app URL** (should be the same as before)

### Step 4: Test the Deployment

**Test GET request:**
```bash
curl -X GET "https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec"
```

**Expected response:**
```json
{"status":"success","message":"RUDI Survey API is running"}
```

**If you see HTML error instead of JSON, the deployment isn't set to "Anyone"!**

### Step 5: Run Full Test

```bash
cd "/Users/hoff/Desktop/My Drive/dev/projects/rudi-web"
node scripts/test-survey-flow.js
```

**Then check:**
1. "Assessment Requests" tab → Should have "Test Organization"
2. "Sheet1" tab → Should have "Test Organization" response

---

## 🔍 Troubleshooting

### "postData is undefined"
- **Cause:** Deployment not set to web app or "Who has access" is not "Anyone"
- **Fix:** Follow Step 3 above, ensure "Anyone" access

### "Assessment Requests sheet not found"
- **Cause:** Sheet tab doesn't exist or has wrong name
- **Fix:** Create tab named exactly "Assessment Requests" (case-sensitive)

### "Script function not found: doGet"
- **Cause:** Code not deployed or old version cached
- **Fix:** Clear cache, redeploy as "New version"

### Data not appearing in sheets
- **Check:** Apps Script Executions log
  - Apps Script editor → Click "Executions" (left sidebar)
  - See if requests are coming in
  - Check error messages

---

## ✅ Success Checklist

- [ ] Code pasted and saved
- [ ] Deployed as Web app
- [ ] "Who has access" = Anyone
- [ ] "Execute as" = Me
- [ ] GET test returns JSON (not HTML)
- [ ] Test script runs without errors
- [ ] Data appears in both sheets

---

## 🎯 Key Settings

**MUST BE:**
- **Type:** Web app
- **Execute as:** Me
- **Who has access:** Anyone ⬅️ **THIS IS CRITICAL**

**If "Who has access" is NOT "Anyone", POST requests won't work!**
