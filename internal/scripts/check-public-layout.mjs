import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const publicRoot = path.join(repoRoot, 'public');
const vercelConfigPath = path.join(repoRoot, 'vercel.json');
const errors = [];

const requiredPublicFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'css/styles.css',
  'css/rudi-2026.css',
  'js/header.js',
  'js/footer.js',
  'js/main.js',
  'js/rudi-2026.js',
  'js/start-here-prefill.mjs',
  'js/legacy-positioning.js',
  'images/workplace-ai-enablement-playbook-cover.webp',
  'images/workplace-ai-enablement-playbook-social.png',
  'og.png',
];

const coreArchitectureFiles = [
  'index.html',
  'about.html',
  'how-we-help/index.html',
  'how-we-help/ai-readiness/index.html',
  'how-we-help/ai-readiness/assessment/index.html',
  'how-we-help/ai-strategy/index.html',
  'how-we-help/ai-enablement/index.html',
  'how-we-help/ai-enablement/workforce-programs/index.html',
  'how-we-help/ai-adoption/index.html',
  'how-we-help/ai-implementation/index.html',
  'approach/index.html',
  'approach/human-centered-ai/index.html',
  'approach/responsible-ai/index.html',
  'approach/rudi-method/index.html',
  'case-studies/index.html',
  'case-studies/enterprise-ai-adoption-strategy/index.html',
  'case-studies/warren-county-esc.html',
  'insights/index.html',
  'insights/workplace-ai-enablement-playbook/index.html',
  'insights/rudi-daily/index.html',
  'greater-cincinnati/index.html',
  'greater-cincinnati/ai-readiness-index/index.html',
  'start-here/index.html',
];

const retiredPublicFiles = [
  'contact.html',
  'consulting.html',
  'capabilities.html',
  'training.html',
  'camp-claude.html',
  'ai-training.html',
  'founder.html',
  'partners.html',
  'ai-training/index.html',
  'ai-training/custom.html',
  'ai-training/camp-claude.html',
  'ai-training/live-ai-training-camp/index.html',
];

const requiredPermanentRedirects = new Map([
  ['/contact', '/start-here/'],
  ['/contact.html', '/start-here/'],
  ['/consulting', '/how-we-help/'],
  ['/consulting.html', '/how-we-help/'],
  ['/capabilities', '/how-we-help/'],
  ['/capabilities.html', '/how-we-help/'],
  ['/training', '/how-we-help/ai-enablement/workforce-programs/'],
  ['/training.html', '/how-we-help/ai-enablement/workforce-programs/'],
  ['/camp-claude', '/ai-training/live-workflow-clinic.html'],
  ['/camp-claude.html', '/ai-training/live-workflow-clinic.html'],
  ['/ai-training', '/how-we-help/ai-enablement/workforce-programs/'],
  ['/ai-training/', '/how-we-help/ai-enablement/workforce-programs/'],
  ['/ai-training/index.html', '/how-we-help/ai-enablement/workforce-programs/'],
  ['/ai-training.html', '/how-we-help/ai-enablement/workforce-programs/'],
  ['/ai-training/custom', '/how-we-help/ai-enablement/workforce-programs/#custom-programs'],
  ['/ai-training/custom.html', '/how-we-help/ai-enablement/workforce-programs/#custom-programs'],
  ['/ai-training/camp-claude', '/ai-training/live-workflow-clinic.html'],
  ['/ai-training/camp-claude.html', '/ai-training/live-workflow-clinic.html'],
  ['/ai-training/live-ai-training-camp', '/ai-training/live-workflow-clinic.html'],
  ['/ai-training/live-ai-training-camp/', '/ai-training/live-workflow-clinic.html'],
  ['/ai-training/live-ai-training-camp/index.html', '/ai-training/live-workflow-clinic.html'],
  ['/founder', '/about.html#founder'],
  ['/founder.html', '/about.html#founder'],
  ['/partners', '/about.html#partners'],
  ['/partners.html', '/about.html#partners'],
]);

