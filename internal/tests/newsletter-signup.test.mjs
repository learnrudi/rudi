import assert from 'node:assert/strict';
import test from 'node:test';
import { bindNewsletterEmbed, getNewsletterSuppressedUntil } from '../../public/js/newsletter-signup.mjs';

test('only a confirmed submission from the newsletter frame suppresses future invitations', () => {
  const listeners = new Map();
  const saved = new Map();
  const frame = { contentWindow: {}, dataset: {} };
  const windowRef = {
    addEventListener: (name, listener) => listeners.set(name, listener),
    setTimeout: () => 1, clearTimeout: () => {},
    localStorage: { setItem: (key, value) => saved.set(key, value), getItem: (key) => saved.get(key) },
  };
  bindNewsletterEmbed(frame, { windowRef, now: () => 1000 });
  const message = listeners.get('message');
  const valid = { origin: 'https://tally.so', source: frame.contentWindow,
    data: JSON.stringify({ event: 'Tally.FormSubmitted', payload: { formId: 'eqbdbx', id: 'submission-1', fields: [{ answer: { value: 'qa@example.invalid' } }] } }) };
  for (const invalid of [
    { ...valid, origin: 'https://example.com' },
    { ...valid, source: {} },
    { ...valid, data: 'not json' },
    { ...valid, data: null },
    { ...valid, data: JSON.stringify({ event: 'Tally.FormLoaded', payload: { formId: 'eqbdbx' } }) },
    { ...valid, data: JSON.stringify({ event: 'Tally.FormSubmitted', payload: { formId: 'another', id: '1' } }) },
    { ...valid, data: JSON.stringify({ event: 'Tally.FormSubmitted', payload: { formId: 'eqbdbx' } }) },
  ]) message(invalid);
  assert.equal(saved.size, 0);
  message(valid);
  assert.equal(getNewsletterSuppressedUntil(windowRef.localStorage), 1000 + 90 * 86400000);
  assert.equal([...saved.values()].some(value => value.includes('@')), false);
});

test('a blocked embed gives way to its direct signup link and recovers on a valid load', () => {
  let message, timeout;
  const frame = { contentWindow: {}, dataset: {}, hidden: false };
  const windowRef = {
    addEventListener: (name, listener) => { message = listener; },
    setTimeout: (callback) => { timeout = callback; return 1; },
    clearTimeout: () => {},
  };
  bindNewsletterEmbed(frame, { windowRef });
  timeout();
  assert.equal(frame.hidden, true);
  message({ origin: 'https://other.example', source: frame.contentWindow, data: JSON.stringify({ event: 'Tally.FormLoaded', payload: { formId: 'eqbdbx' } }) });
  assert.equal(frame.hidden, true);
  message({ origin: 'https://tally.so', source: frame.contentWindow, data: JSON.stringify({ event: 'Tally.FormLoaded', payload: { formId: 'eqbdbx' } }) });
  assert.equal(frame.hidden, false);
});
