#!/usr/bin/env node

/**
 * RUDI Survey - Add "Created By" Column
 *
 * This script adds the "Created By" column to your existing Google Sheet
 *
 * Usage:
 *   node add-creator-column.js <SHEET_ID>
 *
 * Example:
 *   node add-creator-column.js 1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Get sheet ID from command line
const SHEET_ID = process.argv[2];

if (!SHEET_ID) {
  console.error('❌ Error: Please provide the Google Sheet ID');
  console.error('Usage: node add-creator-column.js <SHEET_ID>');
  console.error('Example: node add-creator-column.js 1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s');
  process.exit(1);
}

async function addCreatorColumn() {
  try {
    console.log('🚀 Adding "Created By" column to Google Sheet...\n');

    // Load credentials
    const credentialsPath = path.join(__dirname, '..', 'credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      throw new Error('credentials.json not found. Please ensure it exists in the project root.');
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

    // Check current headers
    console.log('🔍 Checking current headers...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A1:K1',
    });

    const existingHeaders = response.data.values ? response.data.values[0] : [];
    console.log(`   Current headers (${existingHeaders.length}): ${existingHeaders.join(' | ')}\n`);

    // Check if "Created By" already exists
    if (existingHeaders.includes('Created By')) {
      console.log('✅ "Created By" column already exists!\n');
      console.log('No changes needed. Your sheet is up to date.');
      process.exit(0);
    }

    // Add "Created By" to column K
    console.log('📝 Adding "Created By" to column K...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'K1',
      valueInputOption: 'RAW',
      resource: {
        values: [['Created By']],
      },
    });
    console.log('✅ Column added\n');

    // Format the new header (match existing formatting)
    console.log('🎨 Formatting new header...');
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
                startColumnIndex: 10, // Column K (0-indexed)
                endColumnIndex: 11,
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
        ],
      },
    });
    console.log('✅ Formatting applied (navy background, white text)\n');

    // Auto-resize column K
    console.log('📏 Auto-resizing column K...');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 10, // Column K
                endIndex: 11,
              },
            },
          },
        ],
      },
    });
    console.log('✅ Column resized\n');

    // Success message
    console.log('🎉 Sheet updated successfully!\n');
    console.log('⚠️  IMPORTANT: You still need to manually update the Apps Script');
    console.log('   Follow these steps:\n');
    console.log('   1. Open your Google Sheet');
    console.log('   2. Go to Extensions → Apps Script');
    console.log('   3. Find this line in doPost():');
    console.log('      data.sixty_day_priorities || \'\'');
    console.log('   4. Add this line after it:');
    console.log('      data.created_by || \'\'  // NEW: Add creator email');
    console.log('   5. Update testSubmission() to include created_by field');
    console.log('   6. Click Save');
    console.log('   7. Deploy → Manage deployments → Edit → New version → Deploy\n');
    console.log(`📊 View your sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('insufficient authentication scopes')) {
      console.error('\nThe service account needs Sheets API access.');
      console.error('Make sure you shared the sheet with the service account email.');
    } else if (error.message.includes('The caller does not have permission')) {
      console.error('\nThe sheet needs to be shared with the service account.');
      console.error('Go to your Google Sheet → Share → Add the service account email');
    } else if (error.code === 'ENOENT') {
      console.error('\nMake sure credentials.json exists in the project root.');
    }

    process.exit(1);
  }
}

// Run the script
addCreatorColumn();
