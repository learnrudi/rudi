#!/usr/bin/env node

/**
 * RUDI Survey - Google Sheets Setup Script
 *
 * This script:
 * 1. Connects to your Google Sheet using the service account
 * 2. Adds the column headers
 * 3. Formats the sheet
 * 4. Verifies the setup
 *
 * Usage:
 *   node setup-sheet.js <SHEET_ID>
 *
 * Example:
 *   node setup-sheet.js 1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Get sheet ID from command line
const SHEET_ID = process.argv[2];

if (!SHEET_ID) {
  console.error('❌ Error: Please provide the Google Sheet ID');
  console.error('Usage: node setup-sheet.js <SHEET_ID>');
  console.error('Example: node setup-sheet.js 1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s');
  process.exit(1);
}

// Column headers
const HEADERS = [
  'Timestamp',
  'Company',
  'Age Range',
  'Industry',
  'AI Tools',
  'AI Frequency',
  'Org AI Usage',
  'Comfort Level',
  'AI Concerns',
  '60-Day Priority'
];

async function setupSheet() {
  try {
    console.log('🚀 Starting Google Sheet setup...\n');

    // Load credentials
    const credentialsPath = path.join(__dirname, 'credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      throw new Error('credentials.json not found. Please ensure it exists in the same directory.');
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log('✅ Loaded service account credentials');
    console.log(`   Email: ${credentials.client_email}\n`);

    // Authenticate
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Authenticated with Google Sheets API\n');

    // Get sheet info
    console.log('📊 Accessing sheet...');
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    console.log(`✅ Connected to: "${sheetInfo.data.properties.title}"`);
    console.log(`   URL: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n`);

    // Check if headers already exist
    console.log('🔍 Checking existing data...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A1:J1',
    });

    const existingHeaders = response.data.values ? response.data.values[0] : [];

    if (existingHeaders.length > 0) {
      console.log('⚠️  Headers already exist:');
      console.log(`   ${existingHeaders.join(' | ')}\n`);

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('   Overwrite existing headers? (y/N): ', resolve);
      });
      readline.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('\n❌ Setup cancelled by user');
        process.exit(0);
      }
      console.log('');
    }

    // Add headers
    console.log('📝 Writing headers to row 1...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'A1:J1',
      valueInputOption: 'RAW',
      resource: {
        values: [HEADERS],
      },
    });
    console.log('✅ Headers added\n');

    // Format headers (bold, background color)
    console.log('🎨 Formatting header row...');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.06,
                    green: 0.16,
                    blue: 0.27,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                    fontSize: 11,
                    bold: true,
                  },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
            },
          },
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
              fields: 'gridProperties.frozenRowCount',
            },
          },
        ],
      },
    });
    console.log('✅ Formatting applied (navy background, white text, frozen row)\n');

    // Auto-resize columns
    console.log('📏 Auto-resizing columns...');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: HEADERS.length,
              },
            },
          },
        ],
      },
    });
    console.log('✅ Columns resized\n');

    // Success message
    console.log('🎉 Setup complete!\n');
    console.log('Next steps:');
    console.log('1. Make sure the sheet is shared with the service account');
    console.log(`   Email: ${credentials.client_email}`);
    console.log('   Permission: Editor\n');
    console.log('2. Set up the Apps Script webhook (see GOOGLE-SHEETS-SETUP.md Step 3)\n');
    console.log('3. Deploy the Apps Script and get the webhook URL\n');
    console.log('4. Update survey.html with the webhook URL\n');
    console.log(`📊 View your sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('insufficient authentication scopes')) {
      console.error('\nThe service account needs Sheets API access.');
      console.error('Make sure you shared the sheet with the service account email.');
    } else if (error.message.includes('The caller does not have permission')) {
      console.error('\nThe sheet needs to be shared with the service account.');
      console.error('Go to your Google Sheet → Share → Add:');
      console.error(`  ${JSON.parse(fs.readFileSync('credentials.json')).client_email}`);
      console.error('  Permission: Editor');
    } else if (error.code === 'ENOENT') {
      console.error('\nMake sure credentials.json exists in the same directory as this script.');
    }

    process.exit(1);
  }
}

// Run the setup
setupSheet();
