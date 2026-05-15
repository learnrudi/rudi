# RUDI Survey System - User Flow

## Overview

This document describes the complete user journey through the RUDI survey system, from initial interest to receiving results.

---

## Persona: Jane Smith

**Role:** Director of Technology
**Organization:** Warren County ESC
**Goal:** Understand her organization's AI readiness
**Team Size:** 47 staff members

---

## Flow Diagram

```
┌─────────────────────────┐
│  Discovery              │
│  Jane finds RUDI site   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Interest               │
│  Reads about framework  │
│  framework.html         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Request Assessment     │
│  Fills form:            │
│  - Name                 │
│  - Email                │
│  - Organization         │
│  - Role                 │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Instant Link           │
│  Receives survey link   │
│  + Copy button          │
│  + Instructions         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Distribution           │
│  Shares link via:       │
│  - Email                │
│  - Slack                │
│  - Teams meeting        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Team Takes Survey      │
│  47 people complete     │
│  9-question survey      │
│  (5-7 minutes each)     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Results Collection     │
│  Responses saved to     │
│  Google Sheets          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Analysis & Follow-up   │
│  RUDI team contacts     │
│  Jane with insights     │
└─────────────────────────┘
```

---

## Detailed Steps

### Step 1: Discovery

**Where:** Google Search, LinkedIn, Email, Conference

**What Jane Sees:**
- RUDI website: https://learnrudi.com
- "AI Readiness Framework & Assessment"
- Promise: "Free 9-question survey to understand your team's AI familiarity"

**Jane's Actions:**
- Clicks link
- Lands on homepage or framework.html

---

### Step 2: Interest (framework.html)

**URL:** https://learnrudi.com/framework.html

**What Jane Reads:**
- The RUDI AI Readiness Framework
- 3 dimensions: Conceptual, Operational, Governance
- 5 proficiency levels: Pre-Beginner to Advanced
- Responsible Use Model
- Visual competency reports

**Key Sections:**
1. "The Real Barrier to Strategic Adoption"
2. "The AI Readiness Pyramid"
3. "Visual Competency Reports"
4. **"Request Your Custom Assessment"** ← Main CTA

**Jane's Reaction:**
- "This looks useful for my team"
- "9 questions, 5-7 minutes - that's reasonable"
- "Completely anonymous - good for honest responses"
- Scrolls to request form

---

### Step 3: Request Assessment

**Form Location:** Top of framework.html page

**Form Fields:**
```
┌────────────────────────────────┐
│ REQUEST YOUR CUSTOM ASSESSMENT │
├────────────────────────────────┤
│ Name: [Jane Smith          ]   │
│ Email: [jane@warren.edu    ]   │
│ Organization: [Warren County ESC] │
│ Role: [Director of Technology] │
│                                │
│ [📧 Request My Assessment]     │
└────────────────────────────────┘
```

**Jane's Actions:**
1. Fills out all 4 fields
2. Clicks "Request My Assessment"
3. Button shows: "🔄 Creating your survey link..."

**What Happens (Backend):**
```javascript
// 1. Generate survey link
surveyLink = "https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu"

// 2. Send to Google Sheets
POST to Apps Script webhook
{
  type: 'assessment_request',
  name: 'Jane Smith',
  email: 'jane@warren.edu',
  organization: 'Warren County ESC',
  role: 'Director of Technology',
  surveyLink: '[generated URL]',
  timestamp: '2025-01-15T10:00:00Z'
}

// 3. Show success message with link
```

**Time:** 1-2 seconds

---

### Step 4: Instant Link (Success Screen)

**What Jane Sees:**

