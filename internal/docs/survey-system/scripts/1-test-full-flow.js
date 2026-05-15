#!/usr/bin/env node
/**
 * Quick Test: Complete Survey Flow
 *
 * What this does:
 * 1. Simulates assessment request (framework.html)
 * 2. Simulates survey response (survey.html)
 * 3. Sends both to Google Sheets
 *
 * Usage: node 1-test-full-flow.js
 */

const CONFIG = {
    SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec'
};

async function testAssessmentRequest() {
    console.log('\n📝 TEST 1: Assessment Request');
    console.log('='.repeat(50));

    const orgName = 'Test Organization';
    const email = 'test@example.com';
    const surveyLink = `https://learnrudi.com/survey.html?company=${encodeURIComponent(orgName)}&creator=${encodeURIComponent(email)}`;

    const requestData = {
        type: 'assessment_request',
        timestamp: new Date().toISOString(),
        name: 'Test User',
        email: email,
        organization: orgName,
        role: 'Test Manager',
        surveyLink: surveyLink
    };

    await fetch(CONFIG.SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    });

    console.log('✅ Assessment request sent');
    console.log('📋 Survey link:', surveyLink);
    return surveyLink;
}

async function testSurveyResponse(surveyLink) {
    console.log('\n📊 TEST 2: Survey Response');
    console.log('='.repeat(50));

    const urlParams = new URLSearchParams(surveyLink.split('?')[1]);
    const surveyData = {
        timestamp: new Date().toISOString(),
        company: urlParams.get('company'),
        age_range: '35-44',
        industry_sector: 'Technology',
        ai_tools_familiar: ['ChatGPT', 'Claude (Anthropic)'],
        ai_frequency: 'Daily',
        organizational_ai_usage: 'Several pilots across units',
        comfort_digital_tools: '8',
        ai_concerns: ['Data privacy and security'],
        sixty_day_priorities: 'Save staff time on admin',
        created_by: urlParams.get('creator')
    };

    await fetch(CONFIG.SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
    });

    console.log('✅ Survey response sent');
}

async function run() {
    console.log('\n🚀 RUDI Survey - Full Flow Test\n');
    const surveyLink = await testAssessmentRequest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testSurveyResponse(surveyLink);
    console.log('\n✅ DONE! Check Google Sheets:\n');
    console.log('https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit\n');
}

run();
