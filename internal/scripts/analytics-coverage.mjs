// Validate the emitted tag independently of the Python generator.
const loader = /^<script\s+async\s+src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-1WX561P8EV["']\s*>\s*<\/script\s*>$/i;
const bootstrap = "window.dataLayer=window.dataLayer||[];functiongtag(){dataLayer.push(arguments);}gtag('js',newDate());gtag('config','G-1WX561P8EV');";
const googleTracking = /googletagmanager\.com|google-analytics\.com|\bgtag\b|\bdataLayer\b/i;

function compactJavaScript(source) {
  // Whitespace inside string values (especially the measurement ID) is meaningful.
  return source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\s+/g,
    (token) => /^\s+$/.test(token) ? '' : token);
}

export function analyticsErrors(html, relativePath) {
  const markup = html.replace(/<!--[\s\S]*?-->/g, '');
  const scripts = [...markup.matchAll(/<script\b[^>]*>([\s\S]*?)(?:<\/script\s*>|$)/gi)]
    .filter((match) => googleTracking.test(match[0]));
  const excluded = relativePath === 'survey.html' || relativePath.startsWith('insights/visuals/');
  if (excluded) {
    return scripts.length ? ['Excluded page contains Google Analytics.'] : [];
  }

  const heads = [...markup.matchAll(/<head\b[^>]*>/gi)];
  const ends = [...markup.matchAll(/<\/head\s*>/gi)];
  if (heads.length !== 1 || ends.length !== 1 || heads[0].index >= ends[0].index) {
    return ['Google Analytics requires one complete head.'];
  }
  if (scripts.length !== 2) {
    return ['Expected exactly one Google Analytics loader and one configuration script.'];
  }
  if (scripts.some((match) => match.index < heads[0].index + heads[0][0].length
      || match.index + match[0].length > ends[0].index)) {
    return ['Google Analytics must be inside the head.'];
  }
  if (!loader.test(scripts[0][0])) {
    return ['Google Analytics loader must be async and use G-1WX561P8EV.'];
  }
  const inline = scripts[1];
  if (!/^<script\s*>/i.test(inline[0]) || compactJavaScript(inline[1]) !== bootstrap) {
    return ['Google Analytics bootstrap must initialize and configure G-1WX561P8EV exactly once.'];
  }
  return [];
}
