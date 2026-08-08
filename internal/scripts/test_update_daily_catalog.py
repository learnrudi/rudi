from __future__ import annotations

import unittest

from update_daily_catalog import (
    update_index_html,
    update_related_navigation,
    update_sitemap_xml,
)


class DailyCatalogTests(unittest.TestCase):
    def test_new_edition_updates_index_sitemap_and_previous_navigation(self) -> None:
        index_html = """<div class="articles-grid daily-rundown-grid">
                <a href="rudi-daily-ai-news-2026-08-08.html"><article>old</article></a>
            </div>"""
        updated_index = update_index_html(
            index_html,
            edition_date="2026-08-09",
            dek="A verified new edition.",
            story_count=12,
            source_count=13,
        )
        self.assertLess(
            updated_index.index("rudi-daily-ai-news-2026-08-09.html"),
            updated_index.index("rudi-daily-ai-news-2026-08-08.html"),
        )
        self.assertIn("All 12 stories across 13 source links.", updated_index)

        sitemap = """<urlset>
  <url>
    <loc>https://learnrudi.com/insights/</loc>
    <lastmod>2026-08-08</lastmod>
  </url>
  <url>
    <loc>https://learnrudi.com/insights/about-the-rundown.html</loc>
    <lastmod>2026-07-09</lastmod>
  </url>
  <url>
    <loc>https://learnrudi.com/insights/rudi-daily-ai-news-2026-08-08.html</loc>
    <lastmod>2026-08-08</lastmod>
  </url>
</urlset>"""
        updated_sitemap = update_sitemap_xml(
            sitemap,
            edition_date="2026-08-09",
            modified_date="2026-08-09",
        )
        self.assertIn(
            "https://learnrudi.com/insights/rudi-daily-ai-news-2026-08-09.html",
            updated_sitemap,
        )
        self.assertRegex(
            updated_sitemap,
            r"<loc>https://learnrudi.com/insights/</loc>\s*<lastmod>2026-08-09</lastmod>",
        )

        page = '<div class="related"><a href="old">old</a></div>'
        updated_page = update_related_navigation(
            page,
            edition_date="2026-08-08",
            previous_date="2026-08-07",
            next_date="2026-08-09",
        )
        self.assertIn("rudi-daily-ai-news-2026-08-07.html", updated_page)
        self.assertIn("rudi-daily-ai-news-2026-08-09.html", updated_page)


if __name__ == "__main__":
    unittest.main()
