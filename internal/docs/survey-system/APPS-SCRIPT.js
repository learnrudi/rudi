/**
 * RUDI Survey - Google Apps Script
 *
 * PURPOSE:
 * Receives POST requests from framework.html and survey.html
 * Routes data to appropriate Google Sheets tabs based on submission type
 *
 * SHEET STRUCTURE:
 * - "Assessment Requests" tab: Tracks who requested survey links
 * - "Sheet1" tab: Stores actual survey responses
 *
 * DEPLOYMENT:
 * Script ID: 13nQKf61t4euKbUneH-wipwOixVoxNJMGWLP_4mQXQQON-MRyySZAJe8v
 * Webhook URL: https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec
 *
 * LAST UPDATED: October 2025
 */

/**
 * Main entry point for POST requests
 * Handles two types of submissions:
 * 1. Assessment Requests (type: 'assessment_request') from framework.html
 * 2. Survey Responses (all other submissions) from survey.html
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Determine submission type based on presence of 'type' field
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
 *
 * SOURCE: framework.html
 * DESTINATION: "Assessment Requests" sheet tab
 *
 * COLUMNS:
 * A: Timestamp - When request was made
 * B: Name - Requester's full name
 * C: Email - Requester's email address
 * D: Organization - Organization/company name
 * E: Role - Requester's job title
 * F: Survey Link - Generated survey URL
 * G: Created By - Requester's email (duplicate for filtering)
 */
function handleAssessmentRequest(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Assessment Requests');

  if (!sheet) {
    throw new Error('Assessment Requests sheet not found. Please create it first.');
  }

  // Prepare row data matching column structure
  const row = [
    new Date(data.timestamp || new Date()),  // A: Timestamp
    data.name || '',                          // B: Name
    data.email || '',                         // C: Email
    data.organization || '',                  // D: Organization
    data.role || '',                          // E: Role
    data.surveyLink || '',                    // F: Survey Link
    data.email || ''                          // G: Created By
  ];

  // Append to sheet
  sheet.appendRow(row);

  Logger.log('Assessment request saved: ' + data.organization + ' (' + data.email + ')');

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Assessment request saved'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle Survey Response submission
 *
 * SOURCE: survey.html
 * DESTINATION: "Sheet1" tab (Survey Responses)
 *
 * COLUMNS:
 * A: Timestamp - When survey was submitted
 * B: Company - Organization name (from URL param)
 * C: Age Range - Respondent's age group
 * D: Industry - Industry sector
 * E: AI Tools - Comma-separated list of familiar AI tools
 * F: AI Frequency - How often they use AI
 * G: Org AI Usage - Organization's AI adoption status
 * H: Comfort Level - 0-10 scale of digital tool comfort
 * I: AI Concerns - Comma-separated list of concerns
 * J: 60-Day Priority - Top priority to solve
 * K: Created By - Email of person who created the survey link
 */
function handleSurveyResponse(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Sheet1');

  if (!sheet) {
    throw new Error('Sheet1 not found. This is the main survey responses sheet.');
  }

  // Prepare row data matching column structure
  const row = [
    new Date(data.timestamp || new Date()),   // A: Timestamp
    data.company || '',                        // B: Company
    data.age_range || '',                      // C: Age Range
    data.industry_sector || '',                // D: Industry
    Array.isArray(data.ai_tools_familiar)
      ? data.ai_tools_familiar.join(', ')
      : '',                                    // E: AI Tools (CSV)
    data.ai_frequency || '',                   // F: AI Frequency
    data.organizational_ai_usage || '',        // G: Org AI Usage
    data.comfort_digital_tools || '',          // H: Comfort Level
    Array.isArray(data.ai_concerns)
      ? data.ai_concerns.join(', ')
      : '',                                    // I: AI Concerns (CSV)
    data.sixty_day_priorities || '',           // J: 60-Day Priority
    data.created_by || ''                      // K: Created By
  ];

  // Append to sheet
  sheet.appendRow(row);

  Logger.log('Survey response saved for: ' + data.company + ' (created by: ' + data.created_by + ')');

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Survey response saved'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle GET requests (for testing)
 *
 * USAGE:
 * curl -X GET "https://script.google.com/macros/s/.../exec"
 *
 * RETURNS:
 * {"status":"success","message":"RUDI Survey API is running"}
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'RUDI Survey API is running',
    version: '2.0',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * DEPLOYMENT INSTRUCTIONS:
 *
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit
 * 2. Go to Extensions → Apps Script
 * 3. Delete existing code
 * 4. Paste this entire file
 * 5. Click Save (💾)
 * 6. Click Deploy → Manage deployments
 * 7. Click pencil icon (✏️) on existing deployment
 * 8. Change "Version" to "New version"
 * 9. Click Deploy
 * 10. Webhook URL stays the same - no code changes needed in website files
 *
 * TESTING:
 *
 * 1. Test GET request:
 *    curl -X GET "https://script.google.com/macros/s/.../exec"
 *
 * 2. Test Assessment Request:
 *    Visit framework.html and submit the form
 *    Check "Assessment Requests" tab for new row
 *
 * 3. Test Survey Response:
 *    Use generated survey link from step 2
 *    Complete survey and submit
 *    Check "Sheet1" tab for new row
 *
 * TROUBLESHOOTING:
 *
 * - Check execution logs: Apps Script → Executions (left sidebar)
 * - Verify sheet tab names: "Assessment Requests" and "Sheet1"
 * - Check permissions: Script should have access to spreadsheet
 * - Test with browser console (F12) to see error messages
 */
