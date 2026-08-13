import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const publicRoot = path.join(repoRoot, 'public');
const baseUrl = new URL(process.argv[2] || 'http://127.0.0.1:8080/');

function walkHtml(directory, results = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walkHtml(fullPath, results);
    else if (entry.name.endsWith('.html')) results.push(fullPath);
  }
  return results;
}

function routeForFile(filePath) {
  const relative = path.relative(publicRoot, filePath).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function localUrl(rawReference, sourceUrl) {
  if (!rawReference || rawReference === '#' || rawReference.startsWith('data:')) return null;
  if (/^(?:mailto|tel|javascript):/i.test(rawReference) || rawReference.startsWith('//')) return null;

  let resolved;
  try {
    resolved = new URL(rawReference, sourceUrl);
  } catch {
    return null;
  }
  if (resolved.origin !== baseUrl.origin) return null;
  if (resolved.pathname.startsWith('/_vercel/')) return null;
  resolved.hash = '';
  return resolved;
}

const queued = new Map();
for (const htmlFile of walkHtml(publicRoot)) {
  const url = new URL(routeForFile(htmlFile), baseUrl);
  queued.set(url.href, { url, discoveredFrom: 'HTML inventory' });
}

const failures = [];
const visited = new Set();
let htmlResponses = 0;
let assetResponses = 0;

while (true) {
  const batch = [...queued.values()].filter(({ url }) => !visited.has(url.href)).slice(0, 16);
  if (batch.length === 0) break;

  await Promise.all(batch.map(async ({ url, discoveredFrom }) => {
    visited.add(url.href);
    let response;
    try {
      response = await fetch(url, { redirect: 'manual' });
    } catch (error) {
      failures.push(`${url.href} (${discoveredFrom}): request failed: ${error.message}`);
      return;
    }

    if (response.status !== 200) {
      failures.push(`${url.href} (${discoveredFrom}): HTTP ${response.status}`);
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      await response.arrayBuffer();
      assetResponses += 1;
      return;
    }

    htmlResponses += 1;
    const html = await response.text();
    const referencePattern = /\b(?:href|poster|src)=['"]([^'"]+)['"]/gi;
    for (const match of html.matchAll(referencePattern)) {
      const target = localUrl(match[1], url);
      if (!target || queued.has(target.href)) continue;
      queued.set(target.href, { url: target, discoveredFrom: url.pathname });
    }
  }));
}

if (failures.length > 0) {
  console.error('Local public crawl failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Local public crawl passed: ${htmlResponses} HTML responses, ${assetResponses} asset responses, ${visited.size} unique local URLs.`);
