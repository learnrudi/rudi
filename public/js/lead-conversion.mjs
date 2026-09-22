export const LEAD_CONVERSION_STORAGE_KEY = 'rudi:lead-created';

const MAX_MARKER_AGE_MS = 30 * 60 * 1000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidMarker(value) {
  return (
    value &&
    typeof value === 'object' &&
    UUID_PATTERN.test(value.eventId) &&
    Number.isFinite(value.createdAt)
  );
}

export function storeLeadConversion(storage, marker) {
  if (!storage || !isValidMarker(marker)) {
    throw new TypeError('A valid lead conversion marker and storage are required.');
  }

  storage.setItem(LEAD_CONVERSION_STORAGE_KEY, JSON.stringify(marker));
}

export function consumeLeadConversion(storage, now = Date.now()) {
  if (!storage) {
    return null;
  }

  const rawMarker = storage.getItem(LEAD_CONVERSION_STORAGE_KEY);
  storage.removeItem(LEAD_CONVERSION_STORAGE_KEY);

  if (!rawMarker) {
    return null;
  }

  try {
    const marker = JSON.parse(rawMarker);
    const age = now - marker.createdAt;
    return isValidMarker(marker) && age >= 0 && age <= MAX_MARKER_AGE_MS ? marker : null;
  } catch {
    return null;
  }
}