const forbiddenPublicEntries = ['archive', 'docs', 'internal', 'scripts', 'tools'];
const allowedPublicRootFiles = new Set([
  'about.html',
  'founder-profile.pdf',
  'framework.html',
  'index.html',
  'ohio.html',
  'og.png',
  'openai-codex-enablement.html',
  'privacy.html',
  'prompting.html',
  'robots.txt',
  'sitemap.xml',
  'survey.html',
  'terms.html',
]);
const allowedPublicRootDirectories = new Set([
  'ai-training',
  'approach',
  'assets',
  'case-studies',
  'css',
  'greater-cincinnati',
  'how-we-help',
  'images',
  'insights',
  'js',
  'start-here',
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

function pointsAtDirectoryWithoutTrailingSlash(targetPath, rawReference) {
  const [withoutHash] = rawReference.split('#');
  const [withoutQuery] = withoutHash.split('?');
  return Boolean(
    withoutQuery &&
      withoutQuery !== '/' &&
      !withoutQuery.endsWith('/') &&
      existsSync(targetPath) &&
      statSync(targetPath).isDirectory()
  );
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

  for (const architectureFile of coreArchitectureFiles) {
    const targetPath = path.join(publicRoot, architectureFile);
    if (!existsSync(targetPath) || !statSync(targetPath).isFile()) {
      addError(`Missing core architecture page: public/${architectureFile}`);
      continue;
    }

    const html = readFileSync(targetPath, 'utf8');
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) {
      addError(`Core architecture page must have exactly one H1: public/${architectureFile} (${h1Count} found)`);
    }

    if (!/<meta\s+name=["']description["']/i.test(html)) {
      addError(`Core architecture page is missing a meta description: public/${architectureFile}`);
    }

    if (!/<link\s+rel=["']canonical["']/i.test(html)) {
      addError(`Core architecture page is missing a canonical URL: public/${architectureFile}`);
    }

    const expectedSocialCard = architectureFile === 'insights/workplace-ai-enablement-playbook/index.html'
      ? 'https://learnrudi.com/images/workplace-ai-enablement-playbook-social.png'
      : 'https://learnrudi.com/og.png';
    if (!html.includes(`property="og:image" content="${expectedSocialCard}"`)) {
      addError(`Core architecture page is missing its expected social card: public/${architectureFile}`);
    }

    if (!html.includes('/start-here/')) {
      addError(`Core architecture page is missing the readiness funnel link: public/${architectureFile}`);
    }

    if (!/<link\b[^>]*\bhref=["']\/css\/rudi-2026\.css["'][^>]*>/i.test(html)) {
      addError(`Core architecture page is missing the shared 2026 stylesheet: public/${architectureFile}`);
    }

    if (!/<script\b[^>]*\bsrc=["']\/js\/rudi-2026\.js["'][^>]*>/i.test(html)) {
      addError(`Core architecture page is missing the shared 2026 script: public/${architectureFile}`);
    }

    if (/<script\b[^>]*\bsrc=["']\/js\/legacy-positioning\.js["'][^>]*>/i.test(html)) {
      addError(`Core architecture page must not load the legacy positioning script: public/${architectureFile}`);
    }
  }

  for (const retiredFile of retiredPublicFiles) {
    if (existsSync(path.join(publicRoot, retiredFile))) {
      addError(`Retired public page returned: public/${retiredFile}`);
    }
  }

  const stylesheetPath = path.join(publicRoot, 'css/rudi-2026.css');
  if (existsSync(stylesheetPath)) {
    const stylesheet = readFileSync(stylesheetPath, 'utf8');
    const openBraces = (stylesheet.match(/{/g) || []).length;
    const closeBraces = (stylesheet.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      addError(`Unbalanced braces in public/css/rudi-2026.css (${openBraces} opening, ${closeBraces} closing).`);
    }
  }

  const sitemapPath = path.join(publicRoot, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, 'utf8');
    const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const duplicateSitemapUrls = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);
    for (const duplicate of new Set(duplicateSitemapUrls)) {
      addError(`Sitemap contains duplicate URL: ${duplicate}`);
    }

    for (const sitemapUrl of sitemapUrls) {
      let parsed;
      try {
        parsed = new URL(sitemapUrl);
      } catch {
        addError(`Sitemap contains invalid URL: ${sitemapUrl}`);
        continue;
      }
      if (parsed.origin !== 'https://learnrudi.com') {
        addError(`Sitemap URL uses unexpected origin: ${sitemapUrl}`);
        continue;
      }

      const resolved = resolveUrlReference(sitemapPath, `${parsed.pathname}${parsed.hash}`);
      if (resolved && !existsAsRoutableTarget(resolved.targetPath)) {
        addError(`Sitemap URL does not resolve to a public page: ${sitemapUrl}`);
      }
    }

    for (const architectureFile of coreArchitectureFiles) {
      const route = architectureFile === 'index.html'
        ? 'https://learnrudi.com/'
        : architectureFile.endsWith('/index.html')
          ? `https://learnrudi.com/${architectureFile.replace(/index\.html$/, '')}`
          : `https://learnrudi.com/${architectureFile}`;
      if (!sitemap.includes(`<loc>${route}</loc>`)) {
        addError(`Sitemap is missing core architecture route: ${route}`);
      }
    }

    for (const source of requiredPermanentRedirects.keys()) {
      const retiredUrl = `https://learnrudi.com${source}`;
      if (sitemap.includes(`<loc>${retiredUrl}</loc>`)) {
        addError(`Sitemap includes redirected URL: ${retiredUrl}`);
      }
    }
  }

  if (!existsSync(vercelConfigPath)) {
    addError('Missing vercel.json.');
  } else {
    let vercelConfig;
    try {
      vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));
    } catch (error) {
      addError(`vercel.json is invalid JSON: ${error.message}`);
    }

    if (vercelConfig) {
      const redirects = Array.isArray(vercelConfig.redirects) ? vercelConfig.redirects : [];
      const redirectBySource = new Map(redirects.map((redirect) => [redirect.source, redirect]));
      const redirectSources = new Set(redirectBySource.keys());
      if (redirectBySource.size !== redirects.length) {
        addError('vercel.json contains duplicate redirect sources.');
      }

      if (existsSync(sitemapPath)) {
        const sitemap = readFileSync(sitemapPath, 'utf8');
        for (const source of redirectSources) {
          if (sitemap.includes(`<loc>https://learnrudi.com${source}</loc>`)) {
            addError(`Sitemap includes redirect source: https://learnrudi.com${source}`);
          }
        }
      }

      for (const [source, destination] of requiredPermanentRedirects) {
        const redirect = redirectBySource.get(source);
        if (!redirect) {
          addError(`Missing permanent redirect: ${source} -> ${destination}`);
        } else if (redirect.destination !== destination || redirect.permanent !== true) {
          addError(`Incorrect redirect for ${source}: expected permanent ${destination}`);
        }
      }

      for (const redirect of redirects) {
        if (typeof redirect.destination !== 'string' || !redirect.destination.startsWith('/')) {
          continue;
        }

        const destinationPath = redirect.destination.split('#')[0].split('?')[0];
        if (redirectSources.has(destinationPath)) {
          addError(`Redirect chain detected: ${redirect.source} -> ${redirect.destination}`);
        }

        const resolvedDestination = resolveUrlReference(vercelConfigPath, redirect.destination);
        if (resolvedDestination && !existsAsRoutableTarget(resolvedDestination.targetPath)) {
          const target = path.relative(repoRoot, resolvedDestination.targetPath);
          addError(`Redirect destination is missing: ${redirect.source} -> ${redirect.destination} (${target})`);
        } else if (
          resolvedDestination &&
          !hasHtmlAnchor(resolvedDestination.targetPath, resolvedDestination.fragment)
        ) {
          addError(`Redirect destination anchor is missing: ${redirect.source} -> ${redirect.destination}`);
        }
      }
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
      if (pointsAtDirectoryWithoutTrailingSlash(targetPath, reference)) {
        const source = path.relative(repoRoot, referenceFile);
        addError(`${source} references redirecting directory URL instead of direct target: ${reference}`);
        continue;
      }

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
