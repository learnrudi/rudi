# Question Bank Analysis & Recommendations

## Current Status
**Total Questions: 11** (including baseline + follow-up)
- 1 Baseline question
- 3 Conceptual questions
- 3 Operational questions
- 3 Governance questions
- 1 Follow-up (meta) question

## The Duplicate Problem
You're seeing duplicates because with only 11 questions and needing 5-10 per user, some users MUST see the same questions multiple times.

### Example Path Analysis:
**Leader Path:**
1. Baseline (always asked)
2. governance_advanced (routed from baseline)
3. conceptual_advanced (only 1 available for leaders)
4. operational_advanced (only 1 available for leaders)
5. ??? (no more leader-level questions!)
6. Engine tries to find more → may re-ask or show lower-level questions

## Optimal Question Bank Size

### Minimum Needed (No Repeats):
```
Per user level: 10 questions × 5 levels = 50 questions
Per dimension: ~17 questions per dimension
Total minimum: 50-60 questions
```

### Realistic Recommendation:
```
Per dimension per level: 2-3 variations
Total: 3 dimensions × 5 levels × 2 variations = 30 questions
Plus baseline: 31 total questions
```

### Current vs Needed:
| Level | Current Questions Available | Minimum Needed |
|-------|----------------------------|----------------|
| Novice (0) | 4 questions | 10 questions |
| Explorer (1) | 4 questions | 10 questions |
| User (2) | 5 questions | 10 questions |
| Practitioner (3) | 3 questions | 10 questions |
| Leader (4) | 3 questions | 10 questions |

## Why You're Seeing Duplicates

The adaptive engine is trying to:
1. Ask minimum 5 questions
2. Cover all 3 dimensions
3. Stay within user's level

But with only 3-4 questions per level, it MUST either:
- Ask the same question twice (bug we need to prevent)
- Ask questions from different levels (breaks assessment validity)

## Solutions

### Option 1: Expand Question Bank (Recommended)
Add 2-3 variations per question level:

```javascript
// Instead of one "conceptual_basic"
conceptual_basic: [
  {
    id: "conceptual_basic_1",
    text: "What do you understand about how AI generates responses?"
  },
  {
    id: "conceptual_basic_2",
    text: "How would you explain AI to a colleague?"
  },
  {
    id: "conceptual_basic_3",
    text: "What do you think happens when you chat with AI?"
  }
]
```

### Option 2: Allow Cross-Level Questions
Let users see adjacent level questions:
- Novice can see: novice + explorer questions
- User can see: explorer + user + practitioner
- Leader can see: practitioner + leader questions

### Option 3: Reduce Minimum Questions
Change from 5 minimum to 3-4 minimum (not recommended for validity)

## Immediate Fix (Prevent Duplicates)

Update the adaptive engine to track asked questions properly:

```typescript
// In adaptive-engine.ts
private findSupplementalQuestion(): string | null {
  const availableQuestions = this.getAllQuestions().filter(q => {
    // CRITICAL: Never ask the same question twice
    if (this.state.questionsAsked.has(q.id)) return false

    // Rest of logic...
  })
}
```

## Recommended Implementation

### Phase 1: Quick Fix (Today)
- Add duplicate prevention (already partially done)
- Allow adjacent level questions for variety

### Phase 2: Expand Bank (This Week)
Add variations to reach ~30 total questions:
- 2 baseline variations
- 6 conceptual (2 per level for basic/intermediate/advanced)
- 6 operational (2 per level)
- 6 governance (2 per level)
- 2 follow-up variations

### Question Bank Size Guidelines:

| Assessment Length | Users | Questions Needed | Why |
|------------------|-------|------------------|-----|
| 5 questions | 100s | 15-20 questions | Some overlap OK |
| 5 questions | 1000s | 25-30 questions | Better variety |
| 10 questions | Any | 40-50 questions | No repeats possible |

## The Math:
- **Current**: 11 questions ÷ 5 user levels = ~2 questions per level ❌
- **Minimum**: 25 questions ÷ 5 user levels = 5 questions per level ✅
- **Ideal**: 40 questions ÷ 5 user levels = 8 questions per level ⭐

## Next Steps:
1. Add duplicate prevention check ✅ (done in engine)
2. Create question variations (need ~15-20 more questions)
3. Consider question pooling/randomization
4. Add cross-level flexibility for edge cases