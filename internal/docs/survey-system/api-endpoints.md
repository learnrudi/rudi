# RUDI Survey System - API Documentation

## Overview

The RUDI survey system uses a single Google Apps Script webhook endpoint that handles both assessment requests and survey responses.

---

## Base Endpoint

**URL:** `https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec`

**Script ID:** `13nQKf61t4euKbUneH-wipwOixVoxNJMGWLP_4mQXQQON-MRyySZAJe8v`
**Deployment ID:** `AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ`

**Methods:** GET (test), POST (submit data)
**Authentication:** None (public webhook)
**Rate Limit:** Google Apps Script default (no custom limits)

---

## Endpoints

### 1. Health Check (GET)

**Purpose:** Verify webhook is running

**Request:**
```bash
curl -X GET "https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec"
```

**Response:**
```json
{
  "status": "success",
  "message": "RUDI Survey API is running",
  "version": "2.0",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Webhook is running
- `5xx` - Google Apps Script error

---

### 2. Submit Assessment Request (POST)

**Purpose:** Log assessment request and track survey link creation

**Source:** `framework.html`
**Destination:** Google Sheets "Assessment Requests" tab

**Request:**
```bash
curl -X POST "https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "assessment_request",
    "timestamp": "2025-01-15T10:00:00.000Z",
    "name": "Jane Smith",
    "email": "jane@warren.edu",
    "organization": "Warren County ESC",
    "role": "Director of Technology",
    "surveyLink": "https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu"
  }'
```

**Request Body Schema:**
```typescript
{
  type: "assessment_request",      // Required: Identifies submission type
  timestamp: string,               // Required: ISO 8601 datetime
  name: string,                    // Required: Requester's full name
  email: string,                   // Required: Requester's email
  organization: string,            // Required: Organization name
  role: string,                    // Required: Job title
  surveyLink: string              // Required: Generated survey URL
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Assessment request saved"
}
```

**Google Sheets Output:**
| Column | Value |
|--------|-------|
| A (Timestamp) | 2025-01-15 10:00:00 |
| B (Name) | Jane Smith |
| C (Email) | jane@warren.edu |
| D (Organization) | Warren County ESC |
| E (Role) | Director of Technology |
| F (Survey Link) | https://learnrudi.com/survey... |
| G (Created By) | jane@warren.edu |

**Errors:**
- `400` - Invalid JSON
- `404` - "Assessment Requests" sheet not found
- `500` - Google Sheets write error

---

### 3. Submit Survey Response (POST)

**Purpose:** Save individual survey responses

**Source:** `survey.html`
**Destination:** Google Sheets "Sheet1" tab

**Request:**
```bash
curl -X POST "https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-01-15T14:23:17.000Z",
    "company": "Warren County ESC",
    "age_range": "35-44",
    "industry_sector": "Education (PreK-12)",
    "ai_tools_familiar": ["ChatGPT", "Claude (Anthropic)"],
    "ai_frequency": "Weekly",
    "organizational_ai_usage": "Individual staff experimenting informally",
    "comfort_digital_tools": "7",
    "ai_concerns": ["Data privacy and security", "Time required to learn"],
    "sixty_day_priorities": "Staff PD/coaching: create training materials",
    "created_by": "jane@warren.edu"
  }'
```

**Request Body Schema:**
```typescript
{
  timestamp: string,                    // Required: ISO 8601 datetime
  company: string,                      // Required: Organization name
  age_range: string,                    // Required: Age bracket
  industry_sector: string,              // Required: Industry
  ai_tools_familiar: string[],          // Optional: Array of tool names
  ai_frequency: string,                 // Required: Usage frequency
  organizational_ai_usage: string,      // Required: Org adoption level
  comfort_digital_tools: string,        // Required: 0-10 scale
  ai_concerns: string[],                // Optional: Array of concerns
  sixty_day_priorities: string,         // Required: Top priority
  created_by: string                    // Required: Survey creator email
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Survey response saved"
}
```

**Google Sheets Output:**
| Column | Value |
|--------|-------|
| A (Timestamp) | 2025-01-15 14:23:17 |
| B (Company) | Warren County ESC |
| C (Age Range) | 35-44 |
| D (Industry) | Education (PreK-12) |
| E (AI Tools) | ChatGPT, Claude (Anthropic) |
| F (AI Frequency) | Weekly |
| G (Org AI Usage) | Individual staff experimenting |
| H (Comfort Level) | 7 |
| I (AI Concerns) | Data privacy, Time to learn |
| J (60-Day Priority) | Staff training |
| K (Created By) | jane@warren.edu |

**Errors:**
- `400` - Invalid JSON or missing required fields
- `404` - "Sheet1" not found
- `500` - Google Sheets write error

---

## Configuration

**Stored in:** `js/config.js`

```javascript
const CONFIG = {
    SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec',
    SHEET_ID: '1LC-kPwyQZG3w8TnA46wE6bXiajC9A0M3eb6dXZrhG-s',
    DEPLOYMENT_ID: 'AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ',
    SCRIPT_ID: '13nQKf61t4euKbUneH-wipwOixVoxNJMGWLP_4mQXQQON-MRyySZAJe8v'
};
```

---

## Usage Examples

### JavaScript (Browser)

```javascript
// Assessment Request
const requestData = {
    type: 'assessment_request',
    timestamp: new Date().toISOString(),
    name: 'Jane Smith',
    email: 'jane@warren.edu',
    organization: 'Warren County ESC',
    role: 'Director',
    surveyLink: 'https://...'
};

