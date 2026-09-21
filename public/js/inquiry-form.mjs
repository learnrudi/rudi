import { appendAttributionToUrl, parseAttributionParams } from './attribution.mjs';
import { storeLeadConversion } from './lead-conversion.mjs';

const FORMSPREE_HOSTNAME = 'formspree.io';

export const INQUIRY_STATUS_MESSAGES = Object.freeze({
  pending: 'Sending your request…',
  error: 'We could not send your request. Please try again, or email rudi@learnrudi.com.',
});

export function buildThankYouUrl(destination, currentUrl) {
  const sourceUrl = new URL(currentUrl);
  const destinationUrl = new URL(destination, sourceUrl);

  if (destinationUrl.origin !== sourceUrl.origin) {
    throw new TypeError('The thank-you URL must use the same origin.');
  }

  return appendAttributionToUrl(
    destinationUrl.href,
    parseAttributionParams(sourceUrl.searchParams),
    sourceUrl.href,
  );
}

export async function postInquiry({ endpoint, body, fetchImpl = fetch }) {
  const endpointUrl = new URL(endpoint);
  if (endpointUrl.protocol !== 'https:' || endpointUrl.hostname !== FORMSPREE_HOSTNAME) {
    throw new TypeError('Inquiry submissions must use the configured Formspree endpoint.');
  }

  const response = await fetchImpl(endpointUrl.href, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Formspree rejected the inquiry with status ${response.status}.`);
  }
}

function createEventId(cryptoApi) {
  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }

  throw new Error('This browser cannot create a secure conversion event identifier.');
}

async function handleInquirySubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  if (!(form instanceof HTMLFormElement) || form.getAttribute('aria-busy') === 'true') {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-form-status]');
  const originalButtonText = submitButton?.textContent || '';

  form.setAttribute('aria-busy', 'true');
  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  }
  if (status instanceof HTMLElement) {
    status.classList.remove('form-status-error');
    status.textContent = INQUIRY_STATUS_MESSAGES.pending;
    status.hidden = false;
  }

  try {
    await postInquiry({
      endpoint: form.action,
      body: new FormData(form),
    });

    try {
      storeLeadConversion(window.sessionStorage, {
        eventId: createEventId(window.crypto),
        createdAt: Date.now(),
      });
    } catch (error) {
      console.warn('RUDI could not retain the conversion event marker.', error);
    }

    const thankYouUrl = form.dataset.thankYouUrl;
    window.location.assign(buildThankYouUrl(thankYouUrl, window.location.href));
  } catch (error) {
    console.error('RUDI inquiry submission failed.', error);
    form.removeAttribute('aria-busy');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
    if (status instanceof HTMLElement) {
      status.textContent = INQUIRY_STATUS_MESSAGES.error;
      status.classList.add('form-status-error');
      status.hidden = false;
    }
  }
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-inquiry-form]').forEach((form) => {
    form.addEventListener('submit', handleInquirySubmit);
  });
}
