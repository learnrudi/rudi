from __future__ import annotations

import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import build_daily_edition as builder
from build_daily_edition import (
    build_page,
    load_bundle,
    load_editorial_content,
    verify,
)


class EditorialJsonRendererTests(unittest.TestCase):
    def test_editorial_json_preserves_inline_segment_whitespace(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            editorial_path = Path(temporary_directory) / "editorial.json"
            editorial_path.write_text(
                json.dumps(
                    {
                        "version": "rudi-editorial-copy-v1",
                        "edition_date": "2026-08-09",
                        "topics": "Verified Story",
                        "dek": "One verified story.",
                        "open": [
                            {
                                "segments": [
                                    {
                                        "kind": "link",
                                        "text": "One linked sentence",
                                        "title_substring": "Verified Story",
                                    },
                                    {
                                        "kind": "text",
                                        "text": ". Another sentence, ",
                                        "title_substring": "",
                                    },
                                    {
                                        "kind": "link",
                                        "text": "with another source",
                                        "title_substring": "Second Story",
                                    },
                                    {
                                        "kind": "text",
                                        "text": ".",
                                        "title_substring": "",
                                    },
                                ]
                            },
                            {
                                "segments": [
                                    {
                                        "kind": "text",
                                        "text": "Second paragraph.",
                                        "title_substring": "",
                                    }
                                ]
                            },
                        ],
                        "qa": [
                            {
                                "question": f"Question {number}?",
                                "answer": "Grounded answer.",
                                "title_substring": "Verified Story",
                                "source_label": "Example",
                            }
                            for number in range(6)
                        ],
                    }
                ),
                encoding="utf-8",
            )
            items = [
                {
                    "title": "Verified Story",
                    "url": "https://example.com/story",
                },
                {
                    "title": "Second Story",
                    "url": "https://example.com/second",
                },
            ]

            content = load_editorial_content(
                editorial_path,
                edition_date="2026-08-09",
                items=items,
                modified_date="2026-08-09",
            )
            rendered = content["open"](
                lambda title, text: f'<a data-title="{title}">{text}</a>'
            )[0]

            self.assertIn("</a>. Another sentence, <a", rendered)
            self.assertEqual(
                "One linked sentence. Another sentence, with another source.",
                re.sub(r"<[^>]+>", "", rendered),
            )

    def test_editorial_json_rejects_unresolved_source_binding(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            editorial_path = Path(temporary_directory) / "editorial.json"
            editorial_path.write_text(
                json.dumps(
                    {
                        "version": "rudi-editorial-copy-v1",
                        "edition_date": "2026-08-09",
                        "topics": "Verified Story",
                        "dek": "One verified story.",
                        "open": [
                            {
                                "segments": [
                                    {
                                        "kind": "link",
                                        "text": "an unsupported claim",
                                        "title_substring": "Unknown Story",
                                    }
                                ]
                            },
                            {
                                "segments": [
                                    {
                                        "kind": "text",
                                        "text": "Second paragraph.",
                                        "title_substring": "",
                                    }
                                ]
                            },
                        ],
                        "qa": [
                            {
                                "question": f"Question {number}?",
                                "answer": "Grounded answer.",
                                "title_substring": "Verified Story",
                                "source_label": "Example",
                            }
                            for number in range(6)
                        ],
                    }
                ),
                encoding="utf-8",
            )
            items = [
                {
                    "title": "Verified Story",
                    "url": "https://example.com/story",
                    "category": "Products",
                    "importance": 5,
                    "summary": "Grounded summary.",
                }
            ]

            with self.assertRaisesRegex(ValueError, "exactly one bundle source"):
                load_editorial_content(
                    editorial_path,
                    edition_date="2026-08-09",
                    items=items,
                    modified_date="2026-08-09",
                )

    def test_editorial_binding_ignores_excluded_role_title_collision(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            insights = root / "insights"
            insights.mkdir()
            bundle_path = root / "bundle.json"
            editorial_path = root / "editorial.json"
            sources = [
                {
                    "source_id": "source-news",
                    "title": "Shared incident report | Eligible News",
                    "url": "https://news.example/eligible",
                    "canonical_url": "https://news.example/eligible",
                    "domain": "news.example",
                    "category": "Security and agent risk",
                    "content_role": "news_story",
                    "importance": 4,
                    "summary": "The eligible report describes a current incident.",
                },
                {
                    "source_id": "source-context",
                    "title": "Shared incident report | Context Review",
                    "url": "https://context.example/review",
                    "canonical_url": "https://context.example/review",
                    "domain": "context.example",
                    "category": "Security and agent risk",
                    "content_role": "analysis_or_context",
                    "importance": 3,
                    "summary": "The context review revisits the incident.",
                },
            ]
            bundle_payload = {
                "version": "rudi-rundown-bundle-v1",
                "topic": "ai",
                "edition_date": "2026-08-09",
                "edition_status": "first",
                "input_runs": [],
                "counts": {
                    "input_run_count": 0,
                    "union_source_count": 2,
                    "exclusion_count": 0,
                    "rundown_source_count": 2,
                    "rundown_entry_count": 2,
                    "citation_count": 2,
                    "structured_data_item_count": 2,
                },
                "exclusions": [],
                "sources": sources,
                "entries": [
                    {
                        "entry_id": "entry-news",
                        "member_source_ids": ["source-news"],
                        "representative_source_id": "source-news",
                    },
                    {
                        "entry_id": "entry-context",
                        "member_source_ids": ["source-context"],
                        "representative_source_id": "source-context",
                    },
                ],
            }
            bundle_path.write_text(
                json.dumps(bundle_payload, ensure_ascii=False)
                + "\n",
                encoding="utf-8",
            )
            editorial_path.write_text(
                json.dumps(
                    {
                        "version": "rudi-editorial-copy-v1",
                        "edition_date": "2026-08-09",
                        "topics": "A current security incident",
                        "dek": "One current report led the edition.",
                        "open": [
                            {
                                "segments": [
                                    {
                                        "kind": "link",
                                        "text": "The current report",
                                        "title_substring": "Shared incident report",
                                    },
                                    {
                                        "kind": "text",
                                        "text": " described the incident.",
                                        "title_substring": "",
                                    },
                                ]
                            },
                            {
                                "segments": [
                                    {
                                        "kind": "text",
                                        "text": "The context source remained in the catalog.",
                                        "title_substring": "",
                                    }
                                ]
                            },
                        ],
                        "qa": [
                            {
                                "question": f"What happened in the incident {number}?",
                                "answer": "The eligible report describes the current incident.",
                                "title_substring": "Shared incident report",
                                "source_label": "Eligible News",
                            }
                            for number in range(1, 7)
                        ],
                    },
                    ensure_ascii=False,
                )
                + "\n",
                encoding="utf-8",
            )
            arguments = [
                "build_daily_edition.py",
                "--date",
                "2026-08-09",
                "--edition-status",
                "first",
                "--bundle",
                str(bundle_path),
                "--editorial-json",
                str(editorial_path),
                "--modified-date",
                "2026-08-09",
            ]

            with (
                patch.object(sys, "argv", arguments),
                patch.object(builder, "INSIGHTS", insights),
            ):
                builder.main()

            page = (
                insights / "rudi-daily-ai-news-2026-08-09.html"
            ).read_text(encoding="utf-8")
            self.assertIn(
                '<a href="https://news.example/eligible" rel="noopener" '
                'target="_blank">The current report</a>',
                page,
            )
            self.assertIn(
                '<a href="https://news.example/eligible" rel="noopener" '
                'target="_blank">Eligible News &rarr;</a>',
                page,
            )
            self.assertIn(
                '<a href="https://context.example/review" rel="noopener" '
                'target="_blank">Shared incident report | Context Review</a>',
                page,
            )
            self.assertIn('"numberOfItems": 2', page)
            self.assertEqual(2, page.count('"@type": "ListItem"'))
            self.assertEqual(2, page.count('"@type": "CreativeWork"'))

            bundle_payload["sources"][1]["content_role"] = "news_story"
            bundle_path.write_text(
                json.dumps(bundle_payload, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )
            failed_insights = root / "failed-insights"
            failed_insights.mkdir()
            with (
                patch.object(sys, "argv", arguments),
                patch.object(builder, "INSIGHTS", failed_insights),
                self.assertRaisesRegex(ValueError, "exactly one bundle source"),
            ):
                builder.main()
            self.assertFalse(
                (failed_insights / "rudi-daily-ai-news-2026-08-09.html").exists()
            )

    def test_cli_accepts_explicit_bundle_and_editorial_json(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            insights = root / "insights"
            insights.mkdir()
            item = {
                "title": "Explicit Story",
                "url": "https://example.com/story",
                "category": "Products",
                "content_role": "news_story",
                "importance": 5,
                "summary": "A grounded summary.",
            }
            content = {
                "topics": "Explicit Story",
                "dek": "One explicit story.",
                "modified": "2026-08-09",
                "open": lambda _linker: ["Paragraph one.", "Paragraph two."],
                "qa": [
                    ("Question?", "Answer.", "Explicit Story", "Example")
                    for _number in range(6)
                ],
            }
            arguments = [
                "build_daily_edition.py",
                "--date",
                "2026-08-09",
                "--edition-status",
                "first",
                "--bundle",
                str(root / "bundle.json"),
                "--editorial-json",
                str(root / "editorial.json"),
                "--modified-date",
                "2026-08-09",
            ]

            with (
                patch.object(sys, "argv", arguments),
                patch.object(builder, "INSIGHTS", insights),
                patch.object(builder, "load_bundle", return_value=([item], [{**item, "also": []}])) as bundle_loader,
                patch.object(builder, "load_editorial_content", return_value=content) as editorial_loader,
            ):
                builder.main()

            self.assertTrue((insights / "rudi-daily-ai-news-2026-08-09.html").is_file())
            bundle_loader.assert_called_once()
            editorial_loader.assert_called_once()

    def test_bundle_and_editorial_json_render_without_daily_content_entry(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            bundle_path = root / "rundown_bundle.json"
            editorial_path = root / "editorial_copy.json"
            sources = [
                {
                    "source_id": "source-primary",
                    "title": "Primary AI Story",
                    "url": "https://example.com/primary",
                    "canonical_url": "https://example.com/primary",
                    "domain": "example.com",
                    "category": "Products",
                    "content_role": "news_story",
                    "importance": 5,
                    "summary": "The primary grounded summary.",
                },
                {
                    "source_id": "source-secondary",
                    "title": "Secondary Coverage",
                    "url": "https://example.net/secondary",
                    "canonical_url": "https://example.net/secondary",
                    "domain": "example.net",
                    "category": "Products",
                    "content_role": "news_story",
                    "importance": 4,
                    "summary": "A second grounded account.",
                },
            ]
            bundle_path.write_text(
                json.dumps(
                    {
                        "version": "rudi-rundown-bundle-v1",
                        "topic": "ai",
                        "edition_date": "2026-08-09",
                        "edition_status": "first",
                        "input_runs": [],
                        "counts": {
                            "input_run_count": 0,
                            "union_source_count": 2,
                            "exclusion_count": 0,
                            "rundown_source_count": 2,
                            "rundown_entry_count": 1,
                            "citation_count": 2,
                            "structured_data_item_count": 2,
                        },
                        "exclusions": [],
                        "sources": sources,
                        "entries": [
                            {
                                "entry_id": "entry-one",
                                "member_source_ids": [
                                    "source-primary",
                                    "source-secondary",
                                ],
                                "representative_source_id": "source-primary",
                                "representative_rationale": {"method": "fixture"},
                            }
                        ],
                    },
                    ensure_ascii=False,
                )
                + "\n",
                encoding="utf-8",
            )
            qa = [
                {
                    "question": f"Question {number}?",
                    "answer": f"Grounded answer {number}.",
                    "title_substring": "Primary AI Story",
                    "source_label": "Example",
                }
                for number in range(1, 7)
            ]
            editorial_path.write_text(
                json.dumps(
                    {
                        "version": "rudi-editorial-copy-v1",
                        "edition_date": "2026-08-09",
                        "topics": "Primary AI Story",
                        "dek": "One verified product story led the edition.",
                        "open": [
                            {
                                "segments": [
                                    {
                                        "kind": "text",
                                        "text": "The day opened with ",
                                        "title_substring": "",
                                    },
                                    {
                                        "kind": "link",
                                        "text": "one verified story",
                                        "title_substring": "Primary AI Story",
                                    },
                                    {
                                        "kind": "text",
                                        "text": ".",
                                        "title_substring": "",
                                    },
                                ]
                            },
                            {
                                "segments": [
                                    {
                                        "kind": "text",
                                        "text": "A second source corroborated it.",
                                        "title_substring": "",
                                    }
                                ]
                            },
                        ],
                        "qa": qa,
                    },
                    ensure_ascii=False,
                )
                + "\n",
                encoding="utf-8",
            )

            items, stories = load_bundle(
                bundle_path,
                edition_date="2026-08-09",
                edition_status="first",
            )
            content = load_editorial_content(
                editorial_path,
                edition_date="2026-08-09",
                items=items,
                modified_date="2026-08-09",
            )
            page, story_count, source_count, category_count = build_page(
                "2026-08-09",
                "2026-08-09",
                items,
                content,
                max_day=None,
                stories=stories,
            )

            self.assertEqual((1, 2, 1), (story_count, source_count, category_count))
            self.assertEqual((1, 2), verify(page, expected_qa=6))
            self.assertIn("one verified story", page)
            self.assertIn("https://example.com/primary", page)
            self.assertIn("https://example.net/secondary", page)
            self.assertIn('href="/how-we-help/"', page)
            self.assertIn('href="/how-we-help/ai-readiness/assessment/"', page)
            self.assertIn('href="/how-we-help/ai-enablement/workforce-programs/"', page)
            self.assertIn('href="/start-here/"', page)
            self.assertIn('href="/css/rudi-legacy.css"', page)
            self.assertIn('src="/js/legacy-positioning.js"', page)
            self.assertIn("<strong>RUDI LLC</strong>", page)
            self.assertIn('href="mailto:rudi@learnrudi.com"', page)
            self.assertNotRegex(
                page,
                r"#(?:c75b39|a94d2f|f7e8e1|bd5a3f|8f3f2b)|"
                r"rgba\(\s*(?:199\s*,\s*91\s*,\s*57|169\s*,\s*77\s*,\s*47)",
            )
            self.assertNotRegex(page, r"border-(?:left|right)\s*:")
            self.assertNotIn('href="/ai-training.html"', page)
            self.assertNotIn('href="/consulting.html"', page)
            self.assertNotIn('href="/contact.html"', page)


if __name__ == "__main__":
    unittest.main()
