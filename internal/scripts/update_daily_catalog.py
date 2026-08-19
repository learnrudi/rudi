#!/usr/bin/env python3
"""Update LearnRUDI daily-edition catalog files after a verified local render."""

from __future__ import annotations

import argparse
from collections import Counter
from collections.abc import Mapping
import html
from html.parser import HTMLParser
import json
import os
import re
import tempfile
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INSIGHTS = REPO_ROOT / "public" / "insights"
DEFAULT_INDEX = DEFAULT_INSIGHTS / "index.html"
DEFAULT_ARCHIVE = DEFAULT_INSIGHTS / "rudi-daily" / "index.html"
DEFAULT_SITEMAP = REPO_ROOT / "public" / "sitemap.xml"
DAILY_PATTERN = re.compile(r"^rudi-daily-ai-news-(\d{4}-\d{2}-\d{2})\.html$")
DAILY_HREF_PATTERN = re.compile(
    r'''href=["'](?:/insights/)?rudi-daily-ai-news-(\d{4}-\d{2}-\d{2})\.html["']'''
)
LATEST_START = "<!-- RUDI_DAILY_LATEST_START -->"
LATEST_END = "<!-- RUDI_DAILY_LATEST_END -->"
ARCHIVE_START = "<!-- RUDI_DAILY_ARCHIVE_START -->"
ARCHIVE_END = "<!-- RUDI_DAILY_ARCHIVE_END -->"
ARCHIVE_HEADING_MARKER = "<!-- RUDI_DAILY_ARCHIVE_HEADING_MONTH_NEUTRAL -->"
ARCHIVE_FEATURED_COUNT = 7
ARCHIVE_PREVIEW_MAX_LENGTH = 500


class _EditionSubtitleParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._capturing = False
        self.invalid = False
        self._parts: list[str] = []
        self.matches: list[str] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        classes = next((value for name, value in attrs if name == "class"), None)
        if tag == "p" and classes and "subtitle" in classes.split():
            if self._capturing:
                self.invalid = True
                return
            self._capturing = True
            self._parts = []

    def handle_startendtag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        classes = next((value for name, value in attrs if name == "class"), None)
        if tag == "p" and classes and "subtitle" in classes.split():
            self.matches.append("")

    def handle_endtag(self, tag: str) -> None:
        if tag == "p" and self._capturing:
            self.matches.append("".join(self._parts))
            self._parts = []
            self._capturing = False

    def handle_data(self, data: str) -> None:
        if self._capturing:
            self._parts.append(data)


def _bounded_preview(value: object, description: str) -> str:
    if not isinstance(value, str):
        raise ValueError(f"{description} must be text")
    normalized = " ".join(value.split())
    if not normalized or len(normalized) > ARCHIVE_PREVIEW_MAX_LENGTH:
        raise ValueError(f"{description} must be non-empty bounded text")
    return normalized


def extract_edition_preview(source: str) -> str:
    if not isinstance(source, str):
        raise ValueError("edition source must be text")
    parser = _EditionSubtitleParser()
    parser.feed(source)
    parser.close()
    if parser.invalid or parser._capturing or len(parser.matches) != 1:
        raise ValueError("edition subtitle is missing or ambiguous")
    preview = re.sub(
        r"\s+All \d+ stories from the day, below\.\s*$",
        "",
        parser.matches[0],
    )
    return _bounded_preview(preview, "edition subtitle")


