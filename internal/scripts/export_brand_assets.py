#!/usr/bin/env python3
"""Export website PNGs from the serving SVG masters. Requires librsvg's rsvg-convert."""
from pathlib import Path
import shutil
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / 'public'


def main():
    renderer = shutil.which('rsvg-convert')
    if not renderer:
        raise SystemExit('Install librsvg (brew install librsvg), then rerun this command.')
    mark = (PUBLIC / 'brand/rudi-mark.svg').read_text()
    wordmark = PUBLIC / 'brand/rudi-wordmark.svg'
    ET.fromstring(mark)
    ET.parse(wordmark)
    # Preserve canonical geometry inside a square canvas; never distort the mark.
    mark_inner = mark[mark.index('>') + 1:mark.rindex('</svg>')]
    square = ('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">'
              '<rect width="512" height="512" rx="64" fill="#FFFDF8"/>'
              '<svg x="72" y="60" width="368" height="392" viewBox="409 364 461 490">'
              + mark_inner + '</svg></svg>')
    (PUBLIC / 'favicon.svg').write_text(square + '\n')
    for relative, size in [('brand/rudi-mark-512.png', 512), ('favicon-64.png', 64), ('apple-touch-icon.png', 180)]:
        subprocess.run([renderer, '-w', str(size), '-h', str(size), '-o', str(PUBLIC / relative)],
                       input=square.encode(), check=True)
    subprocess.run([renderer, '-w', '1200', '-o', str(PUBLIC / 'brand/rudi-wordmark-1200.png'), str(wordmark)], check=True)
    # Sharing art uses the wordmark alone and real text, not the retired lockup.
    word = wordmark.read_text()
    word_inner = word[word.index('>') + 1:word.rindex('</svg>')]
    social = ('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">'
              '<rect width="1200" height="630" fill="#FFFDF8"/>'
              '<svg x="72" y="48" width="320" height="147" viewBox="696 189 810 371">' + word_inner + '</svg>'
              '<g font-family="IBM Plex Sans, sans-serif" fill="#15181F">'
              '<text x="80" y="315" font-size="64">Prepare your organization</text>'
              '<text x="80" y="393" font-size="64">to put AI to work.</text>'
              '<text x="80" y="535" font-size="24" fill="#177F74">Responsible Use of Digital Intelligence · learnrudi.com</text>'
              '</g></svg>')
    subprocess.run([renderer, '-o', str(PUBLIC / 'og.png')], input=social.encode(), check=True)
    print('Exported canonical website brand assets.')


if __name__ == '__main__':
    main()
