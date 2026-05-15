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
  'assessment.html',
  'camp-claude.html',
  'capabilities.html',
  'certificates-business.html',
  'certificates-education.html',
  'certificates.html',
  'consulting.html',
  'contact.html',
  'founder-profile.pdf',
  'founder.html',
  'framework.html',
  'get-certificate.html',
  'index.html',
  'nsf-techaccess.html',
  'ohio.html',
  'partners.html',
  'prompting.html',
  'research.html',
  'resources.html',
  'robots.txt',
  'sitemap.xml',
  'state-partners.html',
  'studio.html',
  'survey-admin.html',
  'survey.html',
  'training.html',
]);
const allowedPublicRootDirectories = new Set([
  'assets',
  'case-studies',
  'css',
  'images',
  'insights',
  'js',
  'webinars',
]);

function addError(message) {
  errors.push(message);
}

function existsAsFileOrDirectory(targetPath) {
  return existsSync(targetPath);
}

function resolveUrlReference(sourceFile, rawReference) {
  if (
    !rawReference ||
    rawReference.startsWith('#') ||
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

  const [withoutHash] = rawReference.split('#');
  const [withoutQuery] = withoutHash.split('?');
  if (!withoutQuery || withoutQuery === '/') {
    return path.join(publicRoot, 'index.html');
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
    return path.join(basePath, 'index.html');
  }

  return basePath;
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
  const referencePattern = /\b(?:href|src)=["']([^"']+)["']|\bqrImagePath:\s*["']([^"']+)["']/gi;

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');
    for (const match of html.matchAll(referencePattern)) {
      const reference = match[1] || match[2];
      const targetPath = resolveUrlReference(htmlFile, reference);
      if (!targetPath) {
        continue;
      }

      if (!existsAsFileOrDirectory(targetPath)) {
        const source = path.relative(repoRoot, htmlFile);
        const target = path.relative(repoRoot, targetPath);
        addError(`${source} references missing local asset: ${reference} -> ${target}`);
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
