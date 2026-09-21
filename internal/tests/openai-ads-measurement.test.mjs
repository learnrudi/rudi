import assert from 'node:assert/strict';
import test from 'node:test';

import { initializeOpenAIAdsMeasurement } from '../../public/js/openai-ads-measurement.mjs';
import { storeLeadConversion } from '../../public/js/lead-conversion.mjs';

function createHarness(pixelId = 'pixel_valid_12345') {
  const appendedScripts = [];
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) || null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
  const documentRef = {
    createElement: () => ({}),
    documentElement: { hasAttribute: () => true },
    head: { append: (script) => appendedScripts.push(script) },
    querySelector: () => (pixelId ? { content: pixelId } : null),
  };

  return { appendedScripts, documentRef, storage, windowRef: {} };
}

test('OpenAI Ads pixel initializes and measures a confirmed lead once', () => {
  const harness = createHarness();
  const createdAt = Date.parse('2026-08-20T14:00:00Z');
  storeLeadConversion(harness.storage, {
    eventId: '7b85f0c0-86d7-4c70-a20b-c412cd9c6048',
    createdAt,
  });

  assert.equal(
    initializeOpenAIAdsMeasurement({
      ...harness,
      now: createdAt + 1_000,
    }),
    true,
  );
  assert.deepEqual(harness.appendedScripts, [
    { async: true, src: 'https://bzrcdn.openai.com/sdk/oaiq.min.js' },
  ]);
  assert.deepEqual(harness.windowRef.oaiq.q, [
    ['init', { pixelId: 'pixel_valid_12345' }],
    [
      'measure',
      'lead_created',
      { type: 'customer_action' },
      { event_id: '7b85f0c0-86d7-4c70-a20b-c412cd9c6048' },
    ],
  ]);

  initializeOpenAIAdsMeasurement({ ...harness, now: createdAt + 2_000 });
  assert.equal(harness.windowRef.oaiq.q.filter(([command]) => command === 'measure').length, 1);
});

test('OpenAI Ads pixel stays inactive without a configured pixel ID', () => {
  const harness = createHarness('');
  assert.equal(initializeOpenAIAdsMeasurement(harness), false);
  assert.equal(harness.appendedScripts.length, 0);
  assert.equal(harness.windowRef.oaiq, undefined);
});
