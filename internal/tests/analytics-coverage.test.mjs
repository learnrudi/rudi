import assert from 'node:assert/strict';
import test from 'node:test';
import { analyticsErrors } from '../scripts/analytics-coverage.mjs';

const tag = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-1WX561P8EV"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-1WX561P8EV');
</script>`;
const page = (head = '', body = '') => `<html><head>${head}</head><body>${body}</body></html>`;

test('requires the expected GA4 installation on every visitor page, including pages absent from the sitemap', () => {
  assert.deepEqual(analyticsErrors(page(tag), 'start-here/thanks/index.html'), []);
  assert.ok(analyticsErrors(page(), 'start-here/thanks/index.html').length > 0);
});

test('rejects duplicate, conflicting, commented-out, misplaced, or broken tracking', () => {
  const invalid = [
    page(tag + tag),
    page(tag.replaceAll('G-1WX561P8EV', 'G-WRONG12345')),
    page(`<!-- ${tag} -->`),
    page('', tag),
    page(tag.replace("gtag('config', 'G-1WX561P8EV');", '')),
    page(tag.replace('dataLayer.push(arguments);', '')),
    page(tag.replace("gtag('js', new Date());", '')),
    page(tag.replace("'G-1WX561P8EV'", "'G-1WX 561P8EV'")),
    page(tag.replace(' async ', ' ')),
    page(tag + '<script src="https://www.googletagmanager.com/gtm.js?id=GTM-OTHER"></script>'),
    page(tag + '<script>gtag("config", "G-OTHER12345");</script>'),
  ];
  for (const html of invalid) {
    assert.ok(analyticsErrors(html, 'index.html').length > 0, html);
  }
});

test('forbids GA4 on the anonymous survey and embedded charts without overbroad exclusions', () => {
  for (const route of ['survey.html', 'insights/visuals/chart.html']) {
    assert.deepEqual(analyticsErrors(page(), route), []);
    assert.ok(analyticsErrors(page(tag), route).length > 0);
    assert.ok(analyticsErrors(page('<script src="https://www.googletagmanager.com/gtag/js?id=G-1WX561P8EV">'), route).length > 0);
  }
  assert.ok(analyticsErrors(page(), 'guides/survey.html').length > 0);
});
