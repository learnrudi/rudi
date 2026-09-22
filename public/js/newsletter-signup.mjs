import { trackConversion } from './ga4-conversions.mjs';

const FORM_ID = 'eqbdbx';
const STORAGE_KEY = 'rudi:newsletter:received-until';
const SIGNUP_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;

export function getNewsletterSuppressedUntil(storage) {
  try {
    const value = Number(storage.getItem(STORAGE_KEY));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function bindNewsletterEmbed(frame, { windowRef = window, now = Date.now } = {}) {
  if (frame.dataset.newsletterBound) return;
  frame.dataset.newsletterBound = 'true';
  const measuredSubmissions = new Set();
  const fallbackTimer = windowRef.setTimeout(() => { frame.hidden = true; }, 12_000);
  windowRef.addEventListener('message', (event) => {
    // The provider confirms persistence. Never treat an iframe load or a button click as a signup.
    if (event.origin !== 'https://tally.so' || event.source !== frame.contentWindow) return;
    if (typeof event.data !== 'string') return;
    let message;
    try { message = JSON.parse(event.data); } catch { return; }
    if (message?.payload?.formId !== FORM_ID) return;
    if (message.event === 'Tally.FormLoaded' || message.event === 'Tally.FormSubmitted') {
      windowRef.clearTimeout(fallbackTimer);
      frame.hidden = false;
    }
    if (message.event !== 'Tally.FormSubmitted') return;
    if (typeof message.payload.id !== 'string' || !message.payload.id) return;
    if (measuredSubmissions.has(message.payload.id)) return;
    measuredSubmissions.add(message.payload.id);
    void trackConversion('newsletter_signup', windowRef);
    try {
      // Do not copy subscriber details from the provider event into browser storage or analytics.
      windowRef.localStorage.setItem(STORAGE_KEY, String(now() + SIGNUP_WINDOW_MS));
    } catch {
      // Signup still succeeds when browser storage is blocked.
    }
  });
}

export function initNewsletterEmbeds(root = document, { windowRef = window } = {}) {
  const frames = root.querySelectorAll('[data-newsletter-embed]');
  if (!frames.length) return;
  frames.forEach((frame) => bindNewsletterEmbed(frame, { windowRef }));
  if (windowRef.Tally) {
    windowRef.Tally.loadEmbeds();
    return;
  }
  const documentRef = root.ownerDocument || root;
  if (documentRef.querySelector('script[data-newsletter-widget]')) return;
  const script = documentRef.createElement('script');
  script.src = 'https://tally.so/widgets/embed.js';
  script.async = true;
  script.dataset.newsletterWidget = '';
  script.addEventListener('load', () => windowRef.Tally?.loadEmbeds());
  // The iframe and direct form link still work if the resize script fails to load.
  documentRef.head.append(script);
}

if (typeof document !== 'undefined') initNewsletterEmbeds();
