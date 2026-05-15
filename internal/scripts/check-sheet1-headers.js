const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s';

async function checkHeaders() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Get Sheet1 headers (row 1)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1:K1'
    });

    console.log('\n📊 Sheet1 - Row 1 (Current Headers):');
    console.log('==========================================');

    if (response.data.values && response.data.values[0]) {
      const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
      response.data.values[0].forEach((header, i) => {
        console.log(`  ${columns[i]}1: "${header}"`);
      });
    } else {
      console.log('  ⚠️  No headers found!');
    }

    console.log('\n📋 Expected Headers:');
    console.log('==========================================');
    const expected = [
      'Timestamp',
      'Company',
      'Age Range',
      'Industry',
      'AI Tools',
      'AI Frequency',
      'Org AI Usage',
      'Comfort Level',
      'AI Concerns',
      '60-Day Priority',
      'Created By'
    ];
    expected.forEach((header, i) => {
      const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
      console.log(`  ${columns[i]}1: ${header}`);
    });

    // Check if they match
    console.log('\n✅ Status:');
    console.log('==========================================');
    if (response.data.values && response.data.values[0]) {
      const current = response.data.values[0];
      let allMatch = true;
      expected.forEach((exp, i) => {
        if (current[i] !== exp) {
          console.log(`  ❌ Column ${String.fromCharCode(65 + i)}: "${current[i]}" should be "${exp}"`);
          allMatch = false;
        }
      });
      if (allMatch) {
        console.log('  ✅ All headers are correct!');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkHeaders();
