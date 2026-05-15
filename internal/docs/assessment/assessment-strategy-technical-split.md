# RUDI Assessment Strategy: Technical vs Non-Technical

## The Full Matrix Complexity
The RUDI Framework has **30 unique competency points**:
- 3 Dimensions × 5 Levels × 2 Tracks = 30 cells

### Current State
- **41 questions** covering general AI literacy
- No technical/non-technical differentiation
- Single adaptive path

## Option 1: Single Unified Assessment (Recommended) ✅

### How it Works
```
1. Start with role identification question
2. Baseline question (adapted to role)
3. Adaptive routing based on role + responses
4. 5-10 questions total
```

### Implementation
```typescript
// Add to baseline question
{
  id: "role_identification",
  text: "Which best describes your primary work?",
  options: [
    { value: "non_technical", text: "Teacher, Manager, Writer, Admin" },
    { value: "technical", text: "Developer, Data Scientist, Engineer" },
    { value: "hybrid", text: "Both technical and non-technical" }
  ]
}

// Then route questions accordingly
if (role === "technical") {
  // Show "Can you call an API?" type questions
} else {
  // Show "Can you write a prompt?" type questions
}
```

### Pros
- **Single entry point** - Less confusing for users
- **Adaptive** - Automatically adjusts to user's role
- **Efficient** - Share common questions where overlap exists
- **Better data** - Can compare technical vs non-technical populations

### Cons
- More complex routing logic
- Need more questions (60-80 total)

## Option 2: Two Separate Assessments

### Structure
```
/assessments/
  /non-technical/
    - For teachers, managers, writers
    - Focus on prompt engineering, AI literacy
    - ~30-40 questions

  /technical/
    - For developers, data scientists
    - Focus on APIs, models, architectures
    - ~30-40 questions
```

### Pros
- **Clearer focus** - Each assessment is targeted
- **Simpler logic** - No complex branching
- **Specialized language** - Can use technical jargon where appropriate

### Cons
- **User confusion** - "Which one do I take?"
- **Duplicate effort** - Many questions overlap
- **Maintenance** - Two codebases to maintain
- **Hybrid roles** - What about technical managers?

## Option 3: Progressive Disclosure (Hybrid Approach) 🌟

### How it Works
```
1. Start with general questions (both tracks)
2. Detect technical aptitude from responses
3. Progressively add technical depth if appropriate
4. Final score shows both general + technical competency
```

### Example Flow
```
Q1: "How do you use AI?" (General)
  → "I write prompts" → Non-technical path
  → "I integrate APIs" → Technical path
  → "Both" → Mixed questions

Q2: Based on Q1, ask appropriate follow-up
  Non-tech: "How do you refine prompts?"
  Tech: "How do you handle rate limits?"
  Both: "How do you validate AI outputs?"
```

### Benefits
- **Natural progression** - Feels intuitive
- **No wrong door** - Users don't pre-select
- **Comprehensive** - Captures full capability
- **Single codebase** - Easier to maintain

## 📊 Recommendation: Progressive Disclosure

### Why?
1. **Users don't always know their level** - Many think they're "non-technical" but use APIs
2. **Roles are blending** - Modern work requires both skills
3. **Better assessment** - Captures actual capability, not self-perception
4. **Future-proof** - As AI democratizes, technical/non-technical line blurs

### Implementation Plan

#### Phase 1: Enhance Current Assessment (Quick Win)
- Add 5-10 technical screening questions
- Add role context to existing questions
- Test with both user types

#### Phase 2: Full Matrix Coverage (Next Sprint)
- Expand to 60-80 questions total
- Cover all 30 matrix cells
- Implement progressive disclosure logic

#### Phase 3: Specialized Paths (Future)
- Industry-specific modules (education, healthcare, finance)
- Tool-specific assessments (ChatGPT, Claude, Copilot)
- Certification paths

## Question Distribution Needed

### Current Coverage (41 questions)
```
General coverage, no role differentiation
```

### Target Coverage (80 questions)
```
                Non-Technical  Technical  Shared
Conceptual:          10           10        5
Operational:         15           15        5
Governance:          10           10        5
Total:               35           35       15
```

### Question Examples

#### Shared Questions (work for both)
- "What are AI hallucinations?"
- "How do you handle sensitive data?"
- "What's your experience with AI tools?"

#### Non-Technical Specific
- "How do you write effective prompts?"
- "How do you fact-check AI content?"
- "How do you explain AI to students/clients?"

#### Technical Specific
- "How do you handle API rate limits?"
- "What's your approach to fine-tuning?"
- "How do you implement RAG systems?"

## Next Steps

1. **Immediate**: Add role identification to current assessment
2. **Week 1**: Create 20 technical-specific questions
3. **Week 2**: Create progressive routing logic
4. **Week 3**: Test with both user groups
5. **Week 4**: Refine and deploy

## Decision Matrix

| Criteria | Single Unified | Two Separate | Progressive |
|----------|---------------|--------------|-------------|
| User Experience | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Development Effort | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Maintenance | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Accuracy | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Flexibility | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

**Winner: Progressive Disclosure** ✨