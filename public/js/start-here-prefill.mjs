const ALLOWED_INTERESTS = new Set([
  'ai-readiness',
  'ai-strategy',
  'ai-enablement',
  'ai-adoption',
  'ai-implementation',
  'responsible-ai',
  'regional-research',
  'speaking',
]);

const OFFER_LABELS = Object.freeze({
  'printed-edition': 'Printed Editions',
  'printed-field-guide': 'Printed Field Guide',
  'printed-working-edition': 'Printed Working Edition',
  'enablement-kit': 'RUDI Enablement Kit',
  'team-pack': 'Team Pack',
  'facilitated-workshop': 'Facilitated Workshop',
  'enablement-sprint': 'Enablement Sprint',
});

const ALLOWED_SOURCES = new Set(['playbook']);

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
  const attribution = parseInquiryParams(window.location.search);
  const interestSelect = document.getElementById('interest');
  const offerInput = document.getElementById('offer');
  const sourceInput = document.getElementById('source');
  const context = document.querySelector('[data-inquiry-context]');

  if (attribution.interest && interestSelect instanceof HTMLSelectElement) {
    interestSelect.value = attribution.interest;
  }

  if (offerInput instanceof HTMLInputElement) {
    offerInput.value = attribution.offer;
  }

  if (sourceInput instanceof HTMLInputElement) {
    sourceInput.value = attribution.source;
  }

  if (attribution.offerLabel && context instanceof HTMLElement) {
    context.textContent = `You’re asking about the ${attribution.offerLabel}. Add any timing, team size, or implementation context below.`;
    context.hidden = false;
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', applyInquiryPrefill);
}
