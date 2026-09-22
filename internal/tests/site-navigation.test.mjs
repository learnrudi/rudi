import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

async function pages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = await Promise.all(entries.map(entry => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    return entry.isDirectory() ? pages(url) : url.pathname.endsWith('.html') ? [url] : [];
  }));
  return children.flat();
}

test('every page exposes four navigation groups and direct service and learning links without JavaScript', async () => {
  for (const file of await pages(new URL('../../public/', import.meta.url))) {
    const html = await readFile(file, 'utf8');
    // These are iframe payloads, not independent site pages. Chrome consumes
    // their fixed-height chart area and makes the embedded diagrams unusable.
    if (file.pathname.includes('/insights/visuals/')) {
      assert.doesNotMatch(html, /class="rudi-header"|class="rudi-footer"|\/js\/site-navigation\.js/);
      continue;
    }
    const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] || '';
    for (const label of ['How We Help', 'Our Work', 'Learn &amp; Resources', 'About']) {
      assert.ok(header.includes(`>${label}<`), `${file.pathname} is missing ${label}`);
    }
    const paths = [...header.matchAll(/href="([^"]+)"/g)].map(match => new URL(match[1], 'https://learnrudi.com').pathname);
    for (const href of [
      '/how-we-help/ai-readiness/assessment/',
      '/how-we-help/ai-enablement/workforce-programs/',
      '/how-we-help/managed-digital-workers/',
      '/learn/', '/insights/rudi-daily/', '/start-here/',
    ]) assert.ok(paths.includes(href), `${file.pathname} is missing ${href}`);
    assert.match(header, /<details\b[^>]*class="rudi-mobile"/, 'mobile navigation must work without JavaScript');
    assert.match(header, /aria-label="Primary navigation"/);
  }
});
