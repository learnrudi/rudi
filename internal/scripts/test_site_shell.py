import unittest
from site_shell import apply_shell


class SiteShellTests(unittest.TestCase):
    def test_preserves_article_bytes_and_is_idempotent(self):
        article = '<main><h1>News &amp; context</h1><p id="story">Original <em>reporting</em>.</p></main>'
        source = '<html><head></head><body><nav class="nav"><div><a href="/">RUDI</a></div></nav>' + article + '<footer>Old footer</footer></body></html>'
        result = apply_shell(source)
        self.assertIn(article.replace('<main>', '<main id="main">'), result)
        self.assertEqual(result, apply_shell(result))
        self.assertEqual(1, result.count('class="skip-link"'))
        self.assertEqual(1, result.count('class="rudi-header"'))

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
