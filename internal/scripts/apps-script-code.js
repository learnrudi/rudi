/**
 * RUDI Survey - Google Apps Script (Updated with Creator Tracking)
 *
 * INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s
 * 2. Go to: Extensions → Apps Script
 * 3. Delete ALL existing code
 * 4. Copy and paste THIS ENTIRE FILE
 * 5. Click Save (disk icon)
 * 6. Click Deploy → Manage deployments
 * 7. Click the pencil icon (Edit)
 * 8. Under "Version", select "New version"
 * 9. Click "Deploy"
 * 10. Test by running testSubmission() function
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date().toISOString(),
      data.company || '',
      data.age_range || '',
      data.industry_sector || '',
      Array.isArray(data.ai_tools_familiar) ? data.ai_tools_familiar.join(', ') : '',
      data.ai_frequency || '',
      data.organizational_ai_usage || '',
      data.comfort_digital_tools || '',
      Array.isArray(data.ai_concerns) ? data.ai_concerns.join(', ') : '',
      data.sixty_day_priorities || '',
      data.created_by || ''  // NEW: Creator email column
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', message: 'Response recorded'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        company: "Test Company",
        age_range: "35-44",
        industry_sector: "Technology",
        ai_tools_familiar: ["ChatGPT", "Claude (Anthropic)", "GitHub Copilot"],
        ai_frequency: "Daily",
        organizational_ai_usage: "Widespread adoption across teams",
        comfort_digital_tools: "9",
        ai_concerns: ["Data privacy and security", "Job displacement concerns"],
        sixty_day_priorities: "Scaling AI adoption across departments",
        created_by: "test@rudi.com"  // NEW: Include creator in test
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}
