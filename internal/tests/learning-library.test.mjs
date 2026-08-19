import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const libraryHtml = readFileSync(path.join(repoRoot, 'public/learn/index.html'), 'utf8');
const homepageHtml = readFileSync(path.join(repoRoot, 'public/index.html'), 'utf8');
const sharedHeader = readFileSync(path.join(repoRoot, 'public/js/header.js'), 'utf8');
const sharedFooter = readFileSync(path.join(repoRoot, 'public/js/footer.js'), 'utf8');

const expectedVideoIds = new Set([
  '27RjvlXmkRw',
  'Tk-SxtaeSbA',
  'Hi3v4nwxGVw',
  'hWuQeMD2pR4',
  'HrGXwE_Vo1s',
  'x7kq6udvgb8',
  'tktszPnaiRc',
  'NMMPSDr9Bv4',
  '7fhp5zwfzl8',
  'LgAshETu4S8',
  'oHyS2AdAi-o',
  'DWhDaIRXpzk',
  'okeDTmYlkZE',
  'FJaD3x8Mx8E',
  'qqt77ZRm5dg',
  'dneLfxWrS0A',
  'RZ-TFzuhxIY',
  'Z6iuUKlowqo',
  '-zbu2Fwg_Gs',
  'iM45dv9WwsM',
  'hcx8V6DBv1k',
]);

test('learning library exposes the complete verified video catalog', () => {
  const catalogIds = [...libraryHtml.matchAll(/videoId:\s*'([^']+)'/g)].map((match) => match[1]);
  const uniqueCatalogIds = new Set(catalogIds);

  assert.equal(catalogIds.length, 21, 'library must declare exactly 21 lessons');
  assert.equal(uniqueCatalogIds.size, 21, 'every lesson must use a unique YouTube video');
  assert.deepEqual(uniqueCatalogIds, expectedVideoIds, 'library video IDs must match the verified upload catalog');
  assert.doesNotMatch(libraryHtml, /Propel/i, 'project-specific Propel branding must not appear in the RUDI library');
});

test('learning library uses privacy-enhanced embeds and client-ready context', () => {
  assert.match(libraryHtml, /youtube-nocookie\.com\/embed\//);
  assert.match(libraryHtml, /This collection was recorded in 2025/);
  assert.match(libraryHtml, /Bring the learning into your organization/);
  assert.match(libraryHtml, /aria-live="polite"/);
});

test('course player places curriculum controls inside the lesson sidebar', () => {
  const sidebarStart = libraryHtml.indexOf('<aside class="lesson-panel"');
  const sidebarEnd = libraryHtml.indexOf('</aside>', sidebarStart);
  const sidebar = libraryHtml.slice(sidebarStart, sidebarEnd);

  assert.ok(sidebarStart > -1, 'course player must provide a curriculum sidebar');
  assert.match(sidebar, /class="series-tabs"/);
  assert.match(sidebar, /id="lesson-list"/);
  assert.match(libraryHtml, /\.watch-column\s*\{[\s\S]*?grid-column:\s*2;/);
  assert.match(libraryHtml, /\.lesson-panel\s*\{[\s\S]*?grid-column:\s*1;/);
});

test('homepage and shared site chrome link to the learning library', () => {
  for (const [name, content] of [
    ['homepage', homepageHtml],
    ['shared header', sharedHeader],
    ['shared footer', sharedFooter],
  ]) {
    assert.match(content, /href=["']\/learn\//, `${name} must link to /learn/`);
  }
});
