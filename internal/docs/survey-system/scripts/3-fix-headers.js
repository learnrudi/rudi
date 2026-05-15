#!/usr/bin/env node
/**
 * Quick Fix: Repair Sheet Headers
 *
 * What this does:
 * Fixes headers in both Assessment Requests and Sheet1 tabs
 *
 * Usage: node 3-fix-headers.js
 */

const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s';

const CORRECT_HEADERS = {
    'Assessment Requests': [
        'Timestamp', 'Name', 'Email', 'Organization',
        'Role', 'Survey Link', 'Created By'
    ],
    'Sheet1': [
        'Timestamp', 'Company', 'Age Range', 'Industry', 'AI Tools',
        'AI Frequency', 'Org AI Usage', 'Comfort Level',
        'AI Concerns', '60-Day Priority', 'Created By'
    ]
};

async function fixHeaders() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../../credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('\n🔧 Fixing Sheet Headers\n');

    for (const [tabName, headers] of Object.entries(CORRECT_HEADERS)) {
        try {
            const range = `${tabName}!A1:${String.fromCharCode(64 + headers.length)}1`;

            await sheets.spreadsheets.values.update({
                spreadsheetId: SHEET_ID,
                range: range,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [headers]
                }
            });

            console.log(`✅ Fixed ${tabName}`);
            headers.forEach((header, i) => {
                console.log(`   ${String.fromCharCode(65 + i)}1: ${header}`);
            });
            console.log('');

        } catch (error) {
            console.log(`❌ Error fixing ${tabName}: ${error.message}\n`);
        }
    }

    console.log('✅ DONE!\n');
}

fixHeaders();
