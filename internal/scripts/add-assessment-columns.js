const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s';
const TAB_NAME = 'Assessment Requests';

async function addColumns() {
  // Load service account credentials
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Column headers
  const headers = [
    'Timestamp',
    'Name',
    'Email',
    'Organization',
    'Role',
    'Survey Link',
    'Created By'
  ];

  try {
    // Add headers to row 1
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${TAB_NAME}!A1:G1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers]
      }
    });

    console.log('✅ Column headers added successfully!');
    console.log('\nHeaders added:');
    headers.forEach((header, i) => {
      console.log(`  ${String.fromCharCode(65 + i)}1: ${header}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Unable to parse range')) {
      console.error('\n⚠️  Make sure the "Assessment Requests" tab exists in your Google Sheet!');
    }
  }
}

addColumns();
