import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('visitors can read all five stages on the overview before choosing a detail page', async () => {
  const html = await readFile(new URL('../../public/how-we-help/index.html', import.meta.url), 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const disclosures = [...main.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)].map(m => m[1]);
  assert.equal(disclosures.length, 5, 'all five stages must be expandable in place');
  for (const [index, stage] of ['readiness', 'strategy', 'enablement', 'adoption', 'implementation'].entries()) {
    assert.ok(disclosures[index].includes(`/how-we-help/ai-${stage}/`));
    assert.match(disclosures[index], /<p>[^<]{60,}<\/p>/, 'each stage explains its work without another click');
  }
});