def _date(value: str, field: str) -> date:
    try:
        parsed = date.fromisoformat(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{field} must use YYYY-MM-DD") from exc
    if parsed.isoformat() != value:
        raise ValueError(f"{field} must use YYYY-MM-DD")
    return parsed


def _slug(value: str) -> str:
    return f"rudi-daily-ai-news-{value}.html"


def _pretty(value: str) -> str:
    parsed = _date(value, "edition_date")
    return f"{parsed.strftime('%B')} {parsed.day}, {parsed.year}"


def _marker_bounds(
    source: str,
    *,
    start_marker: str,
    end_marker: str,
    description: str,
) -> tuple[int, int]:
    if source.count(start_marker) != 1 or source.count(end_marker) != 1:
        raise ValueError(f"{description} markers are missing or ambiguous")
    content_start = source.index(start_marker) + len(start_marker)
    content_end = source.index(end_marker)
    if content_start >= content_end:
        raise ValueError(f"{description} markers are out of order or empty")
    return content_start, content_end


def update_index_html(
    source: str,
    *,
    edition_date: str,
    newest_date: str,
    dek: str,
    story_count: int,
    source_count: int,
) -> str:
    if not isinstance(source, str):
        raise ValueError("index source must be text")
    if not isinstance(dek, str) or not dek.strip() or len(dek) > 500:
        raise ValueError("dek must be non-empty bounded text")
    if (
        isinstance(story_count, bool)
        or not isinstance(story_count, int)
        or story_count < 1
        or isinstance(source_count, bool)
        or not isinstance(source_count, int)
        or source_count < story_count
    ):
        raise ValueError("story and source counts are invalid")
    pretty = _pretty(edition_date)
    newest = _date(newest_date, "newest_date")
    edition = _date(edition_date, "edition_date")
    if edition > newest:
        raise ValueError("edition_date cannot follow newest_date")
    slug = _slug(edition_date)
    content_start, content_end = _marker_bounds(
        source,
        start_marker=LATEST_START,
        end_marker=LATEST_END,
        description="index latest-edition",
    )
    current_region = source[content_start:content_end]
    current_dates = DAILY_HREF_PATTERN.findall(current_region)
    if len(current_dates) != 1:
        raise ValueError("index latest-edition region must contain exactly one Daily link")
    if edition != newest or _date(current_dates[0], "current edition date") > edition:
        return source
    card = f'''<article class="card card-dark" data-rudi-daily-latest-card data-edition-date="{edition_date}"><div class="tag-row"><span class="tag tag-light">Latest edition</span><span class="tag tag-light">{html.escape(pretty)}</span></div><h3>RUDI Daily AI News</h3><p>{html.escape(dek.strip())} All {story_count} stories across {source_count} source links.</p><a class="button-link" href="/insights/{slug}">Read the latest edition</a></article>'''
    return source[:content_start] + card + source[content_end:]


def _archive_card(edition_date: str, *, latest: bool, preview: str) -> str:
    parsed = _date(edition_date, "archive edition date")
    pretty = _pretty(edition_date)
    short = f"{parsed.strftime('%b')} {parsed.day}"
    tag = "Latest" if latest else short
    safe_preview = html.escape(
        _bounded_preview(preview, f"archive preview for {edition_date}")
    )
    return f'''<article class="card" data-rudi-daily-date="{edition_date}"><div class="tag-row"><span class="tag">{tag}</span></div><h3>RUDI Daily AI News — {pretty}</h3><p data-rudi-daily-preview>{safe_preview}</p><a class="button-link" href="/insights/{_slug(edition_date)}">Read the edition</a></article>'''


def _archive_link(edition_date: str) -> str:
    return f'''<li data-rudi-daily-date="{edition_date}"><a href="/insights/{_slug(edition_date)}">{_pretty(edition_date)}</a></li>'''


def update_archive_html(
    source: str,
    *,
    edition_date: str,
    preview_by_date: Mapping[str, str],
) -> str:
    if not isinstance(source, str):
        raise ValueError("archive source must be text")
    if not isinstance(preview_by_date, Mapping):
        raise ValueError("archive previews must be a date-to-text mapping")
    _date(edition_date, "edition_date")
    if source.count(ARCHIVE_HEADING_MARKER) != 1 or not re.search(
        r'''<p\b[^>]*\bclass=["'][^"']*\beyebrow\b[^"']*["'][^>]*>\s*RUDI Daily archive\s*</p>''',
        source,
    ):
        raise ValueError("archive month-neutral heading is missing or ambiguous")
    content_start, content_end = _marker_bounds(
        source,
        start_marker=ARCHIVE_START,
        end_marker=ARCHIVE_END,
        description="archive",
    )
    current_region = source[content_start:content_end]
    managed_dates = re.findall(
        r'''data-rudi-daily-date=["'](\d{4}-\d{2}-\d{2})["']''',
        current_region,
    )
    href_dates = DAILY_HREF_PATTERN.findall(current_region)
    if not managed_dates:
        raise ValueError("archive managed region must contain at least one edition")
    if len(set(managed_dates)) != len(managed_dates):
        raise ValueError("archive managed region contains duplicate edition dates")
    if Counter(managed_dates) != Counter(href_dates):
        raise ValueError("archive managed entries and Daily links do not match")
    for current_date in managed_dates:
        _date(current_date, "archive edition date")

    all_href_dates = DAILY_HREF_PATTERN.findall(source)
    if any(count > 1 for count in Counter(all_href_dates).values()):
        raise ValueError("archive contains duplicate edition links")
    if edition_date in all_href_dates and edition_date not in managed_dates:
        if edition_date > max(managed_dates):
            raise ValueError("newer archive edition exists outside the managed region")
        return source

    ordered_dates = sorted({*managed_dates, edition_date}, reverse=True)
    featured = ordered_dates[:ARCHIVE_FEATURED_COUNT]
    older = ordered_dates[ARCHIVE_FEATURED_COUNT:]
    cards = "".join(
        _archive_card(
            value,
            latest=index == 0,
            preview=preview_by_date.get(value),
        )
        for index, value in enumerate(featured)
    )
    links = "".join(_archive_link(value) for value in older)
    replacement = (
        f'\n<div class="card-grid">{cards}</div>'
        f'<div class="link-list" style="margin-top:2rem">{links}</div>\n'
    )
    return source[:content_start] + replacement + source[content_end:]


def _replace_lastmod(source: str, canonical_url: str, modified_date: str) -> str:
    pattern = re.compile(
        rf"(<loc>{re.escape(canonical_url)}</loc>\s*<lastmod>)(\d{{4}}-\d{{2}}-\d{{2}})(</lastmod>)"
    )
    updated, count = pattern.subn(rf"\g<1>{modified_date}\g<3>", source, count=1)
    if count != 1:
        raise ValueError(f"sitemap entry is missing or ambiguous: {canonical_url}")
    return updated


def update_sitemap_xml(source: str, *, edition_date: str, modified_date: str) -> str:
    edition = _date(edition_date, "edition_date")
    modified = _date(modified_date, "modified_date")
    if modified < edition:
        raise ValueError("modified_date cannot precede edition_date")
    updated = _replace_lastmod(
        source,
        "https://learnrudi.com/insights/",
        modified_date,
    )
    canonical = f"https://learnrudi.com/insights/{_slug(edition_date)}"
    target_pattern = re.compile(
        rf"  <url>\s*<loc>{re.escape(canonical)}</loc>.*?</url>",
        re.DOTALL,
    )
    block = f'''  <url>
    <loc>{canonical}</loc>
    <lastmod>{modified_date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>'''
    matches = list(target_pattern.finditer(updated))
    if len(matches) > 1:
        raise ValueError("sitemap contains duplicate edition entries")
    if matches:
        updated = updated[: matches[0].start()] + block + updated[matches[0].end() :]
    else:
        first_daily = re.search(
            r"  <url>\s*<loc>https://learnrudi\.com/insights/rudi-daily-ai-news-",
            updated,
        )
        if first_daily is None:
            raise ValueError("sitemap daily insertion point is missing")
        updated = updated[: first_daily.start()] + block + "\n" + updated[first_daily.start() :]
    ET.fromstring(updated)
    return updated


def update_related_navigation(
    source: str,
    *,
    edition_date: str,
    previous_date: str | None,
    next_date: str | None,
) -> str:
    _date(edition_date, "edition_date")

    def link(value: str | None, *, previous: bool) -> str:
        if value is None:
            return "<span></span>"
        parsed = _date(value, "adjacent_date")
        label = f"{parsed.strftime('%B')} {parsed.day} Edition"
        arrow = "&larr; " if previous else " &rarr;"
        return f'<a href="{_slug(value)}">{arrow if previous else ""}{label}{arrow if not previous else ""}</a>'

    related = (
        '<div class="related">'
        f'{link(previous_date, previous=True)}'
        '<a href="/insights/">All Insights</a>'
        f'{link(next_date, previous=False)}'
        "</div>"
    )
    pattern = re.compile(r'<div class="related">.*?</div>', re.DOTALL)
    matches = list(pattern.finditer(source))
    if len(matches) != 1:
        raise ValueError("edition related navigation is missing or ambiguous")
    match = matches[0]
    return source[: match.start()] + related + source[match.end() :]


def _regular_path(value: Path, description: str) -> Path:
    candidate = Path(value)
    if not candidate.is_absolute() or candidate.is_symlink() or not candidate.is_file():
        raise ValueError(f"{description} must be an existing absolute regular file")
    return candidate


def _write_atomic(path: Path, value: str) -> None:
    descriptor, temporary = tempfile.mkstemp(
        prefix=f".{path.name}.", suffix=".tmp", dir=path.parent
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(value)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", required=True)
    parser.add_argument("--modified-date", required=True)
    parser.add_argument("--dek", required=True)
    parser.add_argument("--story-count", required=True, type=int)
    parser.add_argument("--source-count", required=True, type=int)
    parser.add_argument("--insights-dir", type=Path, default=DEFAULT_INSIGHTS)
    parser.add_argument("--index", type=Path, default=DEFAULT_INDEX)
    parser.add_argument("--archive", type=Path, default=DEFAULT_ARCHIVE)
    parser.add_argument("--sitemap", type=Path, default=DEFAULT_SITEMAP)
    parser.add_argument("--check-only", action="store_true")
    arguments = parser.parse_args()

    insights = Path(arguments.insights_dir)
    if not insights.is_absolute() or insights.is_symlink() or not insights.is_dir():
        raise SystemExit("insights-dir must be an existing absolute directory")
    index_path = _regular_path(arguments.index, "index")
    archive_path = _regular_path(arguments.archive, "archive")
    sitemap_path = _regular_path(arguments.sitemap, "sitemap")
    target_path = _regular_path(insights / _slug(arguments.date), "edition page")
    known_dates = sorted(
        match.group(1)
        for path in insights.iterdir()
        if path.is_file() and not path.is_symlink()
        if (match := DAILY_PATTERN.fullmatch(path.name)) is not None
    )
    if arguments.date not in known_dates:
        raise SystemExit("rendered edition is not present in insights-dir")
    position = known_dates.index(arguments.date)
    previous_date = known_dates[position - 1] if position > 0 else None
    next_date = known_dates[position + 1] if position + 1 < len(known_dates) else None
    preview_by_date = {}
    for preview_date in known_dates[-ARCHIVE_FEATURED_COUNT:]:
        preview_path = _regular_path(
            insights / _slug(preview_date), "featured edition page"
        )
        preview_by_date[preview_date] = extract_edition_preview(
            preview_path.read_text(encoding="utf-8")
        )

    updates = {
        index_path: update_index_html(
            index_path.read_text(encoding="utf-8"),
            edition_date=arguments.date,
            newest_date=known_dates[-1],
            dek=arguments.dek,
            story_count=arguments.story_count,
            source_count=arguments.source_count,
        ),
        archive_path: update_archive_html(
            archive_path.read_text(encoding="utf-8"),
            edition_date=arguments.date,
            preview_by_date=preview_by_date,
        ),
        sitemap_path: update_sitemap_xml(
            sitemap_path.read_text(encoding="utf-8"),
            edition_date=arguments.date,
            modified_date=arguments.modified_date,
        ),
        target_path: update_related_navigation(
            target_path.read_text(encoding="utf-8"),
            edition_date=arguments.date,
            previous_date=previous_date,
            next_date=next_date,
        ),
    }
    for adjacent_date in (previous_date, next_date):
        if adjacent_date is None:
            continue
        adjacent_position = known_dates.index(adjacent_date)
        adjacent_path = _regular_path(insights / _slug(adjacent_date), "adjacent page")
        updates[adjacent_path] = update_related_navigation(
            adjacent_path.read_text(encoding="utf-8"),
            edition_date=adjacent_date,
            previous_date=(
                known_dates[adjacent_position - 1] if adjacent_position > 0 else None
            ),
            next_date=(
                known_dates[adjacent_position + 1]
                if adjacent_position + 1 < len(known_dates)
                else None
            ),
        )
    changed = sorted(str(path) for path, value in updates.items() if path.read_text(encoding="utf-8") != value)
    if not arguments.check_only:
        for path, value in updates.items():
            if path.read_text(encoding="utf-8") != value:
                _write_atomic(path, value)
    print(json.dumps({"changed": changed, "check_only": arguments.check_only}, sort_keys=True))


if __name__ == "__main__":
    main()
