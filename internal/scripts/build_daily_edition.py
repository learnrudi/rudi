#!/usr/bin/env python3
"""Build one RUDI Daily edition page from extractor-email discovery artifacts.

Usage:
    python3 internal/scripts/build_daily_edition.py --date 2026-07-15

Reads every capture pass under output/discovery/<date>/*/ in the extractor
workspace, unions by URL (later pass wins on duplicates, order keeps first
appearance, per-run manifest cross-checks fail loudly), filters bare-root
homepage URLs, clusters conservative same-story coverage, merges the editorial
content for the date from daily_content.py, verifies (story/citation/ItemList
reconciliation, escape-leak scan, JSON-LD parse), and writes the page into
public/insights/. It does NOT touch the insights index or sitemap — those are
small manual patches documented in the operator handoff.

This is the operator-assisted reference renderer described by ADR 0008 in the
extractor repo (docs/adr/0008-publish-rudi-rundown-from-discovery-sidecars.md);
editions before 2026-07-15 keep their original rudi-rundown-* URLs and are
committed history — this script refuses to rebuild them.
"""
import argparse
import html
import json
import os
import re
import sys
from collections import Counter, OrderedDict
from datetime import date as Date
from pathlib import Path

EXTRACTOR = os.environ.get("RUDI_DAILY_EXTRACTOR", "/Users/hoff/dev/tools/private/extractor-email")
INSIGHTS = Path(__file__).resolve().parents[2] / "public" / "insights"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from daily_content import DAY  # noqa: E402


MAX_JSON_BYTES = 20_000_000
CONTENT_ROLES = frozenset({
    "news_story",
    "analysis_or_context",
    "tool_or_product",
    "research_paper",
    "social_post",
    "ad_or_sponsored",
    "job_or_event",
    "reference",
    "non_news",
    "unknown",
})
EDITORIAL_EVIDENCE_ROLES = frozenset({
    "news_story",
    "tool_or_product",
    "research_paper",
    "social_post",
})


def esc(s):
    return html.escape(str(s), quote=True)


def domain_of(url):
    m = re.match(r"https?://(?:www\.)?([^/]+)", url or "")
    return m.group(1) if m else ""


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def page_slug(d):
    """d is a datetime.date. Editions before 2026-07-15 keep rudi-rundown-* slugs."""
    from datetime import date as _date
    prefix = "rudi-rundown-ai-news" if d < _date(2026, 7, 15) else "rudi-daily-ai-news"
    return f"{prefix}-{d.isoformat()}.html"


def load_day(date):
    import glob
    import os

    run_jsonls = sorted(
        glob.glob(f"{EXTRACTOR}/output/discovery/{date}/*/ai_discovery_annotation.jsonl"),
        key=os.path.getmtime,
    )
    if not run_jsonls:
        raise FileNotFoundError(f"{date}: no annotation runs found")
    by_url = {}
    for jp in run_jsonls:
        manifest = json.load(open(jp.replace("ai_discovery_annotation.jsonl",
                                             "ai_discovery_annotation_manifest.json")))
        run_success = 0
        for l in open(jp):
            if not l.strip():
                continue
            r = json.loads(l)
            a = (r.get("annotation") or {}).get("item") or {}
            if a.get("status") != "success":
                continue
            run_success += 1
            url = r.get("editorial_url") or r.get("canonical_url") or ""
            by_url[url] = {
                "title": r.get("title") or a.get("topic") or url,
                "url": url,
                "category": a.get("category") or "Uncategorized",
                "importance": a.get("importance") or 0,
                "summary": a.get("one_sentence_summary") or "",
            }
        if run_success != manifest["annotated_items"]:
            raise ValueError(f"{jp}: {run_success} success rows, manifest says {manifest['annotated_items']}")
    excluded = {}
    ledger = Path(f"{EXTRACTOR}/output/discovery/{date}/rundown/exclusions.json")
    if ledger.is_file():
        for e in json.load(open(ledger)):
            excluded[e["canonical_url"].rstrip("/")] = e.get("reason", "excluded")
    items, dropped = [], []
    for url, rec in by_url.items():
        if re.fullmatch(r"https?://[^/]+/?", url):
            dropped.append((rec, "bare homepage"))
        elif url.rstrip("/") in excluded:
            dropped.append((rec, excluded[url.rstrip("/")]))
        else:
            items.append(rec)
    for d, why in dropped:
        print(f"  dropped: {d['title'][:60]} ({d['url']}) — {why}")
    print(f"  {date}: union of {len(run_jsonls)} passes -> {len(items)} stories")
    return items


