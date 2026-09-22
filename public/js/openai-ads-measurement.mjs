import { consumeLeadConversion } from './lead-conversion.mjs';

const OPENAI_ADS_SDK_URL = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
const PIXEL_ID_PATTERN = /^[a-z0-9_-]{8,128}$/i;

function readPixelId(documentRef) {
  const value = documentRef.querySelector('meta[name="openai-ads-pixel-id"]')?.content?.trim();
  return value && PIXEL_ID_PATTERN.test(value) ? value : '';
}

function installOpenAIAdsQueue(windowRef, documentRef) {
  if (typeof windowRef.oaiq === 'function') {
    return;
  }

  const queue = (...args) => {
    queue.q.push(args);
  };
  queue.q = [];
  windowRef.oaiq = queue;

  const script = documentRef.createElement('script');
  script.async = true;
  script.src = OPENAI_ADS_SDK_URL;
  documentRef.head.append(script);
}

export function initializeOpenAIAdsMeasurement({
  documentRef,
  windowRef,
  storage,
  now = Date.now(),
}) {
  const pixelId = readPixelId(documentRef);
  if (!pixelId) {
    return false;
  }

  if (!windowRef.__rudiOpenAIAdsInitialized) {
    installOpenAIAdsQueue(windowRef, documentRef);
    windowRef.oaiq('init', { pixelId });
    windowRef.__rudiOpenAIAdsInitialized = true;
  }

  if (!documentRef.documentElement.hasAttribute('data-openai-ads-conversion')) {
    return true;
  }

  let marker = null;
  try {
    marker = consumeLeadConversion(storage, now);
  } catch (error) {
    console.warn('RUDI could not read the lead conversion marker.', error);
  }

  if (marker) {
    windowRef.oaiq(
      'measure',
      'lead_created',
      { type: 'customer_action' },
      { event_id: marker.eventId },
    );
  }

  return true;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initializeOpenAIAdsMeasurement({
    documentRef: document,
    windowRef: window,
    storage: window.sessionStorage,
  });
}
