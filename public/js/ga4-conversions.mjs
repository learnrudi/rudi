const CONVERSION_EVENTS = new Set(['generate_lead', 'newsletter_signup']);
const PRODUCTION_HOSTS = new Set(['learnrudi.com', 'www.learnrudi.com']);

// Send only fixed event names: never pass provider payloads or form fields to GA4.
export async function trackConversion(eventName, windowRef = globalThis.window) {
  if (!CONVERSION_EVENTS.has(eventName)
      || !PRODUCTION_HOSTS.has(windowRef?.location?.hostname)
      || typeof windowRef?.gtag !== 'function') return;

  // Give the tag time to send before an inquiry redirects. Blocked analytics must
  // never hold up a successful form submission or change it into an error.
  await new Promise(resolve => {
    let timeout;
    const finish = () => { windowRef.clearTimeout(timeout); resolve(); };
    timeout = windowRef.setTimeout(finish, 800);
    try {
      windowRef.gtag('event', eventName, {
        send_to: 'G-1WX561P8EV', event_callback: finish, event_timeout: 800,
      });
    } catch {
      finish();
    }
  });
}
