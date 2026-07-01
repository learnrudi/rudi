#!/usr/bin/env python3
"""Generate the public Brandon Z. Hoff founder profile PDF."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "founder-profile.pdf"
IMG = ROOT / "public" / "images"

PAGE_W, PAGE_H = letter
MARGIN = 0.65 * inch
INK = colors.HexColor("#161616")
MUTED = colors.HexColor("#525252")
LIGHT = colors.HexColor("#f4f4f4")
LINE = colors.HexColor("#d9d9d9")
ACCENT = colors.HexColor("#c75b39")


TOPICS = [
    "AI literacy and responsible adoption for teams, educators, and executives",
    "Human-centered AI, governance, privacy, and responsible-use practices",
    "Applied AI for real estate, workforce productivity, finance, education, and product development",
    "The intersection of technology, social impact, economic mobility, and cooperative economics",
    "Community-centered AI adoption and practical implementation strategy",
]

RATES = [
    ("Live AI clinic or workflow session", "From $2,500"),
    ("30-minute keynote", "From $7,500"),
    ("60-minute keynote", "From $10,000"),
    ("Fireside chat or moderated conversation", "From $7,500"),
    ("60-90 minute applied workshop", "From $10,000"),
    ("Half-day executive or cohort workshop", "From $15,000"),
]

HIGHLIGHTS = [
    ("AfroTech 2025", "Featured keynote", "Tech Conference - Houston - 2025", "Featured keynote on responsible AI adoption at one of the largest gatherings of Black technologists in the country. Covered by Technical.ly in their conference recap."),
    ("Warren County ESC", "K-12 Education", "Cincinnati - 2024-25", "Nine-month responsible AI curriculum for 23 K-12 educators and administrators. 20 hours focused on educator productivity."),
    ("The Mercantile Library", "Civic & Community", "Cincinnati - Ongoing", "Open community education series on responsible AI use, hosted by The Mercantile Library and led by Brandon. Featured in Soapbox Cincinnati."),
    ("The Propel Center", "Higher Education", "National - Ongoing", "AI literacy curriculum and program development with The Propel Center, the HBCU innovation hub supporting students and educators in responsible AI."),
    ("Walker SCM", "Workforce", "Corporate - 2025", "Corporate-wide AI adoption strategy and rollout for an enterprise of 1,200 employees. Focus: workforce productivity and responsible adoption."),
]

ENGAGEMENTS = [
    ("K-12 & Early Education", ["Educational service centers - Across Ohio & the Midwest", "Ohio Head Start - Workshop series"]),
    ("Higher Education", ["Apple Community Education Initiative - Partner network", "Florida A&M University (FAMU) - HBCU partner", "University of Illinois Springfield - AI curriculum development"]),
    ("Workforce & Corporate", ["Crowe LLP - Keynote & fireside", "Corporate ERG groups - Workshops & programming"]),
    ("Civic & Community", ["Urban Land Institute - Cincinnati real estate speaker", "Ohio Governor's Office - AI & literacy", "The Port - Cincinnati civic engagement"]),
]

PRESS = [
    ("Technical.ly", "AfroTech 2025 Houston recap", "2025"),
    ("Soapbox Cincinnati", "The AI Sherpa Will See You Now", "2025"),
    ("Stacker / Creatie.ai", "AI was everywhere in 2024", "2024"),
]


def text_width(text, font="Helvetica", size=10):
    return pdfmetrics.stringWidth(text, font, size)


def wrap_text(text, width, font="Helvetica", size=10):
    lines = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if text_width(candidate, font, size) <= width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_label(c, text, x, y):
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(x, y, text.upper())


def draw_paragraph(c, text, x, y, width, size=10, leading=14, color=MUTED, font="Helvetica"):
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap_text(text, width, font, size):
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_image(c, path, x, y, w, h):
    if not path.exists():
        return
    img = ImageReader(str(path))
    c.drawImage(img, x, y, w, h, preserveAspectRatio=True, anchor="c", mask="auto")


def page_header(c, page_num):
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(MARGIN, PAGE_H - 0.52 * inch, "RUDI")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.48 * inch, "FOUNDER PROFILE / MEDIA KIT - 2026")
    c.setStrokeColor(LINE)
    c.line(MARGIN, PAGE_H - 0.72 * inch, PAGE_W - MARGIN, PAGE_H - 0.72 * inch)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawRightString(PAGE_W - MARGIN, 0.42 * inch, str(page_num))
    c.drawString(MARGIN, 0.42 * inch, "learnrudi.com/founder.html")


def page_one(c):
    page_header(c, 1)
    y = PAGE_H - 1.18 * inch
    draw_label(c, "Founder - Educator - Speaker - Technologist", MARGIN, y)
    y -= 0.38 * inch
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 31)
    c.drawString(MARGIN, y, "Brandon Z. Hoff")
    y -= 0.3 * inch
    c.setFont("Helvetica-Bold", 12)
    c.drawString(MARGIN, y, "Founder of RUDI (Responsible Use of Digital Intelligence)")
    y -= 0.32 * inch
    y = draw_paragraph(
        c,
        "Helping organizations adopt human-centered AI through the RUDI literacy taxonomy, applied AI, and practical implementation.",
        MARGIN,
        y,
        4.2 * inch,
        size=10.5,
        leading=15,
    )
    draw_image(c, IMG / "brandon-headshot.png", PAGE_W - MARGIN - 1.35 * inch, PAGE_H - 2.75 * inch, 1.35 * inch, 1.7 * inch)

    stat_y = y - 0.38 * inch
    stats = [("~100K", "Community"), ("Millions", "Of Views"), ("4 yrs", "Active")]
    for idx, (big, label) in enumerate(stats):
        x = MARGIN + idx * 1.45 * inch
        c.setFillColor(LIGHT)
        c.rect(x, stat_y - 0.62 * inch, 1.28 * inch, 0.62 * inch, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(x + 0.13 * inch, stat_y - 0.28 * inch, big)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 6.5)
        c.drawString(x + 0.13 * inch, stat_y - 0.47 * inch, label.upper())

    y = stat_y - 1.05 * inch
    draw_label(c, "Biography", MARGIN, y)
    y -= 0.25 * inch
    y = draw_paragraph(
        c,
        "Brandon Z. Hoff is the founder of RUDI and creator of Hoff Digital, a public education channel on responsible AI reaching nearly 100,000 community followers across TikTok, LinkedIn, YouTube, and Substack.",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
        size=9.4,
        leading=13,
    )
    y -= 0.08 * inch
    y = draw_paragraph(
        c,
        "Trained in finance and a serial social entrepreneur, Brandon began his career building early machine-learning models for predictive lending and has since led applied AI work across real estate, financial analysis, education, and workforce productivity.",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
        size=9.4,
        leading=13,
    )

    y -= 0.32 * inch
    draw_label(c, "What Brandon speaks on", MARGIN, y)
    y -= 0.22 * inch
    for topic in TOPICS:
        c.setFillColor(ACCENT)
        c.circle(MARGIN + 0.05 * inch, y + 0.04 * inch, 1.5, stroke=0, fill=1)
        y = draw_paragraph(c, topic, MARGIN + 0.16 * inch, y, PAGE_W - 2 * MARGIN - 0.16 * inch, size=8.8, leading=12)
        y -= 0.03 * inch


def page_two(c):
    page_header(c, 2)
    y = PAGE_H - 1.1 * inch
    draw_label(c, "Highlights", MARGIN, y)
    y -= 0.28 * inch
    draw_image(c, IMG / "afrotech-2025.jpg", MARGIN, y - 1.2 * inch, 2.0 * inch, 1.2 * inch)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(MARGIN + 2.25 * inch, y - 0.2 * inch, "AfroTech 2025")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN + 2.25 * inch, y - 0.4 * inch, "Featured keynote - Tech Conference - Houston - 2025")
    draw_paragraph(c, HIGHLIGHTS[0][3], MARGIN + 2.25 * inch, y - 0.65 * inch, PAGE_W - MARGIN * 2 - 2.25 * inch, size=8.8, leading=12)
    y -= 1.55 * inch

    card_w = (PAGE_W - 2 * MARGIN - 0.24 * inch) / 2
    card_h = 1.48 * inch
    for idx, item in enumerate(HIGHLIGHTS[1:]):
        col = idx % 2
        row = idx // 2
        x = MARGIN + col * (card_w + 0.24 * inch)
        cy = y - row * (card_h + 0.22 * inch)
        c.setFillColor(LIGHT)
        c.rect(x, cy - card_h, card_w, card_h, stroke=0, fill=1)
        draw_label(c, item[1], x + 0.18 * inch, cy - 0.24 * inch)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 10.5)
        c.drawString(x + 0.18 * inch, cy - 0.48 * inch, item[0])
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7.5)
        c.drawString(x + 0.18 * inch, cy - 0.66 * inch, item[2])
        draw_paragraph(c, item[3], x + 0.18 * inch, cy - 0.88 * inch, card_w - 0.36 * inch, size=7.8, leading=10.5)

    y -= 3.28 * inch
    draw_label(c, "What partners say", MARGIN, y)
    y -= 0.24 * inch
    quote = '"Members of our REAL 7.0 cohort walked away energized and inspired. The group described the session as high-energy and packed with actionable tips and resources."'
    y = draw_paragraph(c, quote, MARGIN, y, PAGE_W - 2 * MARGIN, size=9, leading=12.5, color=INK, font="Helvetica-Oblique")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(MARGIN, y - 0.08 * inch, "Kim Fantaci, Director, ULI Cincinnati - April 15, 2026")

    y -= 0.55 * inch
    draw_label(c, "Selected engagements", MARGIN, y)
    y -= 0.24 * inch
    col_w = (PAGE_W - 2 * MARGIN - 0.35 * inch) / 2
    for idx, (heading, items) in enumerate(ENGAGEMENTS):
        col = idx % 2
        row = idx // 2
        x = MARGIN + col * (col_w + 0.35 * inch)
        ey = y - row * 0.78 * inch
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(x, ey, heading)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7.2)
        for item in items:
            ey -= 0.16 * inch
            c.drawString(x, ey, item[:76])


def page_three(c):
    page_header(c, 3)
    y = PAGE_H - 1.1 * inch
    draw_label(c, "Booking & Speaking", MARGIN, y)
    y -= 0.32 * inch
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 17)
    c.drawString(MARGIN, y, "Pricing framework")
    y -= 0.28 * inch
    y = draw_paragraph(
        c,
        "Brandon is available for clinics, workshops, keynotes, fireside chats, and advisory sessions for organizations working through responsible AI adoption.",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
        size=9.5,
        leading=13,
    )
    y -= 0.2 * inch
    for name, price in RATES:
        c.setStrokeColor(LINE)
        c.line(MARGIN, y + 0.08 * inch, PAGE_W - MARGIN, y + 0.08 * inch)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 9.5)
        c.drawString(MARGIN, y - 0.12 * inch, name)
        c.setFont("Helvetica-Bold", 9.5)
        c.drawRightString(PAGE_W - MARGIN, y - 0.12 * inch, price)
        y -= 0.42 * inch
    c.setStrokeColor(LINE)
    c.line(MARGIN, y + 0.12 * inch, PAGE_W - MARGIN, y + 0.12 * inch)
    y -= 0.12 * inch
    y = draw_paragraph(
        c,
        "These are starting points. Participant count, session length, travel, custom curriculum, multi-session programs, and private advisory work are scoped separately. Nonprofit, education, and community discounts are available.",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
        size=8.6,
        leading=12,
    )
    y -= 0.28 * inch
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(MARGIN, y, "Request availability")
    y -= 0.2 * inch
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.5)
    c.drawString(MARGIN, y, "hoff@learnrudi.com - learnrudi.com/founder.html")

    y -= 0.55 * inch
    draw_label(c, "Press & Recognition", MARGIN, y)
    y -= 0.26 * inch
    for outlet, title, year in PRESS:
        c.setStrokeColor(LINE)
        c.line(MARGIN, y + 0.08 * inch, PAGE_W - MARGIN, y + 0.08 * inch)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 7.2)
        c.drawString(MARGIN, y - 0.1 * inch, outlet.upper())
        c.setFillColor(INK)
        c.setFont("Helvetica", 9)
        c.drawString(MARGIN + 1.45 * inch, y - 0.1 * inch, title)
        c.setFillColor(MUTED)
        c.drawRightString(PAGE_W - MARGIN, y - 0.1 * inch, year)
        y -= 0.38 * inch

    y -= 0.35 * inch
    draw_label(c, "Education & Credentials", MARGIN, y)
    y -= 0.26 * inch
    draw_paragraph(
        c,
        "MBA Finance & Social Entrepreneurship, EDHEC University - IBM AI Developer - DeepLearning.AI - MIT xPRO",
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
        size=9.2,
        leading=13,
        color=INK,
    )


def main():
    c = canvas.Canvas(str(OUT), pagesize=letter)
    c.setTitle("Brandon Z. Hoff - Founder, RUDI")
    c.setAuthor("RUDI")
    page_one(c)
    c.showPage()
    page_two(c)
    c.showPage()
    page_three(c)
    c.save()


if __name__ == "__main__":
    main()
