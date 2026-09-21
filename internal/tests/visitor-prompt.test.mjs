import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DISMISSAL_WINDOW_MS,
  CLICK_WINDOW_MS,
  getVisitorPromptDecision,
} from '../../public/js/visitor-prompt.mjs';

test('shows the visitor prompt only after meaningful engagement', () => {
  const base = {
    pathname: '/',
    now: Date.parse('2026-08-26T14:00:00Z'),
    suppressedUntil: 0,
    preview: false,
  };

  assert.equal(
    getVisitorPromptDecision({ ...base, elapsedMs: 44_999, scrollRatio: 0.49 }),
    'wait',
  );
  assert.equal(
    getVisitorPromptDecision({ ...base, elapsedMs: 45_000, scrollRatio: 0 }),
    'show',
  );
  assert.equal(
    getVisitorPromptDecision({ ...base, elapsedMs: 1_000, scrollRatio: 0.5 }),
    'show',
  );
});

test('suppresses the prompt on conversion and legal routes', () => {
  const base = {
    now: Date.parse('2026-08-26T14:00:00Z'),
    suppressedUntil: 0,
    elapsedMs: 45_000,
    scrollRatio: 0,
    preview: false,
  };

  for (const pathname of [
    '/start-here/',
    '/start-here/thanks/',
    '/newsletter/',
    '/privacy.html',
    '/terms.html',
  ]) {
    assert.equal(getVisitorPromptDecision({ ...base, pathname }), 'exclude');
  }
});

test('honors dismissal and click suppression windows', () => {
  const now = Date.parse('2026-08-26T14:00:00Z');
  const base = {
    pathname: '/',
    now,
    elapsedMs: 45_000,
    scrollRatio: 0,
    preview: false,
  };

  assert.equal(
    getVisitorPromptDecision({ ...base, suppressedUntil: now + DISMISSAL_WINDOW_MS }),
    'suppress',
  );
  assert.equal(
    getVisitorPromptDecision({ ...base, suppressedUntil: now + CLICK_WINDOW_MS }),
    'suppress',
  );
  assert.equal(
    getVisitorPromptDecision({ ...base, suppressedUntil: now }),
    'show',
  );
});

test('preview mode bypasses engagement timing and stored suppression', () => {
  const now = Date.parse('2026-08-26T14:00:00Z');

  assert.equal(
    getVisitorPromptDecision({
      pathname: '/',
      now,
      suppressedUntil: now + CLICK_WINDOW_MS,
      elapsedMs: 0,
      scrollRatio: 0,
      preview: true,
    }),
    'show',
  );
});