fetch(CONFIG.SHEETS_WEBHOOK_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(requestData),
    mode: 'no-cors' // Required for Apps Script
});

// Survey Response
const surveyData = {
    timestamp: new Date().toISOString(),
    company: 'Warren County ESC',
    age_range: '35-44',
    // ... other fields
    created_by: 'jane@warren.edu'
};

fetch(CONFIG.SHEETS_WEBHOOK_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(surveyData),
    mode: 'no-cors'
});
```

**Note:** `mode: 'no-cors'` is required for Google Apps Script webhooks. This means you won't get response data, but the request will succeed.

---

## Request Routing Logic

**Apps Script determines routing based on `type` field:**

```javascript
if (data.type === 'assessment_request') {
    // Save to "Assessment Requests" tab
    handleAssessmentRequest(spreadsheet, data);
} else {
    // Save to "Sheet1" tab
    handleSurveyResponse(spreadsheet, data);
}
```

**Key Distinction:**
- Has `type: 'assessment_request'` → Assessment Requests tab
- No `type` field → Survey Responses (Sheet1)

---

## Error Handling

### Client-Side (JavaScript)

```javascript
try {
    await fetch(CONFIG.SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        mode: 'no-cors'
    });

    // Show success message
    console.log('Data saved successfully');

} catch (error) {
    console.error('Submission error:', error);
    // Still show success (no-cors mode doesn't return response)
}
```

### Server-Side (Apps Script)

```javascript
try {
    // Process data
    sheet.appendRow(row);
    return successResponse();

} catch (error) {
    Logger.log('Error: ' + error.toString());
    return errorResponse(error.message);
}
```

**View Errors:**
1. Open Apps Script editor
2. Click "Executions" in left sidebar
3. See error logs with timestamps

---

## Security

**Public Endpoint:**
- No authentication required
- Anyone with URL can submit
- Spam protection: None (consider adding Turnstile/reCAPTCHA)

**Data Privacy:**
- No PII in survey responses (anonymous)
- Email addresses only in assessment requests
- Google Sheets access restricted to owner

**Recommendations:**
- Add rate limiting if spam occurs
- Monitor Apps Script execution logs
- Keep webhook URL in config file (not hardcoded)
- Consider adding HMAC signature verification for production

---

## Performance

**Typical Response Times:**
- Health check (GET): 100-300ms
- Assessment request (POST): 300-800ms
- Survey response (POST): 300-800ms

**Limits:**
- Apps Script: 6 min max execution time
- Apps Script: 20,000 calls/day (free tier)
- Google Sheets: 10 million cells max
- Concurrent requests: ~30 simultaneous

**Monitoring:**
- Apps Script Dashboard: https://script.google.com/home
- Execution logs: Within Apps Script editor
- Google Sheets: Manual review

---

## Testing

### Health Check
```bash
curl -X GET "https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec"
```
**Expected:** `{"status":"success",...}`

### Assessment Request
```bash
curl -X POST "https://script.google.com/macros/s/AKfycbwFVo3asRxZSRTa8iJkGMc4TYiv68sM0bcxaxePvh-pDREK5bYrCzeMW3WF2x1e5ljFuQ/exec" \
  -H "Content-Type: application/json" \
  -d '{"type":"assessment_request","name":"Test","email":"test@example.com","organization":"Test Org","role":"Tester","surveyLink":"http://test.com","timestamp":"2025-01-15T10:00:00Z"}'
```
**Expected:** New row in "Assessment Requests" tab

### Survey Response
Visit: https://learnrudi.com/survey.html?company=Test%20Org&creator=test@example.com
Complete survey and submit
**Expected:** New row in "Sheet1" tab

---

## Changelog

### v2.0 (January 2025)
- Added assessment request handling
- Split data into two sheets
- Added `created_by` tracking
- Improved error handling
- Added health check endpoint

### v1.0 (December 2024)
- Initial release
- Single sheet for survey responses
- Basic POST endpoint

---

## Support

**Apps Script Issues:**
- Check execution logs in Apps Script editor
- Verify sheet names match code ("Assessment Requests", "Sheet1")
- Check Google Cloud Console for quota limits

**Integration Issues:**
- Verify CONFIG.SHEETS_WEBHOOK_URL is correct
- Check browser console (F12) for JavaScript errors
- Test with curl to isolate client vs server issues

**Contact:**
- Email: hoff@learnrudi.com
- Docs: /docs/survey-system/
