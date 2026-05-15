# Survey System - Quick Scripts

These scripts help you test and manage the RUDI survey system.

---

## 📋 Available Scripts

### 1️⃣ Test Full Flow
**File:** `1-test-full-flow.js`

**What it does:**
- Simulates assessment request (framework.html)
- Simulates survey response (survey.html)
- Sends test data to Google Sheets

**Usage:**
```bash
node 1-test-full-flow.js
```

**When to use:**
- Testing end-to-end flow
- Verifying Apps Script is working
- Creating sample data

---

### 2️⃣ Check Headers
**File:** `2-check-headers.js`

**What it does:**
- Verifies both sheet tabs have correct column headers
- Shows which columns are wrong (if any)

**Usage:**
```bash
node 2-check-headers.js
```

**When to use:**
- After updating sheets
- Troubleshooting data issues
- Verifying setup is correct

---

### 3️⃣ Fix Headers
**File:** `3-fix-headers.js`

**What it does:**
- Automatically fixes headers in both sheets
- Sets correct column names

**Usage:**
```bash
node 3-fix-headers.js
```

**When to use:**
- Headers got corrupted
- After manual sheet edits
- Quick repair

---

### 4️⃣ Test Webhook
**File:** `4-test-webhook.js`

**What it does:**
- Tests if Google Apps Script webhook is responding
- Checks if deployment is configured correctly

**Usage:**
```bash
node 4-test-webhook.js
```

**When to use:**
- Apps Script not receiving data
- After redeploying Apps Script
- Troubleshooting 403/404 errors

---

### 5️⃣ View Recent Data
**File:** `5-view-recent-data.js`

**What it does:**
- Shows last 5 entries from both sheets
- Quick data verification

**Usage:**
```bash
node 5-view-recent-data.js
```

**When to use:**
- Checking if data is flowing
- Quick status check
- Verifying test submissions

---

## 🚀 Quick Commands

**From project root:**
```bash
# Full test
node docs/survey-system/scripts/1-test-full-flow.js

# Check setup
node docs/survey-system/scripts/2-check-headers.js

# Fix issues
node docs/survey-system/scripts/3-fix-headers.js

# Test webhook
node docs/survey-system/scripts/4-test-webhook.js

# View data
node docs/survey-system/scripts/5-view-recent-data.js
```

**From scripts folder:**
```bash
cd docs/survey-system/scripts

node 1-test-full-flow.js
node 2-check-headers.js
node 3-fix-headers.js
node 4-test-webhook.js
node 5-view-recent-data.js
```

---

## 🔧 Prerequisites

**All scripts require:**
- Node.js installed
- `googleapis` npm package (for scripts 2, 3, 5)
- Service account credentials at: `credentials.json`

**Install dependencies:**
```bash
cd /Users/hoff/Desktop/My\ Drive/dev/projects/rudi-web
npm install googleapis
```

---

## 📊 Script Outputs

### Success Examples:

**1-test-full-flow.js:**
```
🚀 RUDI Survey - Full Flow Test

📝 TEST 1: Assessment Request
✅ Assessment request sent
📋 Survey link: https://...

📊 TEST 2: Survey Response
✅ Survey response sent

✅ DONE! Check Google Sheets
```

**2-check-headers.js:**
```
📊 Checking Sheet Headers

Assessment Requests:
  ✅ A1: Timestamp
  ✅ B1: Name
  ...
  ✅ All headers correct!
```

**3-fix-headers.js:**
```
🔧 Fixing Sheet Headers

✅ Fixed Assessment Requests
   A1: Timestamp
   B1: Name
   ...

✅ DONE!
```

---

## 🐛 Troubleshooting

### "Cannot find module 'googleapis'"
```bash
npm install googleapis
```

### "credentials.json not found"
- Ensure service account credentials exist
- Check path in scripts (../../../credentials.json)

### "Webhook returning HTML"
- Apps Script not deployed as web app
- Fix: Deploy → Manage deployments → "Anyone" access

---

## 📝 Notes

- Scripts 2, 3, 5 need Google Sheets API access (service account)
- Scripts 1, 4 only need webhook URL (no auth)
- All scripts are safe to run multiple times
- Test data uses "Test Organization" name for easy filtering

---

## 🔗 Related Files

- **Apps Script Code:** `../apps-script-COPY-THIS.js`
- **Setup Guide:** `../APPS-SCRIPT-DEPLOYMENT-STEPS.md`
- **API Docs:** `../api-endpoints.md`
- **Full Documentation:** `../README.md`
