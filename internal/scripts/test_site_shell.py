import unittest
from site_shell import apply_shell


class SiteShellTests(unittest.TestCase):
    def test_installs_analytics_once_in_head_without_changing_content(self):
        article = '<main id="main"><h1>Keep this article</h1><p>Original content.</p></main>'
        source = '<html><head><title>Article</title></head><body>' + article + '</body></html>'
        result = apply_shell(source)
        self.assertEqual(1, result.count('https://www.googletagmanager.com/gtag/js?id=G-1WX561P8EV'))
        self.assertEqual(1, result.count("gtag('config', 'G-1WX561P8EV');"))
        self.assertLess(result.index('G-1WX561P8EV'), result.index('</head>'))
        self.assertIn(article, result)
        self.assertEqual(result, apply_shell(result))

    def test_anonymous_survey_and_embedded_documents_do_not_get_analytics(self):
        source = '<html><head></head><body><main id="main">Anonymous responses</main></body></html>'
        for options in ({'page_path': 'survey.html'}, {'embedded': True}):
            with self.subTest(options=options):
                result = apply_shell(source, **options)
                self.assertNotIn('googletagmanager.com', result)
                self.assertNotIn("gtag(", result)
                self.assertEqual(result, apply_shell(result, **options))
        # Only the exact anonymous-survey route is excluded, not similarly named pages.
        self.assertIn('G-1WX561P8EV', apply_shell(source, page_path='guides/survey.html'))

    def test_preserves_article_bytes_and_is_idempotent(self):
        article = '<main><h1>News &amp; context</h1><p id="story">Original <em>reporting</em>.</p></main>'
        source = '<html><head></head><body><nav class="nav"><div><a href="/">RUDI</a></div></nav>' + article + '<footer>Old footer</footer></body></html>'
        result = apply_shell(source)
        self.assertIn(article.replace('<main>', '<main id="main">'), result)
        self.assertEqual(result, apply_shell(result))
        self.assertEqual(1, result.count('class="skip-link"'))
        self.assertEqual(1, result.count('class="rudi-header"'))

    def test_rejects_conflicting_duplicate_or_excluded_tracking(self):
        source = '<html><head></head><body><main id="main">Article</main></body></html>'
        installed = apply_shell(source)
        cases = [
            (installed.replace('G-1WX561P8EV', 'G-WRONG12345'), {}),
            (installed.replace('</head>', '<script>gtag("config", "G-1WX561P8EV");</script></head>'), {}),
            (installed, {'page_path': 'survey.html'}),
            (installed, {'embedded': True}),
            (source.replace('</head>', '<script src="https://www.googletagmanager.com/gtag/js?id=G-1WX561P8EV"></head>'), {'page_path': 'survey.html'}),
        ]
        for html, options in cases:
            with self.subTest(options=options, html=html[:80]):
                with self.assertRaisesRegex(ValueError, 'analytics'):
                    apply_shell(html, **options)

    def test_rejects_missing_or_ambiguous_head(self):
        for source in ('<html><body>Missing head</body></html>',
                       '<html><head></head><head></head><body></body></html>'):
            with self.subTest(source=source), self.assertRaisesRegex(ValueError, 'head'):
                apply_shell(source)

    def test_preserves_assessment_inquiry_context(self):
        source = '<html><head><link rel="canonical" href="https://learnrudi.com/how-we-help/ai-readiness/assessment/"></head><body><main id="main">Assessment</main></body></html>'
        result = apply_shell(source)
        self.assertNotIn('href="/start-here/"', result)
        self.assertIn('href="/start-here/?interest=ai-readiness#inquiry-form" data-preserve-attribution', result)
        self.assertEqual(result, apply_shell(result))

    def test_rejects_ambiguous_shells(self):
        for body in ['<nav class="nav"></nav><nav class="nav"></nav>', '<header class="rudi-header"><div>']:
            with self.assertRaises(ValueError):
                apply_shell('<html><head></head><body>' + body + '</body></html>')


if __name__ == '__main__':
    unittest.main()