def _read_json_object(path, description):
    candidate = Path(path)
    if not candidate.is_absolute() or candidate.is_symlink() or not candidate.is_file():
        raise ValueError(f"{description} must be an existing absolute regular file")
    payload = candidate.read_bytes()
    if len(payload) > MAX_JSON_BYTES:
        raise ValueError(f"{description} exceeds the size limit")
    try:
        value = json.loads(payload)
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError(f"{description} must contain valid JSON") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{description} must contain an object")
    return value


def _bounded_string(value, field, maximum, *, preserve_whitespace=False):
    if not isinstance(value, str) or not value.strip() or len(value) > maximum:
        raise ValueError(f"{field} is invalid")
    return value if preserve_whitespace else value.strip()


def load_bundle(path, *, edition_date, edition_status):
    bundle = _read_json_object(path, "rundown bundle")
    expected = {
        "version", "topic", "edition_date", "edition_status", "input_runs",
        "counts", "exclusions", "sources", "entries",
    }
    if set(bundle) != expected or bundle.get("version") != "rudi-rundown-bundle-v1":
        raise ValueError("rundown bundle schema is invalid")
    if bundle.get("edition_date") != edition_date:
        raise ValueError("rundown bundle edition date does not match")
    if edition_status not in {"first", "final"} or bundle.get("edition_status") != edition_status:
        raise ValueError("rundown bundle edition status does not match")
    counts = bundle.get("counts")
    raw_sources = bundle.get("sources")
    raw_entries = bundle.get("entries")
    exclusions = bundle.get("exclusions")
    input_runs = bundle.get("input_runs")
    if not isinstance(counts, dict) or not isinstance(raw_sources, list) or not raw_sources:
        raise ValueError("rundown bundle counts or sources are invalid")
    if not isinstance(raw_entries, list) or not raw_entries:
        raise ValueError("rundown bundle entries are invalid")
    if not isinstance(exclusions, list) or not isinstance(input_runs, list):
        raise ValueError("rundown bundle provenance is invalid")
    expected_counts = {
        "input_run_count": len(input_runs),
        "union_source_count": len(raw_sources) + len(exclusions),
        "exclusion_count": len(exclusions),
        "rundown_source_count": len(raw_sources),
        "rundown_entry_count": len(raw_entries),
        "citation_count": len(raw_sources),
        "structured_data_item_count": len(raw_sources),
    }
    if counts != expected_counts:
        raise ValueError("rundown bundle counts do not reconcile")

    items = []
    by_id = {}
    urls = set()
    for raw in raw_sources:
        if not isinstance(raw, dict):
            raise ValueError("rundown bundle source is invalid")
        source_id = _bounded_string(raw.get("source_id"), "source_id", 200)
        title = _bounded_string(raw.get("title"), "title", 1_000)
        url = _bounded_string(raw.get("url"), "url", 4_000)
        category = _bounded_string(raw.get("category"), "category", 200)
        content_role = _bounded_string(raw.get("content_role"), "content_role", 100)
        summary = _bounded_string(raw.get("summary"), "summary", 5_000)
        importance = raw.get("importance")
        if not url.startswith(("https://", "http://")):
            raise ValueError("rundown bundle source URL is invalid")
        if source_id in by_id or url in urls:
            raise ValueError("rundown bundle sources must be unique")
        if isinstance(importance, bool) or not isinstance(importance, int) or not 1 <= importance <= 5:
            raise ValueError("rundown bundle source importance is invalid")
        if content_role not in CONTENT_ROLES:
            raise ValueError("rundown bundle source content role is invalid")
        item = {
            "source_id": source_id,
            "title": title,
            "url": url,
            "category": category,
            "content_role": content_role,
            "importance": importance,
            "summary": summary,
        }
        items.append(item)
        by_id[source_id] = item
        urls.add(url)

    stories = []
    assigned = []
    entry_ids = set()
    for raw in raw_entries:
        if not isinstance(raw, dict):
            raise ValueError("rundown bundle entry is invalid")
        entry_id = _bounded_string(raw.get("entry_id"), "entry_id", 200)
        members = raw.get("member_source_ids")
        representative_id = raw.get("representative_source_id")
        if entry_id in entry_ids or not isinstance(members, list) or not members:
            raise ValueError("rundown bundle entry identity is invalid")
        if any(not isinstance(value, str) or value not in by_id for value in members):
            raise ValueError("rundown bundle entry references an unknown source")
        if len(set(members)) != len(members) or representative_id not in members:
            raise ValueError("rundown bundle entry membership is invalid")
        representative = by_id[representative_id]
        stories.append({
            **representative,
            "also": [by_id[source_id] for source_id in members if source_id != representative_id],
        })
        assigned.extend(members)
        entry_ids.add(entry_id)
    if len(assigned) != len(set(assigned)) or set(assigned) != set(by_id):
        raise ValueError("rundown bundle entries must partition every source exactly once")
    return items, stories


