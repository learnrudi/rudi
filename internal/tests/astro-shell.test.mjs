import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outputRoot = path.join(repoRoot, 'dist-astro');

const previewPages = [
  {
    name: 'homepage preview',
    route: '/home-preview/',
    file: path.join(outputRoot, 'home-preview/index.html'),
  },
  {
    name: 'AI enablement preview',
    route: '/ai-enablement-preview/',
    file: path.join(outputRoot, 'ai-enablement-preview/index.html'),
  },
];

const globalNavigationLabels = [
  'How RUDI Helps',
  'Methods',
  'Case Studies',
  'Insights',
  'Resources',
  'About',
];

const serviceLineLabels = [
  'Strategy &amp; Enablement',
  'Applied AI Learning',
  'RUDI Digital Coworkers',
];

function readPage(page) {
  assert.ok(existsSync(page.file), `${page.name} must exist at ${page.file}`);
  return readFileSync(page.file, 'utf8');
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function resolveBuiltRoute(routePath) {
  if (routePath === '/') {
    return path.join(outputRoot, 'index.html');
  }

  const relativePath = routePath.replace(/^\//, '');
  const directPath = path.join(outputRoot, relativePath);

  if (existsSync(directPath) && statSync(directPath).isFile()) {
    return directPath;
  }

  const indexPath = path.join(directPath, 'index.html');
  if (existsSync(indexPath) && statSync(indexPath).isFile()) {
    return indexPath;
  }

  return null;
}

function assertResolvableInternalLinks(page, html) {
  const references = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);

  for (const reference of references) {
    if (
      !reference ||
      reference.startsWith('mailto:') ||
      reference.startsWith('tel:') ||
      /^[a-z][a-z0-9+.-]*:/i.test(reference)
    ) {
      continue;
    }

    const [rawPath, rawFragment = ''] = reference.split('#');
    const [routePath] = rawPath.split('?');
    const targetPath = routePath || page.route;
    const targetFile = resolveBuiltRoute(targetPath);

    assert.ok(targetFile, `${page.name} link ${reference} must resolve in the Astro output`);

    if (rawFragment && rawFragment !== 'top') {
      const targetHtml = readFileSync(targetFile, 'utf8');
      const escapedFragment = rawFragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const anchorPattern = new RegExp(`\\b(?:id|name)=["']${escapedFragment}["']`, 'i');
      assert.match(targetHtml, anchorPattern, `${page.name} link ${reference} must target an existing anchor`);
    }
  }
}

test('Astro previews render the shared global navigation', () => {
  for (const page of previewPages) {
    const html = readPage(page);

    for (const label of globalNavigationLabels) {
      assert.ok(html.includes(label), `${page.name} must include the global navigation label “${label}”`);
    }

    assert.ok(html.includes('Talk with RUDI'), `${page.name} must include the persistent contact action`);
  }
});

test('Astro previews render the shared service-line footer', () => {
  for (const page of previewPages) {
    const html = readPage(page);

    for (const label of serviceLineLabels) {
      assert.ok(html.includes(label), `${page.name} must include the footer label “${label}”`);
    }
  }
});

test('Astro previews remain safe, semantic, and internally routable', () => {
  for (const page of previewPages) {
    const html = readPage(page);

    assert.match(html, /<meta name="robots" content="noindex, nofollow">/i, `${page.name} must remain noindex`);
    assert.equal(countMatches(html, /<header\b/gi), 1, `${page.name} must render one site header`);
    assert.equal(countMatches(html, /<main\b/gi), 1, `${page.name} must render one main landmark`);
    assert.equal(countMatches(html, /<h1\b/gi), 1, `${page.name} must render one primary heading`);
    assert.equal(countMatches(html, /<footer\b/gi), 1, `${page.name} must render one site footer`);
    assertResolvableInternalLinks(page, html);
  }
});
