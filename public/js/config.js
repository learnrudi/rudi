/**
 * RUDI Survey Configuration
 *
 * This file contains configuration settings for the survey application.
 * Update these values as needed for your deployment.
 */

const CONFIG = {
    // Google Sheets Apps Script webhook URL
    // This URL receives survey submissions and writes them to the Google Sheet
    SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec',

    // Google Sheet ID for viewing results
    SHEET_ID: '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s',

    // Apps Script Deployment ID
    DEPLOYMENT_ID: 'AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ',

    // Apps Script Project ID (for programmatic updates)
    SCRIPT_ID: '13nQKf61t4euKbUneH-wipwOixVoxNJMGWLP_4mQXQQON-MRyySZAJe8v'
};

// Make CONFIG available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