def load_editorial_content(path, *, edition_date, items, modified_date):
    payload = _read_json_object(path, "editorial copy")
    expected = {"version", "edition_date", "topics", "dek", "open", "qa"}
    if set(payload) != expected or payload.get("version") != "rudi-editorial-copy-v1":
        raise ValueError("editorial copy schema is invalid")
    if payload.get("edition_date") != edition_date:
        raise ValueError("editorial copy edition date does not match")
    try:
        edition = Date.fromisoformat(edition_date)
        modified = Date.fromisoformat(modified_date)
    except (TypeError, ValueError) as exc:
        raise ValueError("editorial dates must use YYYY-MM-DD") from exc
    if edition.isoformat() != edition_date or modified.isoformat() != modified_date or modified < edition:
        raise ValueError("editorial dates are invalid")
    topics = _bounded_string(payload.get("topics"), "topics", 300)
    dek = _bounded_string(payload.get("dek"), "dek", 500)
    titles = tuple(item["title"] for item in items)

    def validate_substring(value):
        substring = _bounded_string(value, "title_substring", 300)
        if len([title for title in titles if substring in title]) != 1:
            raise ValueError("editorial source title must match exactly one bundle source")
        return substring

    paragraphs = payload.get("open")
    if not isinstance(paragraphs, list) or not 2 <= len(paragraphs) <= 3:
        raise ValueError("editorial copy must have two or three open paragraphs")
    normalized_paragraphs = []
    for paragraph in paragraphs:
        if not isinstance(paragraph, dict) or set(paragraph) != {"segments"}:
            raise ValueError("editorial paragraph is invalid")
        segments = paragraph.get("segments")
        if not isinstance(segments, list) or not 1 <= len(segments) <= 24:
            raise ValueError("editorial paragraph segments are invalid")
        normalized_segments = []
        for segment in segments:
            if not isinstance(segment, dict) or set(segment) != {"kind", "text", "title_substring"}:
                raise ValueError("editorial segment is invalid")
            kind = segment.get("kind")
            text = _bounded_string(
                segment.get("text"),
                "segment text",
                1_000,
                preserve_whitespace=True,
            )
            title_substring = segment.get("title_substring")
            if kind == "text" and title_substring == "":
                normalized_segments.append((kind, text, ""))
            elif kind == "link":
                normalized_segments.append((kind, text, validate_substring(title_substring)))
            else:
                raise ValueError("editorial segment source binding is invalid")
        normalized_paragraphs.append(tuple(normalized_segments))

    raw_qa = payload.get("qa")
    if not isinstance(raw_qa, list) or not 6 <= len(raw_qa) <= 10:
        raise ValueError("editorial copy must have six to ten questions")
    qa = []
    for entry in raw_qa:
        fields = {"question", "answer", "title_substring", "source_label"}
        if not isinstance(entry, dict) or set(entry) != fields:
            raise ValueError("editorial question is invalid")
        qa.append((
            _bounded_string(entry.get("question"), "question", 300),
            _bounded_string(entry.get("answer"), "answer", 1_200),
            validate_substring(entry.get("title_substring")),
            _bounded_string(entry.get("source_label"), "source_label", 200),
        ))

    def render_open(linker):
        rendered = []
        for paragraph in normalized_paragraphs:
            rendered.append("".join(
                esc(text) if kind == "text" else linker(title_substring, text)
                for kind, text, title_substring in paragraph
            ))
        return rendered

    return {
        "topics": topics,
        "dek": dek,
        "modified": modified_date,
        "open": render_open,
        "qa": qa,
    }


