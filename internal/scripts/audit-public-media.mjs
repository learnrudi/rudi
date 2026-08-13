import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const publicRoot = path.join(repoRoot, 'public');

const mediaExtensions = new Set([
  '.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mov', '.mp3', '.mp4', '.ogg',
  '.pdf', '.png', '.svg', '.wav', '.webm', '.webp',
]);
const publicTextExtensions = new Set(['.css', '.html', '.js', '.json', '.mjs', '.xml']);
const internalTextExtensions = new Set(['.cjs', '.css', '.html', '.js', '.json', '.md', '.mjs', '.py', '.txt', '.xml']);

function walkFiles(directory, predicate, results = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '__pycache__') {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, results);
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function isMedia(filePath) {
  return mediaExtensions.has(path.extname(filePath).toLowerCase());
}

const mediaFiles = walkFiles(publicRoot, isMedia).sort();
const mediaSet = new Set(mediaFiles.map((filePath) => path.resolve(filePath)));
const mediaByBasename = new Map();
for (const mediaFile of mediaFiles) {
  const basename = path.basename(mediaFile);
  const matches = mediaByBasename.get(basename) || [];
  matches.push(mediaFile);
  mediaByBasename.set(basename, matches);
}

const publicSurfaces = walkFiles(publicRoot, (filePath) => publicTextExtensions.has(path.extname(filePath).toLowerCase()));
const internalSurfaces = [
  ...walkFiles(path.join(repoRoot, 'internal/config'), (filePath) => internalTextExtensions.has(path.extname(filePath).toLowerCase())),
  ...walkFiles(path.join(repoRoot, 'internal/scripts'), (filePath) => internalTextExtensions.has(path.extname(filePath).toLowerCase())),
];
const surfaces = [...new Set([...publicSurfaces, ...internalSurfaces])].sort();
const references = new Map(mediaFiles.map((filePath) => [path.resolve(filePath), new Set()]));

function lineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

function candidatePaths(sourceFile, rawReference) {
  let raw = rawReference.trim().replace(/^['"`]|['"`]$/g, '');
  raw = raw.replace(/&amp;/g, '&').split('#')[0].split('?')[0];
  if (!raw || raw.startsWith('data:')) return [];

  try {
    raw = decodeURIComponent(raw);
  } catch {
    // Preserve malformed URL text for the remaining checks.
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (url.hostname !== 'learnrudi.com' && url.hostname !== 'www.learnrudi.com') return [];
      raw = url.pathname;
    } catch {
      return [];
    }
  } else if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) {
    return [];
  }

  const candidates = [];
  const sourceIsPublic = sourceFile.startsWith(`${publicRoot}${path.sep}`);
  if (raw.startsWith('/')) {
    candidates.push(path.join(publicRoot, raw.slice(1)));
  } else if (raw.startsWith('public/')) {
    candidates.push(path.join(repoRoot, raw));
  } else {
    if (sourceIsPublic) candidates.push(path.resolve(path.dirname(sourceFile), raw));
    candidates.push(path.join(publicRoot, raw));
  }

  if (!raw.includes('/') && mediaByBasename.get(raw)?.length === 1) {
    candidates.push(mediaByBasename.get(raw)[0]);
  }

  return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
}

function recordReference(sourceFile, content, matchIndex, rawReference, kind) {
  for (const candidate of candidatePaths(sourceFile, rawReference)) {
    if (!mediaSet.has(candidate)) continue;
    references.get(candidate).add(`${relative(sourceFile)}:${lineNumber(content, matchIndex)} (${kind}: ${rawReference})`);
  }
}

const patterns = [
  ['HTML attribute', /\b(?:content|href|poster|src)=['"]([^'"]+)['"]/gi],
  ['srcset', /\bsrcset=['"]([^'"]+)['"]/gi],
  ['CSS url', /url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/gi],
  ['quoted media path', /(['"`])([^'"`\n]+?\.(?:avif|gif|ico|jpe?g|mov|mp3|mp4|ogg|pdf|png|svg|wav|webm|webp)(?:[?#][^'"`\n]*)?)\1/gi],
];

for (const surface of surfaces) {
  const content = readFileSync(surface, 'utf8');
  for (const [kind, pattern] of patterns) {
    pattern.lastIndex = 0;
    for (const match of content.matchAll(pattern)) {
      if (kind === 'srcset') {
        for (const entry of match[1].split(',')) {
          recordReference(surface, content, match.index, entry.trim().split(/\s+/)[0], kind);
        }
      } else {
        recordReference(surface, content, match.index, match[2] || match[1], kind);
      }
    }
  }
}

const tracked = new Set(
  execFileSync('git', ['ls-files', '-z', '--', 'public'], { cwd: repoRoot, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean),
);

const candidates = [];
const referencedMedia = [];
for (const mediaFile of mediaFiles) {
  const evidence = [...references.get(path.resolve(mediaFile))].sort();
  if (evidence.length > 0) {
    referencedMedia.push({ path: relative(mediaFile), referenceCount: evidence.length, evidence });
    continue;
  }
  const content = readFileSync(mediaFile);
  const publicPath = relative(mediaFile);
  candidates.push({
    path: publicPath,
    bytes: statSync(mediaFile).size,
    sha256: createHash('sha256').update(content).digest('hex'),
    tracked: tracked.has(publicPath),
    recoverability: tracked.has(publicPath)
      ? 'tracked in Git; recoverable from repository history'
      : 'untracked; not recoverable from Git unless preserved before deletion',
    referenceCount: 0,
    evidence: 'No reference found in scanned public HTML/CSS/JavaScript/metadata or internal metadata/generator surfaces.',
  });
}

const surfaceCounts = {};
for (const surface of surfaces) {
  const key = surface.startsWith(`${publicRoot}${path.sep}`)
    ? `public${path.extname(surface).toLowerCase() || '(no extension)'}`
    : `internal${path.extname(surface).toLowerCase() || '(no extension)'}`;
  surfaceCounts[key] = (surfaceCounts[key] || 0) + 1;
}

const summary = {
  generatedAt: new Date().toISOString(),
  mediaFileCount: mediaFiles.length,
  referencedMediaCount: mediaFiles.length - candidates.length,
  candidateCount: candidates.length,
  candidateBytes: candidates.reduce((total, candidate) => total + candidate.bytes, 0),
  scanSurfaceCount: surfaces.length,
  surfaceCounts,
};

console.log(JSON.stringify({ summary, candidates, referencedMedia }, null, 2));
