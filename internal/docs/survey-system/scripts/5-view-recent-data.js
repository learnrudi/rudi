#!/usr/bin/env node
/**
 * Quick View: Recent Survey Data
 *
 * What this does:
 * Shows the 5 most recent entries from both sheets
 *
 * Usage: node 5-view-recent-data.js
 */

const { google } = require('googleapis');
const path = require('path');

const SHEET_ID = '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s';

async function viewRecentData() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../../../credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('\n📊 Recent Survey Data\n');

    // Assessment Requests
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Assessment Requests!A:G'
        });

        const rows = response.data.values || [];
        console.log('Assessment Requests (Last 5):');
        console.log('='.repeat(60));

        if (rows.length > 1) {
            const recent = rows.slice(-5).reverse();
            recent.forEach((row, i) => {
                if (i === 0 && row[0] === 'Timestamp') return; // Skip header
                console.log(`${i + 1}. ${row[3]} (${row[2]}) - ${row[0]}`);
            });
        } else {
            console.log('  No data yet');
        }
        console.log('');

    } catch (error) {
        console.log('❌ Error:', error.message, '\n');
    }

    // Survey Responses
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1!A:K'
        });

        const rows = response.data.values || [];
        console.log('Survey Responses (Last 5):');
        console.log('='.repeat(60));

        if (rows.length > 1) {
            const recent = rows.slice(-5).reverse();
            recent.forEach((row, i) => {
                if (i === 0 && row[0] === 'Timestamp') return; // Skip header
                console.log(`${i + 1}. ${row[1]} - Age: ${row[2]}, Comfort: ${row[7]}/10 - ${row[0]}`);
            });
        } else {
            console.log('  No data yet');
        }
        console.log('');

    } catch (error) {
        console.log('❌ Error:', error.message, '\n');
    }
}

viewRecentData();
