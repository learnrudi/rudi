#!/usr/bin/env node
/**
 * Quick Test: Webhook Health Check
 *
 * What this does:
 * Tests if the Google Apps Script webhook is responding
 *
 * Usage: node 4-test-webhook.js
 */

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec';

async function testWebhook() {
    console.log('\n🔍 Testing Webhook Health\n');
    console.log('URL:', WEBHOOK_URL);
    console.log('='.repeat(60), '\n');

    try {
        const response = await fetch(WEBHOOK_URL, { method: 'GET' });
        const text = await response.text();

        // Try to parse as JSON
        try {
            const json = JSON.parse(text);
            console.log('✅ Webhook is responding!');
            console.log('Response:', JSON.stringify(json, null, 2));
        } catch (e) {
            if (text.includes('<HTML>') || text.includes('<!DOCTYPE')) {
                console.log('❌ Webhook returning HTML instead of JSON');
                console.log('⚠️  This means deployment is NOT set to "Web app" mode');
                console.log('\nFix:');
                console.log('1. Apps Script → Deploy → Manage deployments');
                console.log('2. Edit deployment → Who has access: "Anyone"');
                console.log('3. Deploy as Web app\n');
            } else {
                console.log('Response:', text);
            }
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testWebhook();
