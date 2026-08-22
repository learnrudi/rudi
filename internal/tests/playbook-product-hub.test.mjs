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

test('publishes the current playbook structure and commercial offer ladder', () => {
  assert.match(hubHtml, /43-page/);
  assert.match(hubHtml, /19(?:-| )sheet/);
  assert.match(hubHtml, /15 worksheets/);
  assert.match(hubHtml, /Digital Playbook/);
  assert.match(hubHtml, /Printed Field Guide/);
  assert.match(hubHtml, /\$49(?:–|-|&ndash;)\$69/);
  assert.match(hubHtml, /Printed Working Edition/);
  assert.match(hubHtml, /\$69(?:–|-|&ndash;)\$99/);
  assert.match(hubHtml, /RUDI Enablement Kit/);
  assert.match(hubHtml, /\$195(?:–|-|&ndash;)\$495/);
  assert.match(hubHtml, /Team Pack/);
  assert.match(hubHtml, /10(?:–|-|&ndash;)25 books/);
  assert.match(hubHtml, /\$1,000(?:–|-|&ndash;)\$3,000/);
  assert.match(hubHtml, /Facilitated Workshop/);
  assert.match(hubHtml, /\$2,500(?:–|-|&ndash;)\$7,500/);
  assert.match(hubHtml, /Enablement Sprint/);
  assert.match(hubHtml, /\$7,500\+/);
  assert.match(hubHtml, /worksheet index and references, but not the full worksheet pages/i);
  assert.doesNotMatch(hubHtml, /Printed Worksheet Toolkit/);
  assert.doesNotMatch(hubHtml, /Working Bundle/);
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

test('routes each paid offer through attributed inquiries', () => {
  for (const offer of [
    'printed-field-guide',
    'printed-working-edition',
    'enablement-kit',
    'team-pack',
    'facilitated-workshop',
    'enablement-sprint',
  ]) {
    assert.match(hubHtml, new RegExp(`\\?offer=${offer}(?:&amp;|&)source=playbook`));
  }
});

test('links to all individual worksheet pages as well as the full toolkit PDF', () => {
  const baseUrl = 'https://learnrudi.github.io/workplace-ai-enablement-playbook/';
  for (const worksheet of [
    'appendix-01-council-charter.html',
    'appendix-02-council-membership.html',
    'appendix-03-decision-rights-matrix.html',
    'appendix-04-readiness-survey.html',
    'appendix-05-training-agenda.html',
    'appendix-06-5d-interview-guide.html',
    'appendix-07-workflow-inventory.html',
    'appendix-08-task-decomposition.html',
    'appendix-09-4a-classification.html',
    'appendix-10-respect-assessment.html',
    'appendix-11-vendor-evaluation-rubric.html',
    'appendix-12-use-case-prioritization.html',
    'appendix-13-pilot-charter.html',
    'appendix-14-adoption-dashboard.html',
    'appendix-15-capacity-maturity.html',
  ]) {
    assert.match(hubHtml, new RegExp(`${baseUrl}${worksheet}`));
  }
});
