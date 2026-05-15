# RUDI Survey System - Documentation Index

**Last Updated:** October 25, 2025

This folder contains complete documentation for the RUDI AI Familiarity & Adoption Survey system.

---

## 📁 Folder Structure

```
docs/survey-system/
├── INDEX.md (this file)                    ← Start here
├── README.md                                ← Overview & quick links
├── APPS-SCRIPT.js                          ← Google Apps Script code (COPY THIS)
├── APPS-SCRIPT-DEPLOYMENT-STEPS.md         ← How to deploy Apps Script
├── google-sheets-config.md                  ← Sheet structure & column details
├── api-endpoints.md                         ← Webhook API documentation
├── user-flow.md                            ← Complete user journey
└── scripts/                                 ← Utility scripts
    ├── README.md                            ← Scripts documentation
    ├── 1-test-full-flow.js                 ← Test complete flow
    ├── 2-check-headers.js                  ← Verify column headers
    ├── 3-fix-headers.js                    ← Repair headers
    ├── 4-test-webhook.js                   ← Test Apps Script
    ├── 5-view-recent-data.js               ← See recent entries
    └── 6-format-timestamps.js              ← Fix timestamp formatting
```

---

## 🚀 Quick Start

### 1. Setup (First Time)

**Read these in order:**
1. `README.md` - System overview
2. `google-sheets-config.md` - Understand sheet structure
3. `APPS-SCRIPT-DEPLOYMENT-STEPS.md` - Deploy the code
4. Copy `APPS-SCRIPT.js` into Google Apps Script editor

### 2. Test Everything

```bash
cd "/Users/hoff/Desktop/My Drive/dev/projects/rudi-web"

# Test complete flow
node docs/survey-system/scripts/1-test-full-flow.js

# Verify setup
node docs/survey-system/scripts/2-check-headers.js

# View data
node docs/survey-system/scripts/5-view-recent-data.js
```

### 3. Go Live

Once tests pass, your system is ready:
- Users request surveys on `framework.html`
- Get instant survey links
- Team takes survey on `survey.html`
- Data flows to Google Sheets

---

## 📚 Documentation Files

### Core Documentation

**README.md**
- System overview
- Quick links (Google Sheet, webhook, etc.)
- Access instructions

**google-sheets-config.md**
- Complete sheet structure
- Column mappings for both tabs
- Sample data formats
- How data connects between tabs

**api-endpoints.md**
- Webhook URL and configuration
- Request/response formats
- API examples (curl, JavaScript)
- Error handling

**user-flow.md**
- Step-by-step user journey
- From discovery to results
- Screenshots and examples
- Use cases

---

### Setup & Deployment

**APPS-SCRIPT.js**
- **THIS IS THE CODE TO COPY**
- Complete Google Apps Script
- Handles both assessment requests and survey responses
- Well-documented with comments

**APPS-SCRIPT-DEPLOYMENT-STEPS.md**
- Step-by-step deployment guide
- Common errors and fixes
- Deployment settings (IMPORTANT: "Anyone" access)
- Testing instructions

---

### Utility Scripts

**scripts/README.md**
- Complete scripts documentation
- Usage examples
- When to use each script

**Key Scripts:**
1. `1-test-full-flow.js` - End-to-end testing
2. `2-check-headers.js` - Verify column setup
3. `3-fix-headers.js` - Auto-repair headers
4. `4-test-webhook.js` - Test Apps Script health
5. `5-view-recent-data.js` - Quick data check
6. `6-format-timestamps.js` - Format date columns

---

## 🔗 External Resources

### Google Resources
- **Google Sheet:** https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit
- **Apps Script:** (Access via Extensions → Apps Script in sheet)
- **Webhook URL:** https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec

### Live Site URLs
- **Main Site:** https://learnrudi.com
- **Framework Page:** https://learnrudi.com/framework.html
- **Survey Page:** https://learnrudi.com/survey.html
- **Admin Page:** https://learnrudi.com/survey-admin.html

---

## 🎯 Common Tasks

### Testing
```bash
# Full flow test
node docs/survey-system/scripts/1-test-full-flow.js

# Quick health check
node docs/survey-system/scripts/4-test-webhook.js
```

### Troubleshooting
```bash
# Check if headers are correct
node docs/survey-system/scripts/2-check-headers.js

# Fix broken headers
node docs/survey-system/scripts/3-fix-headers.js

# Fix timestamp formatting
node docs/survey-system/scripts/6-format-timestamps.js
```

### Viewing Data
```bash
# See recent submissions
node docs/survey-system/scripts/5-view-recent-data.js

# Or open Google Sheet directly
open "https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit"
```

---

## 🐛 Troubleshooting

### Problem: Data not appearing in sheets
**Check:**
1. Apps Script deployed with "Anyone" access? (`APPS-SCRIPT-DEPLOYMENT-STEPS.md`)
2. Webhook responding? (`scripts/4-test-webhook.js`)
3. Sheet tab names correct? ("Sheet1" and "Assessment Requests")

### Problem: Timestamp formatting issues
**Fix:**
```bash
node docs/survey-system/scripts/6-format-timestamps.js
```

### Problem: Headers corrupted
**Fix:**
```bash
node docs/survey-system/scripts/3-fix-headers.js
```

### Problem: Apps Script errors
**Check:**
- Apps Script execution logs (Apps Script editor → Executions)
- Verify sheet tab names match code
- Check `APPS-SCRIPT-DEPLOYMENT-STEPS.md` for deployment settings

---

## 📧 Support

**Questions or issues?**
- Check `APPS-SCRIPT-DEPLOYMENT-STEPS.md` for deployment help
- Review `api-endpoints.md` for API details
- Run diagnostic scripts in `scripts/` folder
- Contact: hoff@learnrudi.com

---

## 🔄 Maintenance

### Regular Tasks
- Monitor Google Sheets for new submissions
- Review Apps Script execution logs (Extensions → Apps Script → Executions)
- Test webhook health occasionally: `scripts/4-test-webhook.js`

### Updates
- Apps Script code is in `APPS-SCRIPT.js`
- After updating, redeploy as "New version"
- Test with `scripts/1-test-full-flow.js`

---

## ✅ Quick Status Check

Run these to verify everything works:

```bash
cd "/Users/hoff/Desktop/My Drive/dev/projects/rudi-web"

# 1. Test webhook
node docs/survey-system/scripts/4-test-webhook.js

# 2. Check headers
node docs/survey-system/scripts/2-check-headers.js

# 3. Test flow
node docs/survey-system/scripts/1-test-full-flow.js

# 4. View results
node docs/survey-system/scripts/5-view-recent-data.js
```

If all pass ✅, system is healthy!

---

**Need help? Start with `README.md` or `APPS-SCRIPT-DEPLOYMENT-STEPS.md`**
