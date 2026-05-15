const CONFIG = {
    SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec'
};

async function testAssessmentRequest() {
    console.log('\n📝 TEST 1: Assessment Request (framework.html simulation)');
    console.log('=' .repeat(60));

    const orgName = 'Test Organization';
    const email = 'test@example.com';

    // Generate survey link (same as framework.html)
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

    console.log('\n📤 Sending assessment request...');
    console.log('Data:', JSON.stringify(requestData, null, 2));

    try {
        const response = await fetch(CONFIG.SHEETS_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        // Note: Google Apps Script with no-cors doesn't return response body
        console.log('✅ Request sent! (Status: no-cors mode)');
        console.log('📋 Generated survey link:', surveyLink);
        console.log('\n⚠️  Check "Assessment Requests" tab in Google Sheets:');
        console.log('https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit');

        return surveyLink;

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

async function testSurveyResponse(surveyLink) {
    console.log('\n\n📊 TEST 2: Survey Response (survey.html simulation)');
    console.log('=' .repeat(60));

    // Extract company and creator from survey link (same as survey.html)
    const urlParams = new URLSearchParams(surveyLink.split('?')[1]);
    const company = urlParams.get('company');
    const creator = urlParams.get('creator');

    console.log(`\n📋 Survey link clicked: ${surveyLink}`);
    console.log(`   Company: ${company}`);
    console.log(`   Created by: ${creator}`);

    const surveyData = {
        timestamp: new Date().toISOString(),
        company: company,
        age_range: '35-44',
        industry_sector: 'Technology',
        ai_tools_familiar: ['ChatGPT', 'Claude (Anthropic)'],
        ai_frequency: 'Daily',
        organizational_ai_usage: 'Several pilots across units',
        comfort_digital_tools: '8',
        ai_concerns: ['Data privacy and security', 'Time required to learn new tools'],
        sixty_day_priorities: 'Save staff time on admin & compliance',
        created_by: creator
    };

    console.log('\n📤 Submitting survey response...');
    console.log('Data:', JSON.stringify(surveyData, null, 2));

    try {
        const response = await fetch(CONFIG.SHEETS_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(surveyData)
        });

        console.log('✅ Survey response sent! (Status: no-cors mode)');
        console.log('\n⚠️  Check "Sheet1" tab in Google Sheets:');
        console.log('https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit');
        console.log(`\n🔍 Filter by:`);
        console.log(`   Company = "${company}"`);
        console.log(`   Created By = "${creator}"`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

async function runTests() {
    console.log('\n🚀 RUDI Survey System - Complete Flow Test');
    console.log('=' .repeat(60));
    console.log('This simulates:');
    console.log('1. User requesting assessment on framework.html');
    console.log('2. Team member taking survey via generated link');
    console.log('=' .repeat(60));

    try {
        // Test 1: Assessment Request
        const surveyLink = await testAssessmentRequest();

        // Wait a moment
        console.log('\n⏳ Waiting 2 seconds before survey submission...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 2: Survey Response
        await testSurveyResponse(surveyLink);

        console.log('\n\n✅ ALL TESTS COMPLETED!');
        console.log('=' .repeat(60));
        console.log('\n📊 Verification Steps:');
        console.log('1. Open: https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit');
        console.log('2. Check "Assessment Requests" tab → Should have new row');
        console.log('3. Check "Sheet1" tab → Should have new row');
        console.log('4. Both rows should have matching "Created By" = test@example.com');
        console.log('\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}

// Run tests
runTests();
