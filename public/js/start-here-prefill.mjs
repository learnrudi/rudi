import { ATTRIBUTION_FIELDS, parseAttributionParams } from './attribution.mjs';

const ALLOWED_INTERESTS = new Set([
  'ai-readiness',
  'ai-strategy',
  'ai-enablement',
  'ai-adoption',
  'ai-implementation',
  'responsible-ai',
  'regional-research',
  'speaking',
  'team-workflows',
  'ai-workspace-management',
]);

const OFFER_LABELS = Object.freeze({
  'printed-edition': 'Printed Editions',
  'printed-field-guide': 'Printed Field Guide',
  'worksheet-toolkit': 'Worksheet Toolkit',
  'working-bundle': 'Working Bundle',
  'enablement-kit': 'Enablement Kit',
  'team-pack': 'Team Pack',
  'facilitated-workshop': 'Facilitated Workshop',
  'enablement-sprint': 'Enablement Sprint',
  'q4-team-program': 'Q4 Team Program',
});

const ALLOWED_SOURCES = new Set(['playbook', 'q4-2026']);

export function parseInquiryParams(search) {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const requestedInterest = params.get('interest') || '';
  const requestedOffer = params.get('offer') || '';
  const requestedSource = params.get('source') || '';
  const offer = Object.hasOwn(OFFER_LABELS, requestedOffer) ? requestedOffer : '';

  return {
    interest: ALLOWED_INTERESTS.has(requestedInterest)
      ? requestedInterest
      : offer
        ? 'ai-enablement'
        : '',
    offer,
    offerLabel: offer ? OFFER_LABELS[offer] : '',
    source: ALLOWED_SOURCES.has(requestedSource) ? requestedSource : '',
  };
}

function applyInquiryPrefill() {
  const inquiry = parseInquiryParams(window.location.search);
  const attribution = parseAttributionParams(window.location.search);
  const form = document.querySelector('[data-inquiry-form]');
  const interestSelect = document.getElementById('interest');
  const offerInput = document.getElementById('offer');
  const sourceInput = document.getElementById('source');
  const context = document.querySelector('[data-inquiry-context]');

  if (inquiry.interest && interestSelect instanceof HTMLSelectElement) {
    interestSelect.value = inquiry.interest;
  }

  if (offerInput instanceof HTMLInputElement) {
    offerInput.value = inquiry.offer;
  }

  if (sourceInput instanceof HTMLInputElement) {
    sourceInput.value = inquiry.source;
  }

  if (inquiry.offerLabel && context instanceof HTMLElement) {
    context.textContent = `You’re asking about the ${inquiry.offerLabel}. Add any timing, team size, or implementation context below.`;
    context.hidden = false;
  }

  if (form instanceof HTMLFormElement) {
    for (const field of ATTRIBUTION_FIELDS) {
      const input = form.elements.namedItem(field);
      if (input instanceof HTMLInputElement) {
        input.value = attribution[field] || '';
      }
    }
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', applyInquiryPrefill);
}
