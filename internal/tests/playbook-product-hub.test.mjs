import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const hubHtml = readFileSync(
  path.join(repoRoot, 'public/insights/workplace-ai-enablement-playbook/index.html'),
  'utf8',
);

test('publishes the finalized playbook and worksheet print contract', () => {
  assert.match(hubHtml, /43-page/);
  assert.match(hubHtml, /19(?:-| )sheet/);
  assert.match(hubHtml, /15 worksheets/);
  assert.match(hubHtml, /Printed Field Guide/);
  assert.match(hubHtml, /Printed Worksheet Toolkit/);
  assert.match(hubHtml, /Working Bundle/);
  assert.doesNotMatch(hubHtml, /Working Edition/);
});

test('links directly to both free downloadable PDFs', () => {
  assert.match(
    hubHtml,
    /https:\/\/learnrudi\.github\.io\/workplace-ai-enablement-playbook\/pdf\/workplace-ai-enablement-playbook\.pdf/,
  );
  assert.match(
    hubHtml,
    /https:\/\/learnrudi\.github\.io\/workplace-ai-enablement-playbook\/pdf\/toolkit-appendices\.pdf/,
  );
});

test('routes each finalized physical offer through attributed inquiries', () => {
  for (const offer of ['printed-field-guide', 'worksheet-toolkit', 'working-bundle']) {
    assert.match(hubHtml, new RegExp(`\\?offer=${offer}(?:&amp;|&)source=playbook`));
  }
});
