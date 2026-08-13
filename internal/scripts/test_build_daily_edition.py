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

    def test_cli_accepts_explicit_bundle_and_editorial_json(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            insights = root / "insights"
            insights.mkdir()
            item = {
                "title": "Explicit Story",
                "url": "https://example.com/story",
                "category": "Products",
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


if __name__ == "__main__":
    unittest.main()
