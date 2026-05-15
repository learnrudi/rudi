i# Google Sheets Setup for RUDI Survey

This guide will help you set up Google Sheets to receive and store survey responses.

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: **RUDI Survey Responses**
4. Add these column headers in Row 1:
   ```
   Timestamp | Company | Age Range | Industry | AI Tools | AI Frequency | Org AI Usage | Comfort Level | AI Concerns | 60-Day Priority
   ```

## Step 2: Share with Service Account

1. Click the **Share** button (top right)
2. Add this email with **Editor** access:
   ```
   rudi-survey@graphic-iridium-473318-m1.iam.gserviceaccount.com
   ```
3. Uncheck "Notify people" (it's a service account)
4. Click **Share**

## Step 3: Add Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Prepare the row data
    const row = [
      new Date().toISOString(),                    // Timestamp
      data.company || '',                          // Company
      data.age_range || '',                        // Age Range
      data.industry_sector || '',                  // Industry
      Array.isArray(data.ai_tools_familiar)
        ? data.ai_tools_familiar.join(', ')
        : '',                                      // AI Tools
      data.ai_frequency || '',                     // AI Frequency
      data.organizational_ai_usage || '',          // Org AI Usage
      data.comfort_digital_tools || '',            // Comfort Level
      Array.isArray(data.ai_concerns)
        ? data.ai_concerns.join(', ')
        : '',                                      // AI Concerns
      data.sixty_day_priorities || ''              // 60-Day Priority
    ];

    // Append the row
    sheet.appendRow(row);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Response recorded'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for debugging)
function test() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        company: 'Test Company',
        age_range: '25-34',
        industry_sector: 'Education (PreK-12)',
        ai_tools_familiar: ['ChatGPT', 'Claude (Anthropic)'],
        ai_frequency: 'Weekly',
        organizational_ai_usage: 'Small pilot(s) in one area',
        comfort_digital_tools: '7',
        ai_concerns: ['Time required to learn new tools', 'Reliability or accuracy of AI responses'],
        sixty_day_priorities: 'Staff PD/coaching: create training materials & capture best practices'
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Click the **Save** icon (💾) and name it "Survey Handler"

## Step 4: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Set these options:
   - **Description**: RUDI Survey Endpoint
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access** and follow the prompts
7. **COPY THE WEB APP URL** - it looks like:
   ```
deploymentID=AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ
URL=https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec
   ```

## Step 5: Update Survey Configuration

1. Open `survey.html` in your code editor
2. Find the line that says:
   ```javascript
   const SHEETS_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_APPS_SCRIPT_URL_HERE` with your actual Apps Script URL

## Step 6: Test the Survey

1. Open `survey-admin.html`
2. Create a test survey link
3. Fill out the survey
4. Check your Google Sheet - the response should appear!

## Viewing Results

- Open your Google Sheet anytime to see all responses
- Use Google Sheets built-in features:
  - Sort by company, date, or any column
  - Filter responses
  - Create charts/pivot tables
  - Export to CSV/Excel
  - Share with team members

## Troubleshooting

### Responses not appearing?
1. Check that the service account email has Editor access
2. Verify the Apps Script URL is correct in survey.html
3. Check Apps Script logs: **Executions** tab in Apps Script editor
4. Try running the `test()` function in Apps Script

### Need to update the script?
1. Make changes in Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the edit icon (✏️)
4. Create new version
5. Deploy

## Security Notes

- The Apps Script URL is public but only accepts POST requests
- No authentication is required (survey is anonymous)
- Only you can view the Google Sheet (unless you share it)
- Service account has limited access (just this sheet)

---

**Questions?** Check the survey console for any errors or contact support.
