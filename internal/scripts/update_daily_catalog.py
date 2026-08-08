#!/usr/bin/env python3
"""Update LearnRUDI daily-edition catalog files after a verified local render."""

from __future__ import annotations

import argparse
import html
import json
import math
import os
import re
import tempfile
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INSIGHTS = REPO_ROOT / "public" / "insights"
DEFAULT_INDEX = DEFAULT_INSIGHTS / "index.html"
DEFAULT_SITEMAP = REPO_ROOT / "public" / "sitemap.xml"
DAILY_PATTERN = re.compile(r"^rudi-daily-ai-news-(\d{4}-\d{2}-\d{2})\.html$")


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


def update_index_html(
    source: str,
    *,
    edition_date: str,
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
    slug = _slug(edition_date)
    reading_minutes = max(4, math.ceil(story_count / 14))
    card = f'''                <a href="{slug}" style="text-decoration: none; color: inherit;">
                    <article class="article-card">
                        <div class="article-meta">
                            <span class="article-label">RUDI Daily &middot; Discovery</span>
                            <span class="article-date">{html.escape(pretty)}</span>
                            <span class="article-reading">{reading_minutes} min read</span>
                        </div>
                        <div class="article-content">
                            <h3>AI News for {html.escape(pretty)}</h3>
                            <p>{html.escape(dek.strip())} All {story_count} stories across {source_count} source links.</p>
                            <span class="article-link">Read the full edition &rarr;</span>
                        </div>
                    </article>
                </a>'''
    existing = re.compile(
        rf"[ \t]*<a href=\"{re.escape(slug)}\"[^>]*>.*?</a>",
        re.DOTALL,
    )
    matches = list(existing.finditer(source))
    if len(matches) > 1:
        raise ValueError("index contains duplicate edition cards")
    if matches:
        return source[: matches[0].start()] + card + source[matches[0].end() :]
    marker = '<div class="articles-grid daily-rundown-grid">'
    if source.count(marker) != 1:
        raise ValueError("index daily grid marker is missing or ambiguous")
    return source.replace(marker, f"{marker}\n{card}\n", 1)


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
    parser.add_argument("--sitemap", type=Path, default=DEFAULT_SITEMAP)
    parser.add_argument("--check-only", action="store_true")
    arguments = parser.parse_args()

    insights = Path(arguments.insights_dir)
    if not insights.is_absolute() or insights.is_symlink() or not insights.is_dir():
        raise SystemExit("insights-dir must be an existing absolute directory")
    index_path = _regular_path(arguments.index, "index")
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

    updates = {
        index_path: update_index_html(
            index_path.read_text(encoding="utf-8"),
            edition_date=arguments.date,
            dek=arguments.dek,
            story_count=arguments.story_count,
            source_count=arguments.source_count,
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
