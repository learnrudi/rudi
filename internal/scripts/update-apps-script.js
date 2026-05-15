#!/usr/bin/env node

/**
 * RUDI Survey - Update Apps Script Code
 *
 * This script updates your Google Apps Script code to include the "Created By" field
 *
 * Usage:
 *   node update-apps-script.js <SCRIPT_ID>
 *
 * Example:
 *   node update-apps-script.js 1a2b3c4d5e6f7g8h9i0j
 *
 * First time: You'll need to authorize the app in your browser
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Get script ID from command line
const SCRIPT_ID = process.argv[2];

if (!SCRIPT_ID) {
  console.error('❌ Error: Please provide the Apps Script ID');
  console.error('Usage: node update-apps-script.js <SCRIPT_ID>');
  console.error('\nHow to find your Script ID:');
  console.error('1. Open your Google Sheet');
  console.error('2. Extensions → Apps Script');
  console.error('3. Click gear icon (⚙️ Project Settings)');
  console.error('4. Copy the "Script ID"');
  process.exit(1);
}

// Token storage path
const TOKEN_PATH = path.join(__dirname, '..', 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, '..', 'oauth-credentials.json');

// Apps Script code to upload
const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const row = [
      new Date().toISOString(),
      data.company || '',
      data.age_range || '',
      data.industry_sector || '',
      Array.isArray(data.ai_tools_familiar) ? data.ai_tools_familiar.join(', ') : '',
      data.ai_frequency || '',
      data.organizational_ai_usage || '',
      data.comfort_digital_tools || '',
      Array.isArray(data.ai_concerns) ? data.ai_concerns.join(', ') : '',
      data.sixty_day_priorities || '',
      data.created_by || ''  // NEW: Creator email column
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', message: 'Response recorded'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        company: "Test Company",
        age_range: "35-44",
        industry_sector: "Technology",
        ai_tools_familiar: ["ChatGPT", "Claude (Anthropic)", "GitHub Copilot"],
        ai_frequency: "Daily",
        organizational_ai_usage: "Widespread adoption across teams",
        comfort_digital_tools: "9",
        ai_concerns: ["Data privacy and security", "Job displacement concerns"],
        sixty_day_priorities: "Scaling AI adoption across departments",
        created_by: "test@rudi.com"  // NEW: Include creator in test
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}`;

/**
 * Get and store new token after prompting for user authorization
 */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/script.projects'],
  });

  console.log('\n🔐 Authorization required!');
  console.log('Please visit this URL to authorize the application:\n');
  console.log(authUrl);
  console.log('\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    rl.question('Enter the authorization code from the page: ', resolve);
  });
  rl.close();

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Store the token for future use
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('✅ Token stored to', TOKEN_PATH);

  return oAuth2Client;
}

/**
 * Create an OAuth2 client
 */
async function authorize() {
  // Load credentials
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('oauth-credentials.json not found. Please ensure it exists in the project root.');
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have a token stored
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  // Get new token
  return getNewToken(oAuth2Client);
}

/**
 * Update the Apps Script project
 */
async function updateAppsScript() {
  try {
    console.log('🚀 Updating Google Apps Script...\n');

    // Authorize
    console.log('🔑 Authenticating...');
    const auth = await authorize();
    console.log('✅ Authenticated\n');

    // Create script API client
    const script = google.script({ version: 'v1', auth });

    // Get current project content
    console.log('📥 Fetching current Apps Script project...');
    const project = await script.projects.getContent({
      scriptId: SCRIPT_ID,
    });

    console.log('✅ Current project retrieved\n');

    // Update the Code.gs file
    const files = project.data.files || [];
    const codeFile = files.find(f => f.name === 'Code' || f.name === 'Code.gs');

    if (!codeFile) {
      throw new Error('Code.gs file not found in the project');
    }

    console.log('📝 Updating Code.gs...');
    codeFile.source = APPS_SCRIPT_CODE;

    // Push the updated content
    console.log('📤 Pushing updated code to Apps Script...');
    await script.projects.updateContent({
      scriptId: SCRIPT_ID,
      requestBody: {
        files: files,
      },
    });

    console.log('✅ Apps Script updated successfully!\n');

    // Success message
    console.log('🎉 Update complete!\n');
    console.log('Next steps:');
    console.log('1. Open your Google Sheet');
    console.log('2. Go to Extensions → Apps Script');
    console.log('3. You should see the updated code with "data.created_by"');
    console.log('4. Run the testSubmission() function to verify');
    console.log('5. Deploy → Manage deployments → Edit → New version → Deploy\n');
    console.log('✨ Your Apps Script now supports creator tracking!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('invalid_grant')) {
      console.error('\nYour token has expired. Deleting token.json...');
      if (fs.existsSync(TOKEN_PATH)) {
        fs.unlinkSync(TOKEN_PATH);
        console.error('Please run the script again to re-authorize.');
      }
    } else if (error.message.includes('not found')) {
      console.error('\nScript ID not found. Please check:');
      console.error('1. The Script ID is correct');
      console.error('2. You have access to this Apps Script project');
      console.error('3. The project exists');
    } else if (error.code === 'ENOENT') {
      console.error('\nMake sure oauth-credentials.json exists in the project root.');
    }

    process.exit(1);
  }
}

// Run the update
updateAppsScript();
