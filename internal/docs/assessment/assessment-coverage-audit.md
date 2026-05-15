# RUDI Assessment Coverage Audit

## Current File Structure (Needs Cleanup)

### 🔴 Confusing Names:
- `questions-non-technical-examples.json` → Should be integrated or renamed
- `questions-technical-examples.json` → Should be integrated or renamed
- `question-inventory.ts` → Documentation file, should move to docs

### ✅ Good Names:
- `assessment-metadata.json` - Clear purpose
- `questions-conceptual.json` - Clear dimension
- `questions-operational.json` - Clear dimension
- `questions-governance.json` - Clear dimension

## Question Coverage Matrix

### Current Coverage (41 questions total)

| Dimension | Track | No Exposure | Pre-Beginner | Beginner | Intermediate | Advanced | Total |
|-----------|-------|-------------|--------------|----------|--------------|----------|-------|
| **Conceptual** | | | | | | | **13** |
| | Shared | ✓(2) | ✓(2) | ✓(2) | ✓(2) | ✓(2) | 10 |
| | Technical | ❌ | ❌ | ❌ | ✓(1) | ✓(2) | 3 |
| | Non-Tech | ❌ | ❌ | ❌ | ❌ | ❌ | 0 |
| **Operational** | | | | | | | **14** |
| | Shared | ✓(2) | ✓(2) | ✓(3) | ✓(2) | ✓(2) | 11 |
| | Technical | ❌ | ❌ | ✓(1) | ✓(1) | ✓(1) | 3 |
| | Non-Tech | ❌ | ❌ | ❌ | ❌ | ❌ | 0 |
| **Governance** | | | | | | | **13** |
| | Shared | ✓(2) | ✓(2) | ✓(2) | ✓(2) | ✓(2) | 10 |
| | Technical | ❌ | ❌ | ❌ | ✓(1) | ✓(1) | 2 |
| | Non-Tech | ❌ | ❌ | ✓(1) | ❌ | ❌ | 1 |

## 🔴 **MISSING COVERAGE:**

### Technical Track Gaps (Need 15-20 more):
- **Conceptual**: Missing No Exposure, Pre-Beginner, Beginner questions
- **Operational**: Missing No Exposure, Pre-Beginner questions
- **Governance**: Missing No Exposure, Pre-Beginner, Beginner questions

### Non-Technical Track Gaps (Need 20-25 more):
- **Conceptual**: Missing ALL levels
- **Operational**: Missing ALL levels
- **Governance**: Missing most levels (only 1 beginner question)

## Required Questions for Full Matrix

### Full RUDI Matrix = 90 questions (3 dimensions × 5 levels × 2 tracks × 3 questions each)

| What We Have | What We Need | Gap |
|--------------|--------------|-----|
| 41 shared/generic | 30 shared | ✅ Good |
| 8 technical | 30 technical | ❌ Need 22 more |
| 1 non-technical | 30 non-technical | ❌ Need 29 more |

## Recommended File Restructure

```
/src/frontend/data/rudi-assessment/
  ├── config/
  │   ├── metadata.json           # Assessment configuration
  │   └── scoring.json            # Scoring rules
  │
  ├── questions/
  │   ├── shared/                 # Questions for both tracks
  │   │   ├── conceptual.json
  │   │   ├── operational.json
  │   │   └── governance.json
  │   │
  │   ├── technical/              # Technical-only questions
  │   │   ├── conceptual.json
  │   │   ├── operational.json
  │   │   └── governance.json
  │   │
  │   └── non-technical/          # Non-technical-only questions
  │       ├── conceptual.json
  │       ├── operational.json
  │       └── governance.json
  │
  ├── index.ts                    # Main export
  └── types.ts                    # TypeScript definitions

/src/lib/assessment/
  ├── engines/
  │   ├── adaptive-engine.ts      # Current V1 engine
  │   └── adaptive-engine-v2.ts   # Tech/Non-tech engine
  │
  ├── scoring/
  │   └── calculator.ts           # Scoring logic
  │
  └── __tests__/
      ├── engine.test.ts
      └── integration.test.ts
```

## Next Steps

1. **Immediate**: Generate missing technical questions (22 needed)
2. **Immediate**: Generate missing non-technical questions (29 needed)
3. **Clean**: Reorganize files into clearer structure
4. **Test**: Ensure all paths have 5-10 viable questions