#!/usr/bin/env node
/**
 * Quick Check: Verify Sheet Headers
 *
 * What this does:
 * Checks if both sheet tabs have correct column headers
 *
 * Usage: node 2-check-headers.js
 */

const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s';

const EXPECTED_HEADERS = {
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

async function checkHeaders() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../../credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('\n📊 Checking Sheet Headers\n');

    for (const [tabName, expectedHeaders] of Object.entries(EXPECTED_HEADERS)) {
        console.log(`${tabName}:`);
        console.log('='.repeat(50));

        try {
            const range = `${tabName}!A1:${String.fromCharCode(64 + expectedHeaders.length)}1`;
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: range
            });

            const currentHeaders = response.data.values?.[0] || [];
            let allMatch = true;

            expectedHeaders.forEach((expected, i) => {
                const current = currentHeaders[i] || '';
                const col = String.fromCharCode(65 + i);
                if (current === expected) {
                    console.log(`  ✅ ${col}1: ${expected}`);
                } else {
                    console.log(`  ❌ ${col}1: "${current}" (should be "${expected}")`);
                    allMatch = false;
                }
            });

            if (allMatch) {
                console.log('  ✅ All headers correct!\n');
            } else {
                console.log('  ⚠️  Some headers need fixing\n');
            }

        } catch (error) {
            console.log(`  ❌ Error: ${error.message}\n`);
        }
    }
}

checkHeaders();
