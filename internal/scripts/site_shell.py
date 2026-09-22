#!/usr/bin/env python3
"""Render the shared static site shell; update chrome without rebuilding articles.

Run `python3 internal/scripts/site_shell.py` after changing navigation or branding.
`--check` reports drift without writing. Daily generation calls apply_shell too.
"""
import argparse
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
GROUPS = (
    ('How We Help', (
        ('/how-we-help/', 'All services', 'Choose the help your team needs'),
        ('/how-we-help/#platforms', 'AI platforms', 'Copilot, Claude, ChatGPT, Codex and Gemini'),
        ('/how-we-help/ai-enablement/workforce-programs/', 'Team training', 'Hands-on learning for your people'),
        ('/how-we-help/team-workflows/', 'Department workflows', 'Learn while improving a real process'),
        ('/how-we-help/ai-implementation/', 'Agents & applications', 'Build useful tools for your team'),
        ('/how-we-help/ai-workspace-management/', 'AI workspace management', 'Setup, permissions, policy and support'),
        ('/how-we-help/ai-readiness/assessment/', 'Readiness assessment', 'Establish a starting point'),
        ('/how-we-help/managed-digital-workers/', 'Managed Digital Workers', 'Ongoing, governed AI operations'),
        ('/approach/', 'Our approach', 'Methods, responsibility and oversight'),
    )),
    ('Our Work', (
        ('/case-studies/', 'Explore our work', 'Case studies, speaking and workshops'),
        ('/case-studies/enterprise-ai-adoption-strategy/', 'Walker SCM', 'Enterprise AI adoption strategy'),
        ('/case-studies/warren-county-esc.html', 'Warren County ESC', 'Executive AI literacy'),
        ('/case-studies/#speaking', 'Speaking & workshops', 'AfroTech, Avanade, ULI and more'),
    )),
    ('Learn & Resources', (
        ('/insights/', 'Insights & resources', 'Guides, research and perspectives'),
        ('/insights/rudi-daily/', 'RUDI Daily', 'AI news with workplace context'),
        ('/insights/workplace-ai-enablement-playbook/', 'Workplace AI Playbook', 'A practical guide for teams'),
        ('/newsletter/', 'Newsletter', 'Workplace AI news, tips and resources'),
        ('/learn/', 'Learning library', '21 free lessons across three paths'),
        ('/prompting.html', 'Prompting guide', 'Brief tasks, supply context and review results'),
    )),
    ('About', (
        ('/about.html', 'About RUDI', 'Responsible Use of Digital Intelligence'),
        ('/about.html#founder', 'Meet Brandon', 'Founder and educator'),
        ('/about.html#partners', 'Partners & experience', 'The organizations we work with'),
        ('/greater-cincinnati/', 'Greater Cincinnati', 'Our home region'),
        ('/greater-cincinnati/ai-readiness-index/', 'Regional readiness index', 'Research on local AI adoption'),
    )),
)


def group_markup():
    parts = []
    for label, links in GROUPS:
        items = ''.join(
            f'<a href="{escape(href, quote=True)}"><strong>{escape(title)}</strong>'
            f'<small>{escape(description)}</small></a>' for href, title, description in links
        )
        parts.append(f'<details class="rudi-group"><summary>{escape(label)}</summary>'
                     f'<div class="rudi-links">{items}</div></details>')
    return '\n'.join(parts)


def header_html():
    return f'''<header class="rudi-header">
  <div class="rudi-header-inner">
    <a class="rudi-wordmark" href="/" aria-label="RUDI home"><img src="/brand/rudi-wordmark.svg" alt="rudi" width="108" height="50"></a>
    <nav class="rudi-desktop" aria-label="Primary navigation">{group_markup()}</nav>
    <a class="rudi-start" href="/start-here/">Start Here <span aria-hidden="true">↗</span></a>
    <details class="rudi-mobile"><summary>Menu</summary>
      <nav aria-label="Mobile navigation">{group_markup()}<a class="rudi-mobile-start" href="/start-here/">Talk with RUDI →</a></nav>
    </details>
  </div>
</header>'''


def footer_html():
    return '''<footer class="rudi-footer">
  <div class="rudi-footer-inner">
    <div class="rudi-footer-intro"><a class="rudi-wordmark" href="/" aria-label="RUDI home"><img src="/brand/rudi-wordmark.svg" alt="rudi" width="132" height="61" loading="lazy"></a>
      <p>Responsible Use of Digital Intelligence</p><p>AI training, workflow improvement, and useful tools for your team.</p></div>
    <div><h2>Work with RUDI</h2><a href="/how-we-help/">How We Help</a><a href="/case-studies/">Our Work</a><a href="/approach/">Our approach</a><a href="/start-here/">Start Here</a></div>
    <div><h2>Keep learning</h2><a href="/insights/">Insights &amp; resources</a><a href="/insights/rudi-daily/">RUDI Daily</a><a href="/insights/workplace-ai-enablement-playbook/">Workplace AI Playbook</a><a href="/newsletter/">Newsletter</a><a href="/learn/">Learning library</a></div>
    <div><h2>RUDI</h2><a href="/about.html">About</a><a href="/greater-cincinnati/">Greater Cincinnati</a><a href="mailto:rudi@learnrudi.com">Email RUDI</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></div>
  </div>
  <div class="rudi-footer-bottom"><span>© 2026 RUDI LLC</span><span>Home in Cincinnati · Serving organizations nationally</span></div>
</footer>'''


