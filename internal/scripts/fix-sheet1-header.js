const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s';

async function fixHeader() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Fix just column A1 to say "Timestamp"
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['Timestamp']]
      }
    });

    console.log('✅ Fixed Sheet1 A1 header to "Timestamp"');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixHeader();
