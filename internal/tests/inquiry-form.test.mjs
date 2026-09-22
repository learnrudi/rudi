import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildThankYouUrl,
  INQUIRY_STATUS_MESSAGES,
  postInquiry,
} from '../../public/js/inquiry-form.mjs';
import {
  consumeLeadConversion,
  storeLeadConversion,
} from '../../public/js/lead-conversion.mjs';

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

test('inquiry status copy covers pending and retry states', () => {
  assert.deepEqual(INQUIRY_STATUS_MESSAGES, {
    pending: 'Sending your request…',
    error: 'We could not send your request. Please try again, or email rudi@learnrudi.com.',
  });
});

test('thank-you URL stays first-party and preserves validated ad attribution', () => {
  const currentUrl =
    'https://learnrudi.com/start-here/?interest=ai-readiness&utm_source=chatgpt&utm_campaign=rudi_ai_readiness&oppref=opaque-click-ref&unexpected=drop-me';

  assert.equal(
    buildThankYouUrl('/start-here/thanks/', currentUrl),
    'https://learnrudi.com/start-here/thanks/?utm_source=chatgpt&utm_campaign=rudi_ai_readiness&oppref=opaque-click-ref',
  );
  assert.throws(
    () => buildThankYouUrl('https://example.com/thanks/', currentUrl),
    /same origin/,
  );
});

test('inquiry submission uses Formspree JSON mode and rejects unsuccessful responses', async () => {
  const calls = [];
  const body = new FormData();
  body.set('email', 'leader@example.com');

  await postInquiry({
    endpoint: 'https://formspree.io/f/manpzqqe',
    body,
    fetchImpl: async (...args) => {
      calls.push(args);
      return { ok: true };
    },
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'https://formspree.io/f/manpzqqe');
  assert.equal(calls[0][1].method, 'POST');
  assert.equal(calls[0][1].headers.Accept, 'application/json');
  assert.equal(calls[0][1].body, body);

  await assert.rejects(
    postInquiry({
      endpoint: 'https://formspree.io/f/manpzqqe',
      body,
      fetchImpl: async () => ({ ok: false, status: 429 }),
    }),
    /429/,
  );
  await assert.rejects(
    postInquiry({
      endpoint: 'https://example.com/collect',
      body,
      fetchImpl: async () => ({ ok: true }),
    }),
    /Formspree/,
  );
});

test('lead conversion marker is valid once and expires after 30 minutes', () => {
  const storage = createMemoryStorage();
  const createdAt = Date.parse('2026-08-20T14:00:00Z');
  const eventId = '7b85f0c0-86d7-4c70-a20b-c412cd9c6048';

  storeLeadConversion(storage, { eventId, createdAt });
  assert.deepEqual(consumeLeadConversion(storage, createdAt + 60_000), {
    eventId,
    createdAt,
  });
  assert.equal(consumeLeadConversion(storage, createdAt + 60_001), null);

  storeLeadConversion(storage, { eventId, createdAt });
  assert.equal(consumeLeadConversion(storage, createdAt + 30 * 60_000 + 1), null);
});

test('a confirmed inquiry sends one GA4 lead without form contents before navigation', async () => {
  const calls = [];
  let accept;
  const body = new FormData();
  body.set('email', 'private@example.invalid');
  body.set('situation', 'Confidential inquiry');
  const windowRef = {
    location: { hostname: 'learnrudi.com' },
    setTimeout, clearTimeout,
    gtag(...args) { calls.push(args); args[2].event_callback(); },
  };
  const submitted = postInquiry({ endpoint: 'https://formspree.io/f/manpzqqe', body,
    windowRef, fetchImpl: () => new Promise(resolve => { accept = resolve; }) });
  assert.equal(calls.length, 0);
  accept({ ok: true });
  await submitted;
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].slice(0, 2), ['event', 'generate_lead']);
  assert.deepEqual(Object.keys(calls[0][2]).sort(), ['event_callback', 'event_timeout', 'send_to']);
  assert.equal(calls[0][2].send_to, 'G-1WX561P8EV');
  assert.equal(JSON.stringify(calls).includes('private@'), false);
});
