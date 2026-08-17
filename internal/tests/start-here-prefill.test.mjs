import test from 'node:test';
import assert from 'node:assert/strict';

import { parseInquiryParams } from '../../public/js/start-here-prefill.mjs';

test('captures a recognized playbook offer and source', () => {
  assert.deepEqual(
    parseInquiryParams('?offer=team-pack&source=playbook'),
    {
      interest: 'ai-enablement',
      offer: 'team-pack',
      offerLabel: 'Team Pack',
      source: 'playbook',
    },
  );
});

test('captures each finalized physical playbook offer', () => {
  const offers = new Map([
    ['printed-field-guide', 'Printed Field Guide'],
    ['worksheet-toolkit', 'Worksheet Toolkit'],
    ['working-bundle', 'Working Bundle'],
  ]);

  for (const [offer, offerLabel] of offers) {
    assert.deepEqual(
      parseInquiryParams(`?offer=${offer}&source=playbook`),
      {
        interest: 'ai-enablement',
        offer,
        offerLabel,
        source: 'playbook',
      },
    );
  }
});

test('preserves a recognized explicit interest', () => {
  assert.equal(
    parseInquiryParams('?interest=ai-strategy&offer=enablement-sprint&source=playbook').interest,
    'ai-strategy',
  );
});

test('drops unrecognized attribution values at the URL boundary', () => {
  assert.deepEqual(
    parseInquiryParams('?interest=anything&offer=anything&source=anything'),
    {
      interest: '',
      offer: '',
      offerLabel: '',
      source: '',
    },
  );
});