def cluster_stories(items):
    """Same-category, conservative: title >=0.93, or >=0.75 with summary >=0.55.
    Tuned on July 2026 data — xAI/OpenAI/Claude release-notes pages share title
    structure (0.86) but not summaries (0.35) and must NOT merge."""
    from difflib import SequenceMatcher

    def norm(t):
        t = re.split(r" [-|·] ", t)[0]
        return re.sub(r"[^a-z0-9 ]", "", t.lower()).strip()

    stories, used = [], set()
    for i, a in enumerate(items):
        if i in used:
            continue
        group = [a]
        for j in range(i + 1, len(items)):
            b = items[j]
            if j in used or b["category"] != a["category"]:
                continue
            st = SequenceMatcher(None, norm(a["title"]), norm(b["title"])).ratio()
            ss = SequenceMatcher(None, a["summary"].lower(), b["summary"].lower()).ratio()
            if st >= 0.93 or (st >= 0.75 and ss >= 0.55):
                group.append(b)
                used.add(j)
        used.add(i)
        primary = max(group, key=lambda g: g["importance"])
        stories.append({**primary, "also": [g for g in group if g is not primary]})
    return stories


def make_linker(items):
    def resolve(substr):
        hits = [item for item in items if substr in item["title"]]
        if len(hits) != 1:
            raise KeyError(
                f"story title must resolve to exactly one source: {substr!r}"
            )
        return hits[0]

    def L(substr, text):
        item = resolve(substr)
        return f'<a href="{esc(item["url"])}" rel="noopener" target="_blank">{esc(text)}</a>'

    def U(substr):
        return resolve(substr)["url"]

    return L, U


STYLE = """        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --gray-900:#161616; --gray-800:#262626; --gray-700:#393939; --gray-600:#525252; --gray-500:#6f6f6f; --gray-400:#8d8d8d; --gray-300:#a8a8a8; --gray-200:#c6c6c6; --gray-100:#e0e0e0; --gray-50:#f4f4f4; --white:#fff; --accent:#4355d8; --accent-dark:#2e3aa0; }
        body { font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,sans-serif; color:var(--gray-800); line-height:1.65; background:var(--white); }
        .nav { position:fixed; top:0; left:0; right:0; z-index:1000; background:var(--white); border-bottom:1px solid var(--gray-100); }
        .nav-inner { max-width:1400px; margin:0 auto; padding:0 2rem; height:72px; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { font-size:1.5rem; font-weight:700; color:var(--gray-900); text-decoration:none; }
        .nav-links { display:flex; gap:2.5rem; list-style:none; }
        .nav-links a { font-size:.875rem; font-weight:500; color:var(--gray-600); text-decoration:none; text-transform:uppercase; letter-spacing:.05em; }
        .nav-links a.active, .nav-links a:hover { color:var(--gray-900); }
        .article-header { padding:10rem 0 4rem; background:var(--gray-900); color:var(--white); }
        .article-header-inner { max-width:900px; margin:0 auto; padding:0 2rem; }
        .eyebrow { font-size:.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:var(--accent); margin-bottom:1rem; }
        h1 { font-size:clamp(2.1rem,4vw,3.25rem); line-height:1.1; font-weight:400; margin-bottom:1.25rem; }
        .subtitle { color:var(--gray-300); font-size:1.25rem; line-height:1.6; max-width:780px; }
        .meta-line { display:flex; gap:1rem; flex-wrap:wrap; margin-top:1.5rem; color:var(--gray-400); font-family:'IBM Plex Mono',monospace; font-size:.82rem; }
        main { max-width:900px; margin:0 auto; padding:4rem 2rem; }
        h2 { font-size:1.65rem; line-height:1.25; color:var(--gray-900); margin:3rem 0 1rem; padding-top:2rem; border-top:1px solid var(--gray-100); }
        h2 .cat-count { font-family:'IBM Plex Mono',monospace; font-size:.9rem; color:var(--gray-500); font-weight:400; margin-left:.5rem; }
        p { font-size:1.1rem; line-height:1.85; margin-bottom:1.35rem; color:var(--gray-700); }
        .lead { font-size:1.22rem; color:var(--gray-800); }
        .qa { padding:1.25rem 0; border-bottom:1px solid var(--gray-100); }
        .qa:last-of-type { border-bottom:0; }
        .qa h3 { font-size:1.12rem; color:var(--gray-900); margin-bottom:.5rem; }
        .qa p { font-size:1.02rem; line-height:1.75; margin:0; }
        .toc { margin:1rem 0 1.5rem; font-size:.95rem; line-height:2; color:var(--gray-500); }
        .item { padding:1.1rem 0; border-bottom:1px solid var(--gray-100); }
        .item:last-child { border-bottom:0; }
        .item a { font-size:1.08rem; font-weight:500; line-height:1.45; }
        .item .item-domain { display:inline-block; margin-left:.6rem; font-family:'IBM Plex Mono',monospace; font-size:.78rem; color:var(--gray-400); }
        .item p { font-size:1rem; line-height:1.7; margin:.45rem 0 0; color:var(--gray-600); }
        .item p.item-also { font-size:.85rem; color:var(--gray-500); margin-top:.4rem; }
        a { color:var(--accent); text-decoration:underline; text-underline-offset:3px; }
        a:hover { color:var(--accent-dark); }
        .colophon { background:var(--gray-50); border-top:3px solid var(--accent); padding:1.75rem; margin-top:3.5rem; }
        .colophon p { font-size:1rem; margin-bottom:.85rem; }
        .colophon p:last-child { margin-bottom:0; }
        .related { display:flex; justify-content:space-between; gap:1rem; margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--gray-100); }
        footer { background:var(--gray-900); padding:3rem 2rem; color:var(--gray-300); }
        .footer-inner { max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; gap:2rem; flex-wrap:wrap; }
        .footer-inner a { color:var(--gray-300); margin-left:1rem; }
        @media (max-width:780px) { .nav-links { display:none; } .related { flex-direction:column; } }"""


def build_page(day, date, items, content, max_day, *, stories=None, binding_items=None):
    from datetime import date as _date, timedelta
    d = _date.fromisoformat(date)
    dnum = d.day
    pretty = f"{d.strftime('%B')} {d.day}, {d.year}"
    stories = cluster_stories(items) if stories is None else stories
    counts = Counter(s["category"] for s in stories)
    cats = sorted(counts, key=lambda c: (-counts[c], c.lower()))
    grouped = OrderedDict((c, sorted([s for s in stories if s["category"] == c],
                                     key=lambda s: -s["importance"])) for c in cats)
    n, ncats, n_links = len(stories), len(grouped), len(items)
    canonical = f"https://learnrudi.com/insights/{page_slug(d)}"

    L, U = make_linker(items if binding_items is None else binding_items)
    open_html = "\n".join(f'<p class="{"lead" if idx == 0 else ""}">{p}</p>'.replace(' class=""', '')
                          for idx, p in enumerate(content["open"](L)))
    qa_html = "\n".join(
        f'<div class="qa"><h3>{esc(q)}</h3><p>{esc(a)} '
        f'<a href="{esc(U(sub))}" rel="noopener" target="_blank">{esc(src)} &rarr;</a></p></div>'
        for q, a, sub, src in content["qa"]
    )
    toc = " &middot; ".join(f'<a href="#{slug(c)}">{esc(c)} ({len(rs)})</a>' for c, rs in grouped.items())
    sections = []
    for c, rs in grouped.items():
        entries = []
        for s in rs:
            also = ""
            if s["also"]:
                links = " &middot; ".join(
                    f'<a href="{esc(o["url"])}" rel="noopener" target="_blank">{esc(domain_of(o["url"]))}</a>'
                    for o in s["also"]
                )
                also = f'<p class="item-also">Also reported by: {links}</p>'
            entries.append(
                '<div class="item">'
                f'<a href="{esc(s["url"])}" rel="noopener" target="_blank">{esc(s["title"])}</a>'
                f'<span class="item-domain">{esc(domain_of(s["url"]))}</span>'
                f'<p>{esc(s["summary"])}</p>{also}</div>'
            )
        word = "story" if len(rs) == 1 else "stories"
        sections.append(f'<h2 id="{slug(c)}">{esc(c)}<span class="cat-count">{len(rs)} {word}</span></h2>\n' + "\n".join(entries))
    rundown_html = "\n".join(sections)

    title = f"AI News for {pretty}: {content['topics']} | The RUDI Daily"
    desc = (f"AI news for {pretty}: {content['dek']} All {n} stories from the day, "
            f"categorized and linked — The RUDI Daily.")
    news_ld = {
        "@context": "https://schema.org", "@type": "NewsArticle",
        "headline": f"AI News for {pretty}: {content['topics']}",
        "description": desc, "datePublished": date, "dateModified": content.get("modified", date),
        "author": {"@type": "Organization", "name": "RUDI", "url": "https://learnrudi.com"},
        "publisher": {"@type": "Organization", "name": "RUDI", "url": "https://learnrudi.com"},
        "mainEntityOfPage": canonical, "articleSection": "The RUDI Daily",
        "keywords": [f"AI news {pretty}", "AI news today", "The RUDI Daily", "RUDI Rundown"] + cats,
        "citation": [{"@type": "CreativeWork", "name": i["title"], "url": i["url"]} for i in items],
    }
    all_links_ordered = [l for rs in grouped.values() for s in rs for l in ([s] + s["also"])]
    list_ld = {
        "@context": "https://schema.org", "@type": "ItemList",
        "name": f"All AI news story links for {pretty}", "numberOfItems": n_links,
        "itemListElement": [
            {"@type": "ListItem", "position": p + 1, "name": l["title"], "url": l["url"]}
            for p, l in enumerate(all_links_ordered)
        ],
    }
    faq_ld = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": f"{a} Source: {src} — {U(sub)}"}}
            for q, a, sub, src in content["qa"]
        ],
    }
    d_prev, d_next = d - timedelta(days=1), d + timedelta(days=1)
    prev_link = (f'<a href="{page_slug(d_prev)}">&larr; {d_prev.strftime("%B")} {d_prev.day} Edition</a>'
                 if d_prev >= _date(2026, 7, 1) else "<span></span>")
    next_link = (f'<a href="{page_slug(d_next)}">{d_next.strftime("%B")} {d_next.day} Edition &rarr;</a>'
                 if max_day is not None and dnum < max_day else "<span></span>")

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{esc(title)}</title>
    <meta name="description" content="{esc(desc)}">
    <meta name="author" content="RUDI">
    <link rel="canonical" href="{canonical}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{canonical}">
    <meta property="og:title" content="AI News for {pretty}: {esc(content['topics'])}">
    <meta property="og:description" content="{esc(desc)}">
    <meta property="og:image" content="https://learnrudi.com/og.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="AI News for {pretty} | The RUDI Daily">
    <meta name="twitter:description" content="{esc(desc)}">
    <script type="application/ld+json">{json.dumps(news_ld, indent=1, ensure_ascii=False)}</script>
    <script type="application/ld+json">{json.dumps(list_ld, indent=1, ensure_ascii=False)}</script>
    <script type="application/ld+json">{json.dumps(faq_ld, indent=1, ensure_ascii=False)}</script>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
{STYLE}
    </style>
    <script>window.va=window.va||function(){{(window.vaq=window.vaq||[]).push(arguments);}};</script>
    <script defer src="/_vercel/insights/script.js"></script>
    <link rel="stylesheet" href="/css/rudi-legacy.css">
</head>
<body>
    <nav class="nav"><div class="nav-inner"><a href="/" class="nav-logo">RUDI</a><ul class="nav-links"><li><a href="/how-we-help/">How We Help</a></li><li><a href="/approach/">Approach</a></li><li><a href="/case-studies/">Case Studies</a></li><li><a href="/insights/" class="active">Insights &amp; Research</a></li><li><a href="/greater-cincinnati/">Greater Cincinnati</a></li><li><a href="/about.html">About</a></li><li><a href="/start-here/">Start Here</a></li></ul></div></nav>
    <header class="article-header"><div class="article-header-inner"><div class="eyebrow">The RUDI Daily</div><h1>AI News for {pretty}</h1><p class="subtitle">{esc(content['dek'])} All {n} stories from the day, below.</p><div class="meta-line"><span>{pretty}</span><span>{n} stories{f" &middot; {n_links} source links" if n_links > n else ""} &middot; {ncats} categories</span></div></div></header>
    <main>
{open_html}
        <h2>What People Are Asking</h2>
        {qa_html}
        <h2>Every Story From {d.strftime("%B")} {dnum}</h2>
        <p class="toc">Jump to: {toc}</p>
        {rundown_html}
        <aside class="newsletter-cta" aria-labelledby="newsletter-cta-heading"><div><p class="newsletter-cta-label">The RUDI Newsletter</p><h2 id="newsletter-cta-heading">Get the signal in your inbox.</h2><p>Follow what changed, why it matters to organizations, and what leaders should watch next. Free and paid subscriptions are available.</p></div><a class="newsletter-cta-button" href="/newsletter/">Subscribe to RUDI &rarr;</a></aside>
        <div class="colophon"><p><strong>About the RUDI Daily.</strong> Responsible Use of Digital Intelligence, daily. Compiled each day from same-day reporting across the web &mdash; every story links to its original publisher. <a href="about-the-rundown.html">How we build it &rarr;</a></p><p><strong>Preparing your organization for AI?</strong> RUDI helps organizations assess readiness, set strategy, enable people, drive adoption, and implement AI responsibly. <a href="/how-we-help/ai-readiness/assessment/">AI Readiness Assessment</a> &middot; <a href="/how-we-help/ai-enablement/workforce-programs/">Workforce Programs</a> &middot; <a href="/start-here/">Start Here</a></p></div>
        <div class="related">{prev_link}<a href="/insights/">All Insights</a>{next_link}</div>
    </main>
    <footer><div class="footer-inner"><div><strong>RUDI LLC</strong><br>AI Readiness &amp; Enablement.</div><div><a href="/newsletter/">Newsletter</a><a href="/how-we-help/">How We Help</a><a href="/approach/">Approach</a><a href="/start-here/">Start Here</a><a href="mailto:rudi@learnrudi.com">Email RUDI</a></div></div></footer>
    <script src="/js/legacy-positioning.js" defer></script>
</body>
</html>
"""
    return page, n, n_links, ncats


def verify(page_html, expected_qa):
    types = {}
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', page_html, re.S):
        d = json.loads(b)
        t = d["@type"]
        if t == "NewsArticle":
            types["cite"] = len(d["citation"])
        elif t == "ItemList":
            types["list"] = d["numberOfItems"]
            assert len(d["itemListElement"]) == d["numberOfItems"]
        elif t == "FAQPage":
            types["faq"] = len(d["mainEntity"])
    items = page_html.count('<div class="item">')
    qa = page_html.count('<div class="qa">')
    body = page_html[page_html.find("<body"):]
    leaks = re.findall(r"&amp;(mdash|ndash|rsquo|ldquo|rdquo|middot|rarr|larr|apos)\b", body)
    retired_hrefs = (
        "/ai-training.html",
        "/consulting.html",
        "/capabilities.html",
        "/training.html",
        "/contact.html",
    )
    required_hrefs = (
        "/how-we-help/",
        "/approach/",
        "/how-we-help/ai-readiness/assessment/",
        "/how-we-help/ai-enablement/workforce-programs/",
        "/start-here/",
        "/newsletter/",
    )
    assert types["cite"] == types["list"] >= items, f"count mismatch: {types} vs {items} visible"
    assert qa == types["faq"] == expected_qa, f"qa mismatch: {qa}/{types['faq']} expected {expected_qa}"
    assert not leaks, f"escape leaks: {leaks}"
    for href in retired_hrefs:
        assert f'href="{href}"' not in body, f"retired Daily link returned: {href}"
    for href in required_hrefs:
        assert f'href="{href}"' in body, f"new Daily navigation or funnel link missing: {href}"
    required_design = (
        'href="/css/rudi-legacy.css"',
        'src="/js/legacy-positioning.js"',
        "<strong>RUDI LLC</strong>",
        'href="mailto:rudi@learnrudi.com"',
    )
    for fragment in required_design:
        assert fragment in page_html, f"Daily design contract is missing: {fragment}"
    retired_clay = re.search(
        r"#(?:c75b39|a94d2f|f7e8e1|bd5a3f|8f3f2b)|"
        r"rgba\(\s*(?:199\s*,\s*91\s*,\s*57|169\s*,\s*77\s*,\s*47)",
        page_html,
        re.I,
    )
    assert retired_clay is None, f"retired Daily clay color returned: {retired_clay.group(0)}"
    assert re.search(r"border-(?:left|right)\s*:", page_html, re.I) is None, (
        "Daily design contract contains a decorative side border"
    )
    assert "AI Readiness &amp; Enablement" in body, "new Daily positioning is missing"
    return items, types["list"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", required=True, help="YYYY-MM-DD (2026-07-15 or later)")
    ap.add_argument("--edition-status", choices=("first", "final"))
    ap.add_argument("--bundle", type=Path)
    ap.add_argument("--editorial-json", type=Path)
    ap.add_argument("--modified-date")
    ap.add_argument("--max-day", type=int, default=None,
                    help="highest published day number for next-links (default: this day)")
    ap.add_argument("--check-only", action="store_true", help="build and verify, do not write")
    args = ap.parse_args()
    from datetime import date as _date
    d = _date.fromisoformat(args.date)
    if d < _date(2026, 7, 15):
        raise SystemExit("editions before 2026-07-15 are committed history; refusing to rebuild")
    automated_values = (
        args.edition_status,
        args.bundle,
        args.editorial_json,
        args.modified_date,
    )
    automated = any(value is not None for value in automated_values)
    if automated and any(value is None for value in automated_values):
        raise SystemExit(
            "automated builds require --edition-status, --bundle, "
            "--editorial-json, and --modified-date"
        )
    stories = None
    binding_items = None
    if automated:
        items, stories = load_bundle(
            args.bundle,
            edition_date=args.date,
            edition_status=args.edition_status,
        )
        binding_items = [
            item
            for item in items
            if item["content_role"] in EDITORIAL_EVIDENCE_ROLES
        ]
        if not binding_items:
            raise ValueError(
                "rundown bundle has no eligible editorial binding sources"
            )
        content = load_editorial_content(
            args.editorial_json,
            edition_date=args.date,
            items=binding_items,
            modified_date=args.modified_date,
        )
        day = args.date
    else:
        # Full ISO date is preferred; day-of-month remains for July 2026 history.
        day = args.date if args.date in DAY else str(d.day)
        if day not in DAY:
            raise SystemExit(
                f"no editorial content for {args.date} in daily_content.py — "
                f"write DAY[\"{args.date}\"] first"
            )
        items = load_day(args.date)
        content = DAY[day]
    page, n, n_links, ncats = build_page(
        day,
        args.date,
        items,
        content,
        args.max_day,
        stories=stories,
        binding_items=binding_items,
    )
    verify(page, expected_qa=len(content["qa"]))
    out = INSIGHTS / page_slug(d)
    if args.check_only:
        print(f"CHECK OK: {args.date}: {n} stories / {n_links} links / {ncats} categories -> {out} (not written)")
        return
    out.write_text(page, encoding="utf-8")
    print(f"WROTE {out}: {n} stories / {n_links} links / {ncats} categories — verified")


if __name__ == "__main__":
    main()
