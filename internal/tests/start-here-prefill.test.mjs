import test from 'node:test';
import assert from 'node:assert/strict';

import {
  appendAttributionToUrl,
  parseAttributionParams,
} from '../../public/js/attribution.mjs';
import { parseInquiryParams } from '../../public/js/start-here-prefill.mjs';

test('preserves supported ChatGPT Ads attribution on the inquiry URL', () => {
  const attribution = parseAttributionParams(
    '?utm_source=chatgpt&utm_medium=cpc&utm_campaign=rudi_ai_readiness' +
      '&utm_content=ad-123&campaign_id=campaign-456&ad_group_id=group-789' +
      '&ad_id=ad-123&oppref=gAAAAAb123&unexpected=drop-me',
  );

  assert.deepEqual(attribution, {
    utm_source: 'chatgpt',
    utm_medium: 'cpc',
    utm_campaign: 'rudi_ai_readiness',
    utm_content: 'ad-123',
    campaign_id: 'campaign-456',
    ad_group_id: 'group-789',
    ad_id: 'ad-123',
    oppref: 'gAAAAAb123',
  });

  assert.equal(
    appendAttributionToUrl(
      '/start-here/?interest=ai-readiness#inquiry-form',
      attribution,
      'https://learnrudi.com/how-we-help/ai-readiness/assessment/',
    ),
    'https://learnrudi.com/start-here/?interest=ai-readiness&utm_source=chatgpt&utm_medium=cpc&utm_campaign=rudi_ai_readiness&utm_content=ad-123&campaign_id=campaign-456&ad_group_id=group-789&ad_id=ad-123&oppref=gAAAAAb123#inquiry-form',
  );
});

test('drops malformed or oversized attribution values at the URL boundary', () => {
  assert.deepEqual(
    parseAttributionParams(
      `?utm_source=${'a'.repeat(257)}&utm_medium=cpc%0Ainjected&oppref=valid-token`,
    ),
    { oppref: 'valid-token' },
  );
});

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
