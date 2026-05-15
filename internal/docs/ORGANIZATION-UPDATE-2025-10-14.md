# Project Organization Update - October 14, 2025

## Summary
Cleaned up root directory and updated landing page to reflect new deck messaging and branding.

---

## Root Directory Cleanup

### **Files Moved to `/tools/`**

#### Certificate Tools → `/tools/certificate-tools/`
- `certificate-generator.html` - Certificate creation interface
- `certificate-final-artboard.html` - Artboard version for PDF export

#### QR Tools → `/tools/qr-tools/`
- `qr-generator.html` - QR code generator
- `qr-api.html` - QR API testing tool
- `qr-simple.html` - Simple QR generator

### **Files Moved to `/.archive/certificate-drafts/`**
- `certificate-16x9.html` - Draft 16x9 certificate
- `certificate-16x9.pdf` - Draft PDF
- `certificate-16x9.png` - Draft PNG
- All PDFs from `/pdf/` directory
- All PNGs from `/png/` directory
- Removed empty `/pdf/` and `/png/` directories

### **Files Moved to `/assets/`**
- `certificate-final.html` → `/assets/certificates/`
- `certificate-final.pdf` → `/assets/certificates/`
- `rudi-qr-code.png` → `/assets/`

### **Root Directory Now Contains Only:**
- Site pages: `index.html`, `certificates.html`, `contact.html`, `courses.html`, `framework.html`, `get-certificate.html`, `ohio.html`, `research.html`, `resources.html`
- Core config: `package.json`, `README.md`, `.gitignore`
- Directories: `.git/`, `.github/`, `.archive/`, `.claude/`, `.secure/`, `.vercel/`, `assets/`, `css/`, `docs/`, `images/`, `js/`, `tools/`

---

## Landing Page Updates (`index.html`)

### **Branding Changes**
- **OLD:** "Responsible Use of Digital Intelligence"
- **NEW:** "RUDI AI"

### **Hero Section**
- **Title:** "Responsible AI Certificate & Program Training"
- **Subtitle:** "Professional AI training with TechCred-eligible certificates. Foundation to advanced levels for teams and individuals."

### **Certificate Levels**

#### **Level 1: Foundation**
- **Name:** AI Literacy (changed from "AI Literacy Certificate")
- **Label:** Level 1
- **Bullets:**
  - Core concepts
  - Basic applications
  - Assessment & certification
- **Removed:** Hour specifications

#### **Level 2: Intermediate** (Most Popular)
- **Name:** Applied AI (changed from "Applied AI Practitioner")
- **Label:** Level 2
- **Bullets:**
  - Hands-on practice
  - Real tools
  - Workflow implementation
- **Removed:** Hour specifications

#### **Level 3: Advanced**
- **Name:** AI Assistants, Agents & Workflows (changed from "AI Integration Leader")
- **Label:** Level 3
- **Bullets:**
  - Custom AI systems
  - Automation
  - Organizational integration
- **Removed:** Hour specifications

### **TechCred Section Updates**

**OLD:**
> Get 100% Reimbursement
> Ohio employers receive up to $2,000 per employee through TechCred funding

**NEW:**
> State-Funded AI Training
> Through Ohio's TechCred program, your organization can receive reimbursement for employee AI training. Up to $2,000 per employee, per credential. Up to $180,000 per organization per year.
>
> RUDI programs are pre-approved for TechCred reimbursement. We assist with application and provide all required documentation.

**Key Change:** More accurate messaging - we "assist with application" not "handle all paperwork"

### **Metadata & SEO Updates**

#### Page Title
- **OLD:** "RUDI - Professional AI Certifications | Responsible AI Training"
- **NEW:** "RUDI AI - Responsible AI Certificate & Program Training"

#### Meta Description
- **OLD:** "Get certified in responsible AI. Industry-recognized certifications in 8-20 hours..."
- **NEW:** "Professional AI training with TechCred-eligible certificates. Foundation to advanced levels: AI Literacy, Applied AI, AI Assistants & Workflows. Training provider: RUDI AI."

#### Schema.org Structured Data
- Updated organization name: "RUDI" → "RUDI AI"
- Updated course names to match new levels
- Updated course descriptions
- Removed hour specifications

---

## Alignment with Deck

All changes align with the reorganized TechCred deck:
- ✓ Training provider: RUDI AI
- ✓ Certificate levels: Foundation/Intermediate/Advanced
- ✓ Names: AI Literacy, Applied AI, AI Assistants/Agents/Workflows
- ✓ TechCred support messaging: "assist with application"
- ✓ Removed hour specifications from marketing
- ✓ Simplified, professional branding

---

## Files Updated
- `/index.html` - Landing page content and metadata
- Root directory - Organized into proper folders

## Files Created
- `/tools/certificate-tools/` - New directory
- `/tools/qr-tools/` - New directory
- `/.archive/certificate-drafts/` - New archive directory
- `/assets/certificates/` - New assets directory
- `/docs/ORGANIZATION-UPDATE-2025-10-14.md` - This file

---

**Result:** Clean root directory with consistent branding and accurate TechCred messaging across all marketing materials.
