#!/usr/bin/env python3
"""
Merge RUDI TechCred Deck PDFs into a single combined deck
"""

from PyPDF2 import PdfMerger
from pathlib import Path

# Define slides in order
SLIDES_IN_ORDER = [
    "slide-01-cover.pdf",
    "slide-02-what-is-rudi.pdf",
    "slide-04-rudi-framework.pdf",
    "slide-04-transition-free-training.pdf",
    "slide-06-training-delivery-formats.pdf",
    "slide-09b-pricing-packaging.pdf",
    "certificate-foundations-responsible-ai.pdf",
    "slide-10-customization-process.pdf",
    "slide-12b-timeline-deadlines.pdf",
    "slide-13-what-rudi-provides.pdf",
]

def main():
    pdf_dir = Path("pdf")
    output = pdf_dir / "RUDI-TechCred-Deck-Complete.pdf"

    print("RUDI TechCred Deck - PDF Merge")
    print("=" * 50)

    merger = PdfMerger()

    for i, slide_pdf in enumerate(SLIDES_IN_ORDER, 1):
        pdf_path = pdf_dir / slide_pdf
        if not pdf_path.exists():
            print(f"❌ Missing: {slide_pdf}")
            continue

        print(f"  {i:2d}. {slide_pdf}")
        merger.append(str(pdf_path))

    merger.write(str(output))
    merger.close()

    print("=" * 50)
    print(f"✓ Combined deck created: {output}")
    print(f"  Total slides: {len(SLIDES_IN_ORDER)}")

if __name__ == "__main__":
    main()
