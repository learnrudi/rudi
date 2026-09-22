import assert from 'node:assert/strict';
import test from 'node:test';
import { trackConversion } from '../../public/js/ga4-conversions.mjs';
import { postInquiry } from '../../public/js/inquiry-form.mjs';

function browser(gtag) {
  return { location: { hostname: 'learnrudi.com' }, setTimeout, clearTimeout, gtag };
}

test('failed inquiries never become GA4 leads', async () => {
  const calls = [];
  const windowRef = browser((...args) => calls.push(args));
  for (const fetchImpl of [async () => ({ ok: false, status: 422 }),
    async () => { throw new Error('Network unavailable'); }]) {
    await assert.rejects(postInquiry({ endpoint: 'https://formspree.io/f/manpzqqe',
      body: new FormData(), fetchImpl, windowRef }));
  }
  assert.equal(calls.length, 0);
});

test('conversion events are limited to production and the two fixed business outcomes', async () => {
  const calls = [];
  const windowRef = browser((...args) => { calls.push(args); args[2].event_callback(); });
  for (const hostname of ['localhost', '127.0.0.1', 'learnrudi-preview.vercel.app', 'learnrudi.com.attacker.invalid']) {
    await trackConversion('generate_lead', { ...windowRef, location: { hostname } });
  }
  await trackConversion('arbitrary_private_data', windowRef);
  await trackConversion('generate_lead', undefined);
  assert.equal(calls.length, 0);
  await trackConversion('newsletter_signup', windowRef);
  assert.equal(calls.length, 1);
});

test('missing, throwing, or nonresponsive analytics never fails a successful inquiry', async () => {
  for (const gtag of [undefined, () => { throw new Error('Blocked'); }]) {
    await postInquiry({ endpoint: 'https://formspree.io/f/manpzqqe', body: new FormData(),
      fetchImpl: async () => ({ ok: true }), windowRef: browser(gtag) });
  }
  let expire, timeoutMs, completed = false;
  const windowRef = { ...browser(() => {}),
    setTimeout: (callback, milliseconds) => { expire = callback; timeoutMs = milliseconds; return 1; },
    clearTimeout: () => {},
  };
  const delivery = trackConversion('generate_lead', windowRef).then(() => { completed = true; });
  await Promise.resolve();
  assert.equal(completed, false);
  assert.equal(timeoutMs, 800);
  expire();
  await delivery;
  assert.equal(completed, true);
});
