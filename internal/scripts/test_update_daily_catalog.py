from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from update_daily_catalog import (
    ARCHIVE_END,
    ARCHIVE_HEADING_MARKER,
    ARCHIVE_START,
    DEFAULT_ARCHIVE,
    LATEST_END,
    LATEST_START,
    extract_edition_preview,
    update_archive_html,
    update_index_html,
    update_related_navigation,
    update_sitemap_xml,
)


class DailyCatalogTests(unittest.TestCase):
    def test_archive_cards_include_verified_edition_previews(self) -> None:
        archive_html = f'''{ARCHIVE_HEADING_MARKER}<section><p class="eyebrow">RUDI Daily archive</p>
{ARCHIVE_START}<div class="card-grid"><article class="card" data-rudi-daily-date="2026-08-17"><a href="/insights/rudi-daily-ai-news-2026-08-17.html">August 17</a></article></div><div class="link-list"></div>{ARCHIVE_END}
</section>'''

        updated = update_archive_html(
            archive_html,
            edition_date="2026-08-18",
            preview_by_date={
                "2026-08-18": "A new model shipped & leaders responded.",
                "2026-08-17": "Policy moved while teams adapted.",
            },
        )

        self.assertIn(
            '<p data-rudi-daily-preview>A new model shipped &amp; leaders responded.</p>',
            updated,
        )
        self.assertIn(
            '<p data-rudi-daily-preview>Policy moved while teams adapted.</p>',
            updated,
        )
        self.assertEqual(updated.count("data-rudi-daily-preview"), 2)

    def test_edition_preview_comes_from_one_bounded_subtitle(self) -> None:
        page = (
            '<header><p class="subtitle"> Models shipped &amp; policy moved. '
            '<strong>Leaders responded.</strong><br> All 12 stories from the day, below. '
            '</p></header>'
        )

        self.assertEqual(
            extract_edition_preview(page),
            "Models shipped & policy moved. Leaders responded.",
        )
        with self.assertRaisesRegex(ValueError, "missing or ambiguous"):
            extract_edition_preview('<p class="subtitle">One.</p><p class="subtitle">Two.</p>')

    def test_archive_preview_is_required_and_bounded(self) -> None:
        archive_html = f'''{ARCHIVE_HEADING_MARKER}<p class="eyebrow">RUDI Daily archive</p>
{ARCHIVE_START}<article data-rudi-daily-date="2026-08-18"><a href="/insights/rudi-daily-ai-news-2026-08-18.html">August 18</a></article>{ARCHIVE_END}'''

        with self.assertRaisesRegex(ValueError, "archive preview for 2026-08-18"):
            update_archive_html(
                archive_html,
                edition_date="2026-08-18",
                preview_by_date={},
            )
        with self.assertRaisesRegex(ValueError, "bounded text"):
            update_archive_html(
                archive_html,
                edition_date="2026-08-18",
                preview_by_date={"2026-08-18": "x" * 501},
            )

    def test_redesigned_latest_card_replaces_without_legacy_grid(self) -> None:
        index_html = """<div class="card-grid">
<!-- RUDI_DAILY_LATEST_START -->
<article class="card card-dark"><div class="tag-row"><span class="tag tag-light">Latest edition</span><span class="tag tag-light">August 17, 2026</span></div><h3>RUDI Daily AI News</h3><p>The latest published edition of RUDI's structured daily AI briefing.</p><a class="button-link" href="/insights/rudi-daily-ai-news-2026-08-17.html">Read the latest edition</a></article>
<!-- RUDI_DAILY_LATEST_END -->
<article class="card card-dark"><h3>About the RUDI Daily</h3></article>
</div>"""

        updated = update_index_html(
            index_html,
            edition_date="2026-08-18",
            newest_date="2026-08-18",
            dek="A verified new edition.",
            story_count=12,
            source_count=13,
        )

        self.assertIn("data-rudi-daily-latest-card", updated)
        self.assertIn("/insights/rudi-daily-ai-news-2026-08-18.html", updated)
        self.assertNotIn("rudi-daily-ai-news-2026-08-17.html", updated)
        self.assertIn("All 12 stories across 13 source links.", updated)

    def test_new_edition_updates_index_sitemap_and_previous_navigation(self) -> None:
        index_html = f"""<div class="card-grid">
{LATEST_START}<article class="card card-dark"><a href="/insights/rudi-daily-ai-news-2026-08-08.html">old</a></article>{LATEST_END}
            </div>"""
        updated_index = update_index_html(
            index_html,
            edition_date="2026-08-09",
            newest_date="2026-08-09",
            dek="A verified new edition.",
            story_count=12,
            source_count=13,
        )
        self.assertNotIn("rudi-daily-ai-news-2026-08-08.html", updated_index)
        self.assertIn("rudi-daily-ai-news-2026-08-09.html", updated_index)
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

    def test_archive_update_is_idempotent_and_keeps_newest_first(self) -> None:
        archive_html = f'''{ARCHIVE_HEADING_MARKER}<section><p class="eyebrow">RUDI Daily archive</p>
{ARCHIVE_START}<div class="card-grid"><article class="card" data-rudi-daily-date="2026-08-17"><a href="/insights/rudi-daily-ai-news-2026-08-17.html">August 17</a></article><article class="card" data-rudi-daily-date="2026-08-16"><a href="/insights/rudi-daily-ai-news-2026-08-16.html">August 16</a></article></div><div class="link-list"><li data-rudi-daily-date="2026-08-15"><a href="/insights/rudi-daily-ai-news-2026-08-15.html">August 15</a></li></div>{ARCHIVE_END}
</section>'''

        previews = {
            value: f"Preview for {value}."
            for value in ("2026-08-18", "2026-08-17", "2026-08-16", "2026-08-15")
        }
        updated = update_archive_html(
            archive_html,
            edition_date="2026-08-18",
            preview_by_date=previews,
        )
        dates = ["2026-08-18", "2026-08-17", "2026-08-16", "2026-08-15"]
        positions = [updated.index(f"rudi-daily-ai-news-{value}.html") for value in dates]
        self.assertEqual(positions, sorted(positions))
        self.assertEqual(updated.count("rudi-daily-ai-news-2026-08-18.html"), 1)
        self.assertEqual(updated.count(">Latest<"), 1)
        self.assertEqual(
            update_archive_html(
                updated,
                edition_date="2026-08-18",
                preview_by_date=previews,
            ),
            updated,
        )

    def test_catalog_markers_fail_closed_when_missing_or_ambiguous(self) -> None:
        with self.assertRaisesRegex(ValueError, "latest-edition markers"):
            update_index_html(
                '<article><a href="/insights/rudi-daily-ai-news-2026-08-17.html">old</a></article>',
                edition_date="2026-08-18",
                newest_date="2026-08-18",
                dek="Verified.",
                story_count=2,
                source_count=3,
            )
        ambiguous = (
            f'{ARCHIVE_HEADING_MARKER}<p class="eyebrow">RUDI Daily archive</p>'
            f"{ARCHIVE_START}<div></div>{ARCHIVE_END}"
            f"{ARCHIVE_START}<div></div>{ARCHIVE_END}"
        )
        with self.assertRaisesRegex(ValueError, "archive markers"):
            update_archive_html(
                ambiguous,
                edition_date="2026-08-18",
                preview_by_date={"2026-08-18": "Preview."},
            )

    def test_archive_month_rollover_stays_month_neutral_and_chronological(self) -> None:
        source = (
            f'{ARCHIVE_HEADING_MARKER}<p class="eyebrow">RUDI Daily archive</p>'
            f'{ARCHIVE_START}<div class="card-grid">'
            '<article data-rudi-daily-date="2026-08-31"><a href="/insights/rudi-daily-ai-news-2026-08-31.html">August 31</a></article>'
            '</div><div class="link-list"></div>'
            f'{ARCHIVE_END}'
        )

        updated = update_archive_html(
            source,
            edition_date="2026-09-01",
            preview_by_date={
                "2026-09-01": "September preview.",
                "2026-08-31": "August preview.",
            },
        )

        self.assertIn(
            f'{ARCHIVE_HEADING_MARKER}<p class="eyebrow">RUDI Daily archive</p>',
            updated,
        )
        self.assertNotIn("August 2026", updated)
        self.assertLess(updated.index("2026-09-01"), updated.index("2026-08-31"))

    def test_historical_closeout_keeps_existing_unmanaged_archive_link(self) -> None:
        source = (
            f'{ARCHIVE_HEADING_MARKER}<p class="eyebrow">RUDI Daily archive</p>'
            f'{ARCHIVE_START}<article data-rudi-daily-date="2026-08-17"><a href="/insights/rudi-daily-ai-news-2026-08-17.html">August 17</a></article>{ARCHIVE_END}'
            '<section><a href="/insights/rudi-daily-ai-news-2026-07-31.html">July 31</a></section>'
        )

        self.assertEqual(
            update_archive_html(
                source,
                edition_date="2026-07-31",
                preview_by_date={},
            ),
            source,
        )

    def test_non_newest_edition_does_not_advance_a_stale_latest_card(self) -> None:
        source = (
            f'{LATEST_START}<article data-rudi-daily-latest-card><a href="/insights/'
            f'rudi-daily-ai-news-2026-08-16.html">stale</a></article>{LATEST_END}'
        )
        self.assertEqual(
            update_index_html(
                source,
                edition_date="2026-08-17",
                newest_date="2026-08-18",
                dek="Older closeout.",
                story_count=2,
                source_count=3,
            ),
            source,
        )

    def test_cli_accepts_absolute_archive_and_check_only_writes_nothing(self) -> None:
        self.assertTrue(DEFAULT_ARCHIVE.is_absolute())
        script = Path(__file__).with_name("update_daily_catalog.py").resolve()
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            insights = root / "insights"
            archive = insights / "rudi-daily" / "index.html"
            archive.parent.mkdir(parents=True)
            index = insights / "index.html"
            sitemap = root / "sitemap.xml"
            old_page = insights / "rudi-daily-ai-news-2026-08-17.html"
            new_page = insights / "rudi-daily-ai-news-2026-08-18.html"
            index.write_text(
                f'{LATEST_START}<article><a href="/insights/rudi-daily-ai-news-2026-08-16.html">stale</a></article>{LATEST_END}',
                encoding="utf-8",
            )
            archive.write_text(
                f'{ARCHIVE_HEADING_MARKER}<p class="eyebrow">RUDI Daily archive</p>{ARCHIVE_START}<div class="card-grid"><article data-rudi-daily-date="2026-08-17"><a href="/insights/rudi-daily-ai-news-2026-08-17.html">old</a></article></div><div class="link-list"></div>{ARCHIVE_END}',
                encoding="utf-8",
            )
            sitemap.write_text(
                """<urlset>
  <url><loc>https://learnrudi.com/insights/</loc><lastmod>2026-08-17</lastmod></url>
  <url><loc>https://learnrudi.com/insights/rudi-daily-ai-news-2026-08-17.html</loc><lastmod>2026-08-17</lastmod></url>
</urlset>""",
                encoding="utf-8",
            )
            old_page.write_text(
                '<p class="subtitle">Older edition preview.</p><div class="related">old</div>',
                encoding="utf-8",
            )
            new_page.write_text(
                '<p class="subtitle">New edition preview.</p><div class="related">new</div>',
                encoding="utf-8",
            )
            paths = (index, archive, sitemap, old_page, new_page)
            before = {path: path.read_bytes() for path in paths}
            command = [
                sys.executable,
                str(script),
                "--date",
                "2026-08-18",
                "--modified-date",
                "2026-08-18",
                "--dek",
                "Verified edition.",
                "--story-count",
                "2",
                "--source-count",
                "3",
                "--insights-dir",
                str(insights),
                "--index",
                str(index),
                "--archive",
                str(archive),
                "--sitemap",
                str(sitemap),
                "--check-only",
            ]

            older_command = command.copy()
            older_command[older_command.index("--date") + 1] = "2026-08-17"
            older_result = subprocess.run(
                older_command,
                check=True,
                capture_output=True,
                text=True,
            )
            self.assertNotIn(str(index), json.loads(older_result.stdout)["changed"])

            result = subprocess.run(command, check=True, capture_output=True, text=True)

            self.assertTrue(json.loads(result.stdout)["check_only"])
            self.assertIn(str(archive), json.loads(result.stdout)["changed"])
            self.assertEqual(before, {path: path.read_bytes() for path in paths})


if __name__ == "__main__":
    unittest.main()