```
┌─────────────────────────────────────┐
│        ✅ Your Survey Link is Ready!    │
├─────────────────────────────────────┤
│                                     │
│ Share this link with your team:     │
│ ┌─────────────────────────────────┐ │
│ │ https://learnrudi.com/survey... │ │
│ └─────────────────────────────────┘ │
│                                     │
│        [📋 Copy Link]               │
│                                     │
│ Next Steps:                         │
│ 1. Copy the link above              │
│ 2. Share via email/Slack/Teams      │
│ 3. Responses collected anonymously  │
│ 4. Report in 48 hours               │
│                                     │
│ Confirmation sent to:               │
│ jane@warren.edu                     │
└─────────────────────────────────────┘
```

**Jane's Actions:**
1. Clicks "Copy Link" button
2. Button shows: "✅ Copied!"
3. Link is now in her clipboard

**Jane's Feeling:**
- Excited - got what she came for
- Impressed - instant, no waiting
- Confident - clear next steps

---

### Step 5: Distribution

**Where Jane Shares:**

#### Option 1: Email
```
To: All Staff <staff@warren.edu>
Subject: Quick AI Familiarity Survey (5 min)

Hi team,

We're partnering with RUDI to understand our current comfort level with AI tools. Please take this quick, anonymous survey:

https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu

It's only 9 questions and takes 5-7 minutes. Your honest feedback will help us plan better training!

Thanks,
Jane
```

#### Option 2: Slack
```
📊 Quick Survey: AI Familiarity

Hey @channel - please take 5 min to complete this anonymous survey about AI tools. It'll help us plan training:

https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu

Thanks! 🙏
```

#### Option 3: Teams Meeting
- Jane shares link in chat during all-staff meeting
- Asks people to complete by end of week
- Mentions it's anonymous

**Distribution Timeline:**
- Monday 10:00 AM: Jane sends email
- Monday 10:30 AM: Posts in Slack
- Tuesday 2:00 PM: Mentions in staff meeting
- Friday 5:00 PM: Deadline

---

### Step 6: Team Takes Survey

**Team Member: John (one of 47)**

**Experience:**
1. Clicks Jane's link
2. Survey opens: https://learnrudi.com/survey.html?company=Warren%20County%20ESC&creator=jane@warren.edu
3. Sees header: "RUDI AI Familiarity & Adoption Survey - **Warren County ESC**"
4. Progress bar at top (0% → 100%)
5. Answers 9 questions:
   - Age range
   - Industry (pre-filled)
   - AI tools familiar with (checkboxes)
   - Frequency of use
   - Org adoption status
   - Comfort level (0-10 slider)
   - Concerns (pick 3)
   - 60-day priorities

**Time:** 5-7 minutes per person

**What John Notices:**
- ✅ Company name already filled in
- ✅ Progress bar shows how much is left
- ✅ Questions are clear and relevant
- ✅ No personal info required
- ✅ Can't accidentally go back and lose answers

**Submit:**
- Clicks "Submit Survey"
- Button shows: "🔄 Submitting..."
- Success message: "✅ Thank you! Your responses have been submitted."

**What Happens (Backend):**
```javascript
POST to Apps Script webhook
{
  timestamp: '2025-01-15T14:23:17Z',
  company: 'Warren County ESC',
  age_range: '35-44',
  industry_sector: 'Education (PreK-12)',
  ai_tools_familiar: ['ChatGPT', 'Claude'],
  ai_frequency: 'Weekly',
  organizational_ai_usage: 'Individual staff experimenting',
  comfort_digital_tools: '7',
  ai_concerns: ['Data privacy', 'Time to learn'],
  sixty_day_priorities: 'Staff training',
  created_by: 'jane@warren.edu'
}
```

**Saved to Google Sheets "Sheet1" tab**

---

### Step 7: Results Collection

**Google Sheets After 1 Week:**

**Tab: "Assessment Requests"**
```
Timestamp          | Name       | Email            | Organization      | Role               | Survey Link
-------------------+------------+------------------+-------------------+--------------------+------------------
1/15/25 10:00 AM  | Jane Smith | jane@warren.edu  | Warren County ESC | Dir of Technology  | https://...
```

