# Google Sheets Configuration

## Sheet Information

**Document Name:** RUDI-Surveys
**Sheet ID:** `1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s`
**URL:** https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit
**Owner:** hoff@learnrudi.com

---

## Sheet Tabs

### Tab 1: "Sheet1" (Survey Responses)

**Purpose:** Stores actual survey responses from team members

**Columns (11 total):**

| Column | Field Name | Type | Description | Example |
|--------|-----------|------|-------------|---------|
| A | Timestamp | DateTime | When survey was submitted | 1/15/2025 10:30:45 |
| B | Company | String | Organization name | Warren County ESC |
| C | Age Range | String | Respondent age group | 35-44 |
| D | Industry | String | Industry sector | Education (PreK-12) |
| E | AI Tools | String (CSV) | Comma-separated list of tools | ChatGPT, Claude (Anthropic) |
| F | AI Frequency | String | How often they use AI | Daily |
| G | Org AI Usage | String | Org adoption status | Several pilots across units |
| H | Comfort Level | Number (0-10) | Comfort with digital tools | 8 |
| I | AI Concerns | String (CSV) | Comma-separated concerns | Data privacy, Job displacement |
| J | 60-Day Priority | String | Top priority to solve | Save staff time on admin |
| K | Created By | Email | Who created the survey link | jane@warren.edu |

**Row 1:** Column headers (bold)
**Rows 2+:** Data entries

**Data submitted from:** `survey.html`

---

### Tab 2: "Assessment Requests"

**Purpose:** Tracks who requested survey links (for follow-up and accountability)

**Columns (7 total):**

| Column | Field Name | Type | Description | Example |
|--------|-----------|------|-------------|---------|
| A | Timestamp | DateTime | When request was made | 1/15/2025 10:00:00 |
| B | Name | String | Requester's full name | Jane Smith |
| C | Email | Email | Requester's email | jane@warren.edu |
| D | Organization | String | Organization name | Warren County ESC |
| E | Role | String | Requester's job title | Director of Technology |
| F | Survey Link | URL | Generated survey link | https://learnrudi.com/survey.html?company=... |
| G | Created By | Email | Same as Email column | jane@warren.edu |

**Row 1:** Column headers (bold)
**Rows 2+:** Data entries

**Data submitted from:** `framework.html`

---

### Tab 3: "Pivot Table 1" (Optional Analysis)

**Purpose:** Summary analysis and visualizations (user-created, not managed by code)

---

## Apps Script Configuration

**Script ID:** `13nQKf61t4euKbUneH-wipwOixVoxNJMGWLP_4mQXQQON-MRyySZAJe8v`
**Deployment ID:** `AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ`
**Webhook URL:** `https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec`

**Access:** Extensions → Apps Script (from within the Google Sheet)

---

## Data Relationships

### Connecting Assessment Requests to Survey Responses

**Scenario:** Jane requests a survey for Warren County ESC

1. **Assessment Requests tab:**
   - Organization: Warren County ESC
   - Created By: jane@warren.edu
   - Survey Link: `https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu`

2. **Sheet1 (Survey Responses) tab:**
   - All responses with `Company = "Warren County ESC"` came from Jane's survey
   - Filter by `Created By = "jane@warren.edu"` to see all responses

### Example Query

**Find all responses for Jane's survey:**
```
Filter Sheet1:
- Company = "Warren County ESC"
- Created By = "jane@warren.edu"
```

**Result:** See all 47 responses from her organization

---

## Sample Data Formats

### Assessment Request (framework.html → Assessment Requests)

```json
{
  "type": "assessment_request",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "name": "Jane Smith",
  "email": "jane@warren.edu",
  "organization": "Warren County ESC",
  "role": "Director of Technology",
  "surveyLink": "https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu"
}
```

### Survey Response (survey.html → Sheet1)

```json
{
  "timestamp": "2025-01-15T10:30:45.000Z",
  "company": "Warren County ESC",
  "age_range": "35-44",
  "industry_sector": "Education (PreK-12)",
  "ai_tools_familiar": ["ChatGPT", "Claude (Anthropic)", "Copilot"],
  "ai_frequency": "Daily",
  "organizational_ai_usage": "Several pilots across units",
  "comfort_digital_tools": "8",
  "ai_concerns": ["Data privacy and security", "Job displacement concerns"],
  "sixty_day_priorities": "Save staff time on admin & compliance",
  "created_by": "jane@warren.edu"
}
```

---

## Permissions

**Owner:** hoff@learnrudi.com
**Apps Script:** Deployed as "Anyone" (public webhook)
**Sheet Access:** Private (only owner can view)

---

## Backup Strategy

**Recommended:**
1. File → Download → Microsoft Excel (.xlsx) - Weekly
2. File → Make a copy - Before major changes
3. Apps Script → Versions - Keep deployment history

---

## Sheet Formulas & Features

### Useful Formulas

**Count responses by organization:**
```
=COUNTIF(B:B, "Warren County ESC")
```

**Get unique organizations:**
```
=UNIQUE(B2:B)
```

**Filter by creator:**
```
=FILTER(A2:K, K2:K="jane@warren.edu")
```

### Conditional Formatting Ideas

- Highlight responses from last 7 days
- Color-code by comfort level (0-3 = red, 4-7 = yellow, 8-10 = green)
- Flag organizations with >10 responses

---

## Access the Sheet

**Direct Link:**
https://docs.google.com/spreadsheets/d/1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s/edit

**Via js/config.js:**
```javascript
const CONFIG = {
    SHEET_ID: '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s',
    SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec'
};
```
