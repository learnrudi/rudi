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
  'css/rudi-legacy.css',
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
  'learn/index.html',
  'newsletter/index.html',
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
  'learn',
  'newsletter',
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

  const catalogContracts = [
    {
      file: 'insights/index.html',
      start: '<!-- RUDI_DAILY_LATEST_START -->',
      end: '<!-- RUDI_DAILY_LATEST_END -->',
      ownedAttribute: 'data-rudi-daily-latest-card',
    },
    {
      file: 'insights/rudi-daily/index.html',
      start: '<!-- RUDI_DAILY_ARCHIVE_START -->',
      end: '<!-- RUDI_DAILY_ARCHIVE_END -->',
      ownedAttribute: 'data-rudi-daily-date=',
      pageMarker: '<!-- RUDI_DAILY_ARCHIVE_HEADING_MONTH_NEUTRAL -->',
      requiresCardPreviews: true,
    },
  ];
  for (const contract of catalogContracts) {
    const targetPath = path.join(publicRoot, contract.file);
    if (!existsSync(targetPath) || !statSync(targetPath).isFile()) {
      continue;
    }
    const html = readFileSync(targetPath, 'utf8');
    const startCount = html.split(contract.start).length - 1;
    const endCount = html.split(contract.end).length - 1;
    if (startCount !== 1 || endCount !== 1 || html.indexOf(contract.start) >= html.indexOf(contract.end)) {
      addError(`RUDI Daily catalog ownership markers are missing, ambiguous, or out of order: public/${contract.file}`);
      continue;
    }
    const ownedRegion = html.slice(
      html.indexOf(contract.start) + contract.start.length,
      html.indexOf(contract.end),
    );
    if (!ownedRegion.includes(contract.ownedAttribute)) {
      addError(`RUDI Daily catalog ownership attribute is missing: public/${contract.file}`);
    }
    if (contract.requiresCardPreviews) {
      const cards = [...ownedRegion.matchAll(
        /<article\b(?=[^>]*\bdata-rudi-daily-date=["']\d{4}-\d{2}-\d{2}["'])[^>]*>([\s\S]*?)<\/article>/gi,
      )];
      if (cards.length === 0) {
        addError(`RUDI Daily archive has no featured edition cards: public/${contract.file}`);
      }
      for (const card of cards) {
        const previews = [...card[1].matchAll(
          /<p\b(?=[^>]*\bdata-rudi-daily-preview(?:\s|=|>))[^>]*>([^<]+)<\/p>/gi,
        )];
        if (previews.length !== 1 || !previews[0][1].trim()) {
          addError(`RUDI Daily archive card is missing one non-empty preview: public/${contract.file}`);
        }
      }
    }
    if (contract.pageMarker && html.split(contract.pageMarker).length - 1 !== 1) {
      addError(`RUDI Daily catalog page marker is missing or ambiguous: public/${contract.file}`);
    }
  }

  const editionPages = walkFiles(
    path.join(publicRoot, 'insights'),
    (file) => /rudi-(?:daily|rundown)-ai-news-\d{4}-\d{2}-\d{2}\.html$/.test(file),
  );
  for (const editionPage of editionPages) {
    const html = readFileSync(editionPage, 'utf8');
    const relativePath = path.relative(publicRoot, editionPage);
    if (!html.includes('class="newsletter-cta"') || !html.includes('href="/newsletter/"')) {
      addError(`RUDI Daily edition is missing the newsletter signup path: public/${relativePath}`);
    }
  }

  const newsletterPath = path.join(publicRoot, 'newsletter/index.html');
  if (existsSync(newsletterPath)) {
    const newsletter = readFileSync(newsletterPath, 'utf8');
    if (!newsletter.includes('https://bzhoff.substack.com/subscribe')) {
      addError('Newsletter page is missing the live Substack signup destination.');
    }
    if (!newsletter.includes('$8 monthly or $80 annually')) {
      addError('Newsletter page is missing the verified paid membership pricing.');
    }
  }

  for (const retiredFile of retiredPublicFiles) {
    if (existsSync(path.join(publicRoot, retiredFile))) {
      addError(`Retired public page returned: public/${retiredFile}`);
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
  const cssFiles = walkFiles(path.join(publicRoot, 'css'), (filePath) => filePath.endsWith('.css'));
  const jsFiles = walkFiles(publicRoot, (filePath) => filePath.endsWith('.js'));
  const referenceFiles = [...htmlFiles, ...jsFiles];
  const referencePattern = /\b(?:href|src)=["']([^"']+)["']|\bqrImagePath:\s*["']([^"']+)["']/gi;

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');
    const source = path.relative(repoRoot, htmlFile);
    const hasCurrentDesign = /href=["']\/css\/rudi-2026\.css["']/i.test(html);
    const hasLegacyBridge = /href=["']\/css\/rudi-legacy\.css["']/i.test(html);
    if (!hasCurrentDesign && !hasLegacyBridge) {
      addError(`${source} is missing an approved RUDI design layer.`);
    }

    if (/src=["']\/js\/legacy-positioning\.js["']/i.test(html) && !hasLegacyBridge) {
      addError(`${source} loads the legacy shell without its RUDI design bridge.`);
    }

    if (/#(?:c75b39|a94d2f|f7e8e1|bd5a3f|8f3f2b)|rgba\(\s*(?:199\s*,\s*91\s*,\s*57|169\s*,\s*77\s*,\s*47)/i.test(html)) {
      addError(`${source} still contains retired clay colors.`);
    }

    if (/border-(?:left|right)\s*:/i.test(html)) {
      addError(`${source} contains a decorative side-border declaration.`);
    }

    if (/hoff@learnrudi\.com|P&amp;P Management Group|P&P Management Group/i.test(html)) {
      addError(`${source} contains retired public identity or contact details.`);
    }

    if (/(?:©|&copy;)\s*2026 RUDI(?! LLC)/i.test(html)) {
      addError(`${source} has a footer that omits the RUDI LLC legal entity.`);
    }

    for (const match of html.matchAll(/href=["']mailto:([^?"']+)/gi)) {
      if (match[1].toLowerCase() !== 'rudi@learnrudi.com') {
        addError(`${source} contains a non-admin public email link: ${match[1]}`);
      }
    }
  }

  for (const cssFile of cssFiles) {
    const stylesheet = readFileSync(cssFile, 'utf8');
    const source = path.relative(repoRoot, cssFile);
    const openBraces = (stylesheet.match(/{/g) || []).length;
    const closeBraces = (stylesheet.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      addError(`Unbalanced braces in ${source} (${openBraces} opening, ${closeBraces} closing).`);
    }
    if (/border-(?:left|right)\s*:/i.test(stylesheet)) {
      addError(`${source} contains a decorative side-border declaration.`);
    }
  }

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
