# Assessment Questions for Google Sheets

## Sheet 1: Responses
Copy and paste this header row (already tab-separated):

```
Timestamp	Organization	Operational Score	Conceptual Score	Governance Score	Overall Score	Level	Q1: Current Usage	Q2: Tools Used	Q3: Learning Interest	Q4: Confidence	Q5: Understanding	Q6: Verification	Q7: Concerns	Q8: Priority	Q9: Role	Q10: Org AI Usage
```

## Sheet 2: Questions Reference
Create a second sheet called "Questions" with this information:

```
Question ID	Question Text	Type	Options
Q1	How often do you currently use AI tools?	Single	Never | Monthly | Weekly | Daily
Q2	Which AI tools have you used to complete actual work tasks?	Multiple	ChatGPT | Claude | Google Gemini | Microsoft Copilot | GitHub Copilot | Perplexity | Image Generation Tools | Other specialized AI | I have never used AI tools
Q3	How interested are you in learning more about AI?	Single	0-Not interested | 1-Slightly | 2-Moderately | 3-Very | 4-Extremely
Q4	How confident are you in your ability to use AI effectively?	Single	0-Not confident | 1-Slightly | 2-Moderately | 3-Very | 4-Extremely
Q5	How well do you understand AI capabilities and limitations?	Single	0-No understanding | 1-Basic | 2-Moderate | 3-Good | 4-Excellent
Q6	How do you verify AI-generated content?	Single	never_verify-Never verify | sometimes_check-Sometimes check | usually_verify-Usually verify | always_verify-Always verify | not_using-Not using AI content
Q7	What governance and ethical aspects of AI are you most aware of?	Multiple	understanding | privacy | accuracy | dependency | bias | job | cheating | guidelines | ethics | no_concerns
Q8	What's your most immediate AI need?	Single	0-Learning what AI is | 1-Starting to use AI | 2-Building skills | 3-Creating strategy
Q9	Which best describes your role?	Single	technical | non_technical | educator | student
Q10	How is your organization currently using AI?	Single	exploring | limited | expanding | integrated | unsure
```

## Column Descriptions for Sheet 1:

| Column | Description | Example Values |
|--------|-------------|----------------|
| Timestamp | ISO timestamp | 2024-01-20T15:30:45.123Z |
| Organization | Company name or "Individual" | Acme Corp, Individual |
| Operational Score | 0-100 | 65 |
| Conceptual Score | 0-100 | 72 |
| Governance Score | 0-100 | 58 |
| Overall Score | Weighted average | 65 |
| Level | Calculated level | beginner, intermediate, advanced |
| Q1: Current Usage | Frequency value | 0, 1, 2, 3 |
| Q2: Tools Used | Comma-separated list | "chatgpt, claude, copilot" |
| Q3: Learning Interest | 0-4 scale | 3 |
| Q4: Confidence | 0-4 scale | 2 |
| Q5: Understanding | 0-4 scale | 3 |
| Q6: Verification | Verification practice | usually_verify |
| Q7: Concerns | Comma-separated list | "privacy, bias, guidelines" |
| Q8: Priority | 0-3 scale | 2 |
| Q9: Role | Role type | technical |
| Q10: Org AI Usage | Usage level | expanding |

## To Set Up Your Google Sheet:

1. **Create new Google Sheet**
2. **First sheet (Responses):**
   - Select cell A1
   - Copy the header row from above
   - Paste (it will automatically separate into columns)
3. **Format the sheet:**
   - Select row 1
   - Format > Bold
   - Format > Freeze > 1 row
   - Format columns C-F as Number
4. **Set up conditional formatting (optional):**
   - Select columns C-F
   - Format > Conditional formatting
   - Color scale (red to green)

## Useful Google Sheets Formulas:

### Average scores by organization:
```
=AVERAGEIF(B:B,"Acme Corp",C:C)
```

### Count responses by organization:
```
=COUNTIF(B:B,"Acme Corp")
```

### Distribution of levels:
```
=COUNTIF(G:G,"intermediate")
```

### Most common tools used:
Create a pivot table on column I (Tools Used)

This format makes it easy to analyze the data using Google Sheets' built-in features!