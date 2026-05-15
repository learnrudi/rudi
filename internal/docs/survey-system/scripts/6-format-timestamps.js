#!/usr/bin/env node
/**
 * Quick Fix: Format Timestamp Columns
 *
 * What this does:
 * - Formats column A as Date/Time in both sheets
 * - Converts ISO string timestamps to proper dates
 *
 * Usage: node 6-format-timestamps.js
 */

const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s';

async function formatTimestamps() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../../credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('\n🕐 Formatting Timestamp Columns\n');

    // Get sheet metadata to find sheet IDs
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SHEET_ID
    });

    const sheetNames = ['Sheet1', 'Assessment Requests'];
    const requests = [];

    // For each sheet, format column A as datetime
    spreadsheet.data.sheets.forEach(sheet => {
        if (sheetNames.includes(sheet.properties.title)) {
            requests.push({
                repeatCell: {
                    range: {
                        sheetId: sheet.properties.sheetId,
                        startColumnIndex: 0, // Column A
                        endColumnIndex: 1
                    },
                    cell: {
                        userEnteredFormat: {
                            numberFormat: {
                                type: 'DATE_TIME',
                                pattern: 'm/d/yyyy h:mm:ss'
                            }
                        }
                    },
                    fields: 'userEnteredFormat.numberFormat'
                }
            });
            console.log(`✅ Formatting ${sheet.properties.title} column A`);
        }
    });

    // Apply formatting
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
            requests: requests
        }
    });

    console.log('\n✅ DONE! All timestamps formatted as Date/Time\n');
    console.log('Refresh your Google Sheet to see the changes.\n');
}

formatTimestamps().catch(console.error);
