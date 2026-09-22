export const DISMISSAL_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
export const CLICK_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;

const PROMPT_ID = 'rudi-visitor-prompt';
const STORAGE_KEY = 'rudi:visitor-prompt:suppressed-until';
const PREVIEW_PARAM = 'visitor-prompt';
const PREVIEW_VALUE = 'preview';
const ENGAGEMENT_DELAY_MS = 45_000;
const ENGAGEMENT_SCROLL_RATIO = 0.5;

const EXCLUDED_PATHS = new Set([
  '/newsletter',
  '/newsletter/',
  '/privacy.html',
  '/terms.html',
]);

export function getVisitorPromptDecision({
  pathname,
  now,
  suppressedUntil,
  elapsedMs,
  scrollRatio,
  preview,
}) {
  if (pathname === '/start-here' || pathname.startsWith('/start-here/')) {
    return 'exclude';
  }

  if (EXCLUDED_PATHS.has(pathname)) return 'exclude';
  if (preview) return 'show';
  if (Number.isFinite(suppressedUntil) && suppressedUntil > now) return 'suppress';

  return elapsedMs >= ENGAGEMENT_DELAY_MS || scrollRatio >= ENGAGEMENT_SCROLL_RATIO
    ? 'show'
    : 'wait';
}

function readSuppressedUntil(storage) {
  try {
    const value = Number(storage.getItem(STORAGE_KEY));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function storeSuppressedUntil(storage, value) {
  try {
    storage.setItem(STORAGE_KEY, String(value));
  } catch {
    // A blocked storage preference should never interfere with the page.
  }
}

function getScrollRatio(windowRef, documentRef) {
  const scrollableHeight = documentRef.documentElement.scrollHeight - windowRef.innerHeight;
  if (scrollableHeight <= 0) return 0;
  return Math.min(1, Math.max(0, windowRef.scrollY / scrollableHeight));
}

function ensureStylesheet(documentRef) {
  if (documentRef.querySelector('link[data-visitor-prompt-styles]')) return;

  const stylesheet = documentRef.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/css/visitor-prompt.css';
  stylesheet.dataset.visitorPromptStyles = '';
  documentRef.head.append(stylesheet);
}

function createPrompt(documentRef) {
  const prompt = documentRef.createElement('aside');
  prompt.id = PROMPT_ID;
  prompt.className = 'visitor-prompt';
  prompt.hidden = true;
  prompt.setAttribute('aria-labelledby', `${PROMPT_ID}-title`);
  prompt.innerHTML = `
    <button class="visitor-prompt-close" type="button" aria-label="Dismiss newsletter invitation" data-visitor-prompt-dismiss>×</button>
    <p class="visitor-prompt-eyebrow">RUDI briefing</p>
    <h2 id="${PROMPT_ID}-title">Know what changed.<br>Understand what it means.</h2>
    <p class="visitor-prompt-copy">Free workplace AI updates and practical resources from RUDI. Email signup is coming soon.</p>
    <a class="visitor-prompt-action" href="/newsletter/" data-visitor-prompt-action>About the free newsletter <span aria-hidden="true">→</span></a>
    <button class="visitor-prompt-later" type="button" data-visitor-prompt-dismiss>Not now</button>
  `;
  documentRef.body.append(prompt);
  return prompt;
}

export function initVisitorPrompt({ windowRef = window, documentRef = document } = {}) {
  if (documentRef.getElementById(PROMPT_ID)) return;

  const startedAt = Date.now();
  const preview = new URLSearchParams(windowRef.location.search).get(PREVIEW_PARAM) === PREVIEW_VALUE;
  const storage = windowRef.localStorage;
  const initialDecision = getVisitorPromptDecision({
    pathname: windowRef.location.pathname,
    now: startedAt,
    suppressedUntil: readSuppressedUntil(storage),
    elapsedMs: 0,
    scrollRatio: 0,
    preview,
  });

  if (initialDecision === 'exclude' || initialDecision === 'suppress') return;

  ensureStylesheet(documentRef);
  const prompt = createPrompt(documentRef);
  let visible = false;
  let timerId;

  const emit = (action) => {
    windowRef.dispatchEvent(new CustomEvent('rudi:visitor-prompt', { detail: { action } }));
  };

  const show = () => {
    if (visible) return;
    visible = true;
    windowRef.clearTimeout(timerId);
    windowRef.removeEventListener('scroll', evaluate);
    prompt.hidden = false;
    windowRef.requestAnimationFrame(() => {
      prompt.dataset.visible = 'true';
    });
    emit('shown');
  };

  const dismiss = (reason) => {
    if (!visible) return;
    const windowMs = reason === 'clicked' ? CLICK_WINDOW_MS : DISMISSAL_WINDOW_MS;
    storeSuppressedUntil(storage, Date.now() + windowMs);
    prompt.dataset.visible = 'false';
    visible = false;
    emit(reason);
    windowRef.setTimeout(() => prompt.remove(), 260);
  };

  function evaluate() {
    const decision = getVisitorPromptDecision({
      pathname: windowRef.location.pathname,
      now: Date.now(),
      suppressedUntil: readSuppressedUntil(storage),
      elapsedMs: Date.now() - startedAt,
      scrollRatio: getScrollRatio(windowRef, documentRef),
      preview,
    });

    if (decision === 'show') show();
  }

  prompt.querySelectorAll('[data-visitor-prompt-dismiss]').forEach((button) => {
    button.addEventListener('click', () => dismiss('dismissed'));
  });
  prompt.querySelector('[data-visitor-prompt-action]').addEventListener('click', () => {
    storeSuppressedUntil(storage, Date.now() + CLICK_WINDOW_MS);
    emit('clicked');
  });
  documentRef.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dismiss('dismissed');
  });

  if (initialDecision === 'show') {
    show();
    return;
  }

  timerId = windowRef.setTimeout(evaluate, ENGAGEMENT_DELAY_MS);
  windowRef.addEventListener('scroll', evaluate, { passive: true });
}
