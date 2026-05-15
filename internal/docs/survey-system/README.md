# RUDI Survey System - Complete Reference

**Last Updated:** January 2025

This folder contains all documentation, configuration, and code related to the RUDI AI Familiarity & Adoption Survey system.

---

## 📁 Files in This Folder

| File | Description |
|------|-------------|
| `README.md` | This file - overview and quick reference |
| `google-sheets-config.md` | Google Sheets structure, IDs, and column mappings |
| `apps-script.js` | Complete Google Apps Script code |
| `setup-guide.md` | Step-by-step setup instructions |
| `user-flow.md` | How users interact with the system |
| `troubleshooting.md` | Common issues and solutions |
| `api-endpoints.md` | Webhook URLs and API documentation |

---

## 🔗 Quick Links

### Live URLs
- **Main Site:** https://learnrudi.com
- **Framework Page:** https://learnrudi.com/framework.html
- **Survey Page:** https://learnrudi.com/survey.html
- **Admin Page:** https://learnrudi.com/survey-admin.html

### Google Resources
- **Google Sheet:** https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit
- **Apps Script:** Extensions → Apps Script (from within the sheet)
- **Webhook URL:** https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec

### Source Files
- **Config:** `/js/config.js`
- **Framework HTML:** `/framework.html`
- **Survey HTML:** `/survey.html`
- **Admin HTML:** `/survey-admin.html`

---

## 🎯 System Overview

### Purpose
Collect anonymous AI familiarity and adoption data from organizations to help them understand their current AI readiness and training needs.

### Components
1. **Assessment Request Form** (framework.html) - Where orgs request survey links
2. **Survey Form** (survey.html) - The actual 9-question survey
3. **Admin Interface** (survey-admin.html) - For RUDI staff to create custom links
4. **Google Sheets Backend** - Stores all data
5. **Apps Script API** - Webhook that receives and stores submissions

---

## 📊 Data Flow

```
User fills framework.html form
    ↓
JavaScript generates survey link
    ↓
Request data sent to Apps Script webhook
    ↓
Apps Script saves to "Assessment Requests" sheet
    ↓
User receives survey link immediately
    ↓
User shares link with team
    ↓
Team members take survey via survey.html
    ↓
Survey responses sent to Apps Script webhook
    ↓
Apps Script saves to "Sheet1" (Survey Responses)
```

---

## 🔧 Quick Commands

### Test Webhook
```bash
curl -X GET "https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec"
```

### Deploy Changes
```bash
cd "/Users/hoff/Desktop/My Drive/dev/projects/rudi-web"
git add .
git commit -m "Update survey system"
git push
vercel --prod
```

### View Logs
1. Open Google Sheet
2. Extensions → Apps Script
3. Click "Executions" in left sidebar

---

## 📧 Support

- **Email:** hoff@learnrudi.com
- **Site Admin:** survey-admin.html
- **Google Sheet:** [Link above]

---

## 🚀 Next Steps

1. Read `setup-guide.md` for complete setup instructions
2. Check `google-sheets-config.md` for sheet structure
3. Review `apps-script.js` for the backend code
4. See `user-flow.md` to understand the user experience
