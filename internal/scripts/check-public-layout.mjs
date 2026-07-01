import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const publicRoot = path.join(repoRoot, 'public');
const errors = [];

const requiredPublicFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'css/styles.css',
  'js/header.js',
  'js/footer.js',
  'js/main.js',
];

const forbiddenPublicEntries = ['archive', 'docs', 'internal', 'scripts', 'tools'];
const allowedPublicRootFiles = new Set([
  'about.html',
  'ai-training.html',
  'camp-claude.html',
  'capabilities.html',
  'consulting.html',
  'contact.html',
  'founder-profile.pdf',
  'founder.html',
  'framework.html',
  'index.html',
  'ohio.html',
  'openai-codex-enablement.html',
  'partners.html',
  'privacy.html',
  'prompting.html',
  'robots.txt',
  'sitemap.xml',
  'survey.html',
  'terms.html',
  'training.html',
]);
const allowedPublicRootDirectories = new Set([
  'ai-training',
  'assets',
  'case-studies',
  'css',
  'images',
  'insights',
  'js',
]);

function addError(message) {
  errors.push(message);
}

function existsAsRoutableTarget(targetPath) {
  if (!existsSync(targetPath)) {
    return false;
  }

  const targetStats = statSync(targetPath);
  if (targetStats.isFile()) {
    return true;
  }

  if (targetStats.isDirectory()) {
    const indexPath = path.join(targetPath, 'index.html');
    return existsSync(indexPath) && statSync(indexPath).isFile();
  }

  return false;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveUrlReference(sourceFile, rawReference) {
  if (
    !rawReference ||
    rawReference === '#' ||
    rawReference.startsWith('//') ||
    rawReference.startsWith('data:') ||
    rawReference.startsWith('mailto:') ||
    rawReference.startsWith('tel:') ||
    rawReference.startsWith('javascript:') ||
    /^[a-z][a-z0-9+.-]*:/i.test(rawReference)
  ) {
    return null;
  }

  if (rawReference.startsWith('/_vercel/')) {
    return null;
  }

  const [withoutHash, rawFragment] = rawReference.split('#');
  const [withoutQuery] = withoutHash.split('?');
  let fragment = rawFragment ? rawFragment.split('?')[0] : '';
  try {
    fragment = decodeURIComponent(fragment);
  } catch {
    // Keep the original string if it is not valid URI encoding.
  }

  if (!withoutQuery) {
    return { targetPath: sourceFile, fragment };
  }

  if (withoutQuery === '/') {
    return { targetPath: path.join(publicRoot, 'index.html'), fragment };
  }

  let referencePath = withoutQuery;
  try {
    referencePath = decodeURIComponent(referencePath);
  } catch {
    // Keep the original string if it is not valid URI encoding.
  }

  const basePath = referencePath.startsWith('/')
    ? path.join(publicRoot, referencePath.slice(1))
    : path.resolve(path.dirname(sourceFile), referencePath);

  if (referencePath.endsWith('/')) {
    return { targetPath: path.join(basePath, 'index.html'), fragment };
  }

  return { targetPath: basePath, fragment };
}

function hasHtmlAnchor(targetPath, fragment) {
  if (!fragment || fragment === 'top' || path.extname(targetPath) !== '.html') {
    return true;
  }

  const html = readFileSync(targetPath, 'utf8');
  const anchorPattern = new RegExp(`\\b(?:id|name)=["']${escapeRegExp(fragment)}["']`, 'i');
  return anchorPattern.test(html);
}

function walkFiles(directory, predicate, results = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, results);
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }

  return results;
}

if (!existsSync(publicRoot)) {
  addError('Missing public/ directory.');
} else {
  for (const requiredFile of requiredPublicFiles) {
    const targetPath = path.join(publicRoot, requiredFile);
    if (!existsSync(targetPath) || !statSync(targetPath).isFile()) {
      addError(`Missing required public file: public/${requiredFile}`);
    }
  }

  for (const forbiddenEntry of forbiddenPublicEntries) {
    const targetPath = path.join(publicRoot, forbiddenEntry);
    if (existsSync(targetPath)) {
      addError(`Internal folder should not be deployable: public/${forbiddenEntry}`);
    }
  }

  for (const entry of readdirSync(publicRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && !allowedPublicRootDirectories.has(entry.name)) {
      addError(`Unexpected public root directory: public/${entry.name}`);
    }

    if (entry.isFile() && !allowedPublicRootFiles.has(entry.name)) {
      addError(`Unexpected public root file: public/${entry.name}`);
    }
  }

  for (const dsStoreFile of walkFiles(publicRoot, (filePath) => path.basename(filePath) === '.DS_Store')) {
    addError(`Remove macOS metadata file from public output: ${path.relative(repoRoot, dsStoreFile)}`);
  }

  const htmlFiles = walkFiles(publicRoot, (filePath) => filePath.endsWith('.html'));
  const jsFiles = walkFiles(publicRoot, (filePath) => filePath.endsWith('.js'));
  const referenceFiles = [...htmlFiles, ...jsFiles];
  const referencePattern = /\b(?:href|src)=["']([^"']+)["']|\bqrImagePath:\s*["']([^"']+)["']/gi;

  for (const referenceFile of referenceFiles) {
    const content = readFileSync(referenceFile, 'utf8');
    for (const match of content.matchAll(referencePattern)) {
      const reference = match[1] || match[2];
      const resolvedReference = resolveUrlReference(referenceFile, reference);
      if (!resolvedReference) {
        continue;
      }

      const { targetPath, fragment } = resolvedReference;
      if (!existsAsRoutableTarget(targetPath)) {
        const source = path.relative(repoRoot, referenceFile);
        const target = path.relative(repoRoot, targetPath);
        addError(`${source} references missing local asset: ${reference} -> ${target}`);
        continue;
      }

      if (!hasHtmlAnchor(targetPath, fragment)) {
        const source = path.relative(repoRoot, referenceFile);
        const target = path.relative(repoRoot, targetPath);
        addError(`${source} references missing local anchor: ${reference} -> ${target}#${fragment}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Static site layout check failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Static site layout check passed.');
