import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const publicRoot = path.join(repoRoot, 'public');

async function readPublic(relativePath) {
  return readFile(path.join(publicRoot, relativePath), 'utf8');
}

test('AI readiness ad traffic reaches a preselected attributed inquiry form', async () => {
  const [assessmentHtml, startHereHtml] = await Promise.all([
    readPublic('how-we-help/ai-readiness/assessment/index.html'),
    readPublic('start-here/index.html'),
  ]);

  assert.match(assessmentHtml, /class="page-hero paid-landing-hero"/);
  assert.equal(
    [...assessmentHtml.matchAll(/href="\/start-here\/\?interest=ai-readiness#inquiry-form" data-preserve-attribution/g)].length,
    5,
  );
  assert.match(assessmentHtml, /src="\/js\/attribution\.mjs"/);
  assert.match(assessmentHtml, /Relevant engagement evidence/);

  assert.match(startHereHtml, /<form[^>]+id="inquiry-form"[^>]+data-inquiry-form/);
  for (const name of [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'campaign_id',
    'ad_group_id',
    'ad_id',
    'ad_account_id',
    'oppref',
  ]) {
    assert.match(startHereHtml, new RegExp(`name="${name}"`));
  }
  assert.match(startHereHtml, /data-form-status[^>]+role="status"[^>]+aria-live="polite"/);
  assert.match(startHereHtml, /src="\/js\/inquiry-form\.mjs"/);
});

test('successful inquiries have a first-party conversion confirmation route', async () => {
  const thanksHtml = await readPublic('start-here/thanks/index.html');

  assert.match(thanksHtml, /data-openai-ads-conversion/);
  assert.match(thanksHtml, /We received your request/);
  assert.match(thanksHtml, /name="robots" content="noindex,follow"/);
});