class ShellRegions(HTMLParser):
    """Locate balanced shell elements, preserving every other source byte."""
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.offsets = [0]
        for line in source.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.stack = []
        self.regions = []
        self.feed(source)
        if any(kind for _, _, kind in self.stack):
            raise ValueError('Unclosed site shell element; refusing to rewrite')

    def position(self):
        line, column = self.getpos()
        return self.offsets[line - 1] + column

    def handle_starttag(self, tag, attrs):
        if tag in self.VOID:
            return
        attrs = dict(attrs)
        classes = set(attrs.get('class', '').split())
        kind = None
        if tag == 'header' and classes.intersection({'site-nav', 'rudi-header'}):
            kind = 'header'
        elif tag == 'nav' and 'nav' in classes:
            kind = 'header'
        elif tag == 'footer':
            kind = 'footer'
        elif 'mobile-menu' in classes or 'skip-link' in classes:
            kind = 'remove'
        # Nested elements are covered by the outer replacement.
        if any(item[2] for item in self.stack):
            kind = None
        self.stack.append((tag, self.position(), kind))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                if any(item[2] for item in self.stack[index + 1:]):
                    raise ValueError('Unclosed site shell element; refusing to rewrite')
                _, start, kind = self.stack[index]
                del self.stack[index:]
                if kind:
                    self.regions.append((start, self.position() + len(tag) + 3, kind))
                return


def apply_shell(source, *, embedded=False):
    regions = ShellRegions(source).regions
    for kind in ('header', 'footer'):
        if sum(r[2] == kind for r in regions) > 1:
            raise ValueError(f'Multiple {kind} elements; refusing ambiguous rewrite')
    replacements = {'header': header_html(), 'footer': footer_html(), 'remove': ''}
    for start, end, kind in sorted(regions, reverse=True):
        replacement = '' if embedded else replacements[kind]
        if not replacement:
            line_start = source.rfind('\n', 0, start) + 1
            if not source[line_start:start].strip():
                start = line_start
        source = source[:start] + replacement + source[end:]
    if embedded:
        # Fixed-height iframe documents keep their own layout and design layer.
        # Site chrome belongs to the surrounding article, never inside a chart.
        source = re.sub(r'^[ \t]*<script\b[^>]*src=["\']/js/(?:legacy-positioning|site-navigation)\.js["\'][^>]*>\s*</script>[ \t]*\n?', '', source, flags=re.M)
        source = source.replace('<link rel="stylesheet" href="/css/rudi-chrome.css">\n', '')
        source = source.replace('<div id="content" tabindex="-1"></div>\n', '')
        return source
    if not any(r[2] == 'header' for r in regions):
        source = re.sub(r'(<body\b[^>]*>)', lambda m: m[1] + '\n' + header_html(), source, count=1)
    if not any(r[2] == 'footer' for r in regions):
        source = source.replace('</body>', footer_html() + '\n</body>', 1)
    # An existing main keeps its ID; standalone utility pages get a target.
    main = re.search(r'<main\b([^>]*)>', source)
    target = 'content'
    if main:
        existing_id = re.search(r'\bid="([^"]+)"', main[1])
        target = existing_id[1] if existing_id else 'main'
        if not existing_id:
            source = source[:main.start()] + '<main id="main"' + main[1] + '>' + source[main.end():]
    else:
        source = source.replace('</header>', '</header>\n<div id="content" tabindex="-1"></div>', 1) if 'id="content"' not in source else source
    source = re.sub(r'\s*(<header class="rudi-header">)', r'\n\1', source, count=1)
    source = source.replace('<header class="rudi-header">', f'<a class="skip-link" href="#{escape(target)}">Skip to content</a>\n<header class="rudi-header">', 1)
    source = re.sub(r'^[ \t]*<script\b[^>]*src=["\']/js/legacy-positioning\.js["\'][^>]*>\s*</script>[ \t]*\n?', '', source, flags=re.M)
    additions = [
        ('/css/rudi-chrome.css', '<link rel="stylesheet" href="/css/rudi-chrome.css">'),
        ('/favicon-64.png', '<link rel="icon" href="/favicon-64.png" type="image/png">'),
        ('/apple-touch-icon.png', '<link rel="apple-touch-icon" href="/apple-touch-icon.png">'),
    ]
    for marker, markup in additions:
        if marker not in source:
            source = source.replace('</head>', markup + '\n</head>', 1)
    if 'rel="canonical" href="https://learnrudi.com/how-we-help/ai-readiness/assessment/"' in source:
        source = source.replace('href="/start-here/"', 'href="/start-here/?interest=ai-readiness#inquiry-form" data-preserve-attribution')
    if '/js/site-navigation.js' not in source:
        source = source.replace('</body>', '<script src="/js/site-navigation.js" defer></script>\n</body>', 1)
    return source


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    changes = []
    for path in sorted((ROOT / 'public').rglob('*.html')):
        before = path.read_text()
        after = apply_shell(before, embedded=path.is_relative_to(ROOT / 'public/insights/visuals'))
        if before != after:
            changes.append(path)
            if not args.check:
                path.write_text(after)
    print(f'Site shell: {len(changes)} page(s) {"need updating" if args.check else "updated"}.')
    if args.check and changes:
        for path in changes:
            print(path.relative_to(ROOT))
        raise SystemExit(1)


if __name__ == '__main__':
    main()