**Tab: "Sheet1" (Survey Responses)**
```
Timestamp          | Company           | Age  | Industry | ... | Created By
-------------------+-------------------+------+----------+-----+-----------------
1/15/25 2:23 PM   | Warren County ESC | 35-44| Education| ... | jane@warren.edu
1/15/25 3:45 PM   | Warren County ESC | 25-34| Education| ... | jane@warren.edu
1/15/25 4:12 PM   | Warren County ESC | 45-54| Education| ... | jane@warren.edu
... (44 more rows)
```

**RUDI Team View:**
- 47 total responses for Warren County ESC
- Can filter by `created_by=jane@warren.edu`
- Can see:
  - Age distribution
  - Current AI tool usage
  - Comfort levels
  - Top concerns
  - Priority needs

---

### Step 8: Analysis & Follow-up

**RUDI Team Actions:**
1. Reviews aggregate data for Warren County ESC
2. Generates insights:
   - 60% never used AI tools
   - Average comfort level: 4/10
   - Top concern: "Don't know where to start"
   - Top priority: "Staff training"

**Email to Jane (48 hours later):**
```
Subject: Your Warren County ESC AI Readiness Results

Hi Jane,

Great news! 47 people completed your survey. Here's what we found:

📊 Key Insights:
• 60% have never used AI tools professionally
• Average comfort level: 4/10 (beginner)
• #1 concern: "I don't know where to start"
• #1 priority: Staff training on AI basics

🎯 Recommendations:
1. Start with a "What is AI?" intro session
2. Focus on practical use cases for education
3. Address data privacy concerns upfront
4. Begin with ChatGPT/Claude basics

📅 Next Steps:
Let's schedule a call to discuss custom training for your team.

[Book a Call]

Best,
RUDI Team
```

**Jane's Reaction:**
- "This is exactly what I needed"
- "Data confirms my suspicions"
- "Clear next steps"
- Books a training session

---

## Key User Experience Principles

### 1. **Instant Gratification**
- No waiting 24 hours
- Link generated immediately
- Can share right away

### 2. **Simplicity**
- 4 fields to request
- 9 questions to answer
- 5-7 minutes total

### 3. **Anonymity**
- No names in survey
- Honest responses
- Team-level insights only

### 4. **Clear Value**
- Understand AI readiness
- Get actionable recommendations
- Free assessment

### 5. **Professionalism**
- Clean design
- Progress indicators
- Confirmation messages

---

## Success Metrics

**For Jane:**
- ✅ Got survey link in <5 seconds
- ✅ 47/50 team members completed (94% response rate)
- ✅ Received insights in 48 hours
- ✅ Booked training session

**For RUDI:**
- ✅ 1 assessment request
- ✅ 47 survey responses
- ✅ 1 new client lead
- ✅ Data for product improvement

---

## Alternative Flows

### Flow 2: Direct Link Share
- Someone shares survey link directly (not from framework.html)
- Still works! Company name pre-filled from URL
- Response still tracked with creator info

### Flow 3: Admin-Created Link
- RUDI staff creates custom link via survey-admin.html
- For special cases or white-glove service
- Same data flow, just different creation method

---

## Mobile Experience

**All screens fully responsive:**
- Framework form: Single column layout
- Survey: Touch-friendly controls
- Success: Easy to copy/share link
- Works on iOS, Android, tablets

---

## Accessibility

**WCAG 2.1 AA compliant:**
- Keyboard navigation
- Screen reader compatible
- High contrast colors
- Clear focus indicators
- Readable font sizes (16px+)

---

## Summary

The user flow is designed to be:
1. **Fast** - Instant link generation
2. **Easy** - Minimal form fields
3. **Anonymous** - No personal data
4. **Valuable** - Actionable insights
5. **Professional** - Clean, modern design

Total time from discovery to survey completion: **<10 minutes per person**
