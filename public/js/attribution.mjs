export const ATTRIBUTION_FIELDS = Object.freeze([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'campaign_id',
  'ad_group_id',
  'ad_id',
  'ad_account_id',
  'oppref',
]);

const MAX_ATTRIBUTION_VALUE_LENGTH = 256;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

function isValidAttributionValue(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_ATTRIBUTION_VALUE_LENGTH &&
    !CONTROL_CHARACTER_PATTERN.test(value)
  );
}

export function parseAttributionParams(search) {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const attribution = {};

  for (const field of ATTRIBUTION_FIELDS) {
    const value = params.get(field);
    if (isValidAttributionValue(value)) {
      attribution[field] = value;
    }
  }

  return attribution;
}

export function appendAttributionToUrl(destination, attribution, baseUrl) {
  const destinationUrl = new URL(destination, baseUrl);
  const trustedBase = new URL(baseUrl);

  if (destinationUrl.origin !== trustedBase.origin) {
    return destination;
  }

  for (const field of ATTRIBUTION_FIELDS) {
    const value = attribution[field];
    if (isValidAttributionValue(value)) {
      destinationUrl.searchParams.set(field, value);
    }
  }

  return destinationUrl.href;
}

export function applyAttributionToLinks(root, currentUrl) {
  const sourceUrl = new URL(currentUrl);
  const attribution = parseAttributionParams(sourceUrl.searchParams);

  if (Object.keys(attribution).length === 0) {
    return;
  }

  root.querySelectorAll('[data-preserve-attribution]').forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    link.href = appendAttributionToUrl(link.href, attribution, sourceUrl.href);
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  applyAttributionToLinks(document, window.location.href);
}
