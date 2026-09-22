"""Regression for the public retirement boundary of obsolete article graphics.

Run: python3 -m unittest discover -s internal/tests -p 'test_legacy_visual_archive.py'
Vercel interprets the redirect configuration; production HTTP remains a release check.
"""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
NAMES = ('adoption-curves', 'catch-22', 'deterministic', 'institutional-gap',
         'investment-model', 'tool-vs-skill')
DESTINATION = '/insights/ai-adoption-higher-ed.html'


class LegacyVisualArchiveTest(unittest.TestCase):
    def test_retired_graphics_preserve_bookmarks_without_shipping_old_documents(self):
        redirects = json.loads((ROOT / 'vercel.json').read_text())['redirects']
        destination = ROOT / 'public' / DESTINATION.lstrip('/')
        self.assertTrue(destination.is_file())
        self.assertNotIn('noindex', destination.read_text())
        for name in NAMES:
            route = f'/insights/visuals/{name}-visual.html'
            with self.subTest(route=route):
                self.assertFalse((ROOT / 'public' / route.lstrip('/')).exists(),
                                 'Obsolete graphic is still deployable')
                archive = ROOT / 'docs/archive/public-pages/2026-09-22/public' / route.lstrip('/')
                self.assertTrue(archive.is_file(), 'Original must remain archived')
                for old_route in (route, route.removesuffix('.html')):
                    rules = [r for r in redirects if r['source'] == old_route]
                    self.assertEqual(len(rules), 1)
                    self.assertEqual(rules[0]['destination'], DESTINATION)
                    self.assertIs(rules[0]['permanent'], True)
        for page in (ROOT / 'public').rglob('*.html'):
            source = page.read_text()
            for name in NAMES:
                self.assertNotIn(f'{name}-visual', source,
                                 f'Live page still refers to retired graphic: {page}')


if __name__ == '__main__':
    unittest.main()
