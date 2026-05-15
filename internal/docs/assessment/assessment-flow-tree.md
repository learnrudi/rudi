# Assessment Question Flow Tree Diagrams

## 🎯 Persona 1: Sarah - High School Teacher (Never Used AI)

```
START
│
├─Q1: "How would you describe your current experience with AI tools?"
│     └─→ Selected: "I've never used AI tools" (novice)
│
├─Q2: "Which best describes your primary work or interests?"
│     └─→ Selected: "Education, writing, management, administration" (non_technical)
│
└─ADAPTIVE QUESTIONS (Non-Technical / No Exposure Level)
  │
  ├─Q3: "What is artificial intelligence to you?" [nontech_concept_no_exposure_1]
  │     ├─ "Robots and science fiction" ✓
  │     ├─ "Computer programs that think"
  │     └─ "Tools that help with tasks"
  │
  ├─Q4: "Have you ever used an AI tool like ChatGPT?" [nontech_operational_no_exposure_1]
  │     ├─ "Never heard of it"
  │     ├─ "Heard of it but never tried" ✓
  │     └─ "Tried it once or twice"
  │
  ├─Q5: "Are there risks with using AI?" [nontech_governance_no_exposure_1]
  │     ├─ "I don't know"
  │     ├─ "Maybe, but I'm not sure what" ✓
  │     └─ "Yes, like privacy and misinformation"
  │
  ├─Q6: "Have you heard about ChatGPT or similar tools?" [nontech_concept_no_exposure_2]
  │     ├─ "No, what are those?" ✓
  │     ├─ "Heard of them in the news"
  │     └─ "Know they're AI assistants"
  │
  ├─Q7: "What is a prompt in AI context?" [nontech_operational_no_exposure_2]
  │     ├─ "No idea"
  │     ├─ "Something you type"
  │     └─ "Instructions you give to AI" ✓
  │
  ├─Q8: "What is AI bias?" [nontech_governance_no_exposure_2]
  │     ├─ "Never heard of it"
  │     ├─ "When AI prefers certain things" ✓
  │     └─ "When AI treats groups unfairly"
  │
  ├─Q9: "What do you think AI can help with?" [nontech_concept_no_exposure_3]
  │     ├─ "No idea" ✓
  │     ├─ "Maybe writing or answering questions"
  │     └─ "Many tasks like writing, planning, creating"
  │
  ├─Q10: "Have you used AI for any work task?" [nontech_operational_no_exposure_3]
  │     ├─ "Never"
  │     ├─ "Thought about it but haven't tried" ✓
  │     └─ "Used it for simple tasks"
  │
  ├─Q11: "Should student data be used with AI?" [nontech_governance_no_exposure_3]
  │     ├─ "I don't know"
  │     ├─ "Probably not"
  │     └─ "No, it violates privacy policies" ✓
  │
  └─Q12: "How does AI 'know' things?" [nontech_concept_pre_beginner_1]
        ├─ "It searches the internet"
        ├─ "It learned from lots of examples" ✓
        └─ "Trained on data to recognize patterns"
```

---

## 💻 Persona 2: Marcus - Senior Software Engineer (Regular AI User)

```
START
│
├─Q1: "How would you describe your current experience with AI tools?"
│     └─→ Selected: "I use AI tools regularly in my work" (practitioner)
│
├─Q2: "Which best describes your primary work or interests?"
│     └─→ Selected: "Software development, data science, engineering" (technical)
│
└─ADAPTIVE QUESTIONS (Technical / Intermediate Level)
  │
  ├─Q3: "How do transformer architectures handle sequence data?" [tech_concept_intermediate_1]
  │     ├─ "Process sequences in order"
  │     ├─ "Use attention mechanisms for context" ✓
  │     └─ "Self-attention with positional encoding in parallel"
  │
  ├─Q4: "How do you optimize model inference speed?" [tech_ops_intermediate_1]
  │     ├─ "Use faster hardware"
  │     ├─ "Batch processing and caching" ✓
  │     └─ "Quantization, pruning, knowledge distillation"
  │
  ├─Q5: "How do you implement bias testing?" [tech_governance_intermediate_1]
  │     ├─ "Check outputs for obvious bias" ✓
  │     ├─ "Use fairness metrics and demographic parity tests"
  │     └─ "Implement continuous monitoring with adversarial debiasing"
  │
  ├─Q6: "What's the difference between supervised and unsupervised learning?" [tech_concept_intermediate_2]
  │     ├─ "Supervised uses labels"
  │     ├─ "Supervised has targets, unsupervised finds patterns"
  │     └─ "Different loss functions and optimization objectives" ✓
  │
  ├─Q7: "How do you implement vector search?" [tech_ops_intermediate_2]
  │     ├─ "Loop through and compare"
  │     ├─ "Use vector database like Pinecone" ✓
  │     └─ "HNSW indexes with custom similarity metrics"
  │
  ├─Q8: "What is model governance?" [tech_governance_intermediate_2]
  │     ├─ "Rules for using models" ✓
  │     ├─ "Lifecycle management including versioning and approval workflows"
  │     └─ "End-to-end MLOps with risk assessment, monitoring, and retirement policies"
  │
  ├─Q9: "What is gradient descent?" [tech_concept_intermediate_3]
  │     ├─ "A way to train models"
  │     ├─ "Optimization algorithm to minimize loss" ✓
  │     └─ "Iterative parameter updates via partial derivatives"
  │
  ├─Q10: "How do you deploy ML models to production?" [tech_ops_intermediate_3]
  │      ├─ "Copy files to server"
  │      ├─ "Containerize and use CI/CD"
  │      └─ "MLOps pipeline with A/B testing and monitoring" ✓
  │
  ├─Q11: "How do you ensure AI system compliance?" [tech_governance_intermediate_3]
  │      ├─ "Follow company guidelines"
  │      ├─ "Implement technical controls and documentation" ✓
  │      └─ "Automated compliance checks with policy-as-code frameworks"
  │
  └─Q12: "What's the purpose of tokenization in LLMs?" [tech_concept_beginner_1]
         ├─ "Breaking text into smaller pieces"
         ├─ "Converting text to numerical representations" ✓
         └─ "Subword segmentation for vocabulary efficiency"
```

---

## 📊 Persona 3: Jennifer - Marketing Manager (Occasional AI User)

```
START
│
├─Q1: "How would you describe your current experience with AI tools?"
│     └─→ Selected: "I use AI tools occasionally" (user)
│
├─Q2: "Which best describes your primary work or interests?"
│     └─→ Selected: "Creative fields, marketing, design" (non_technical)
│
└─ADAPTIVE QUESTIONS (Non-Technical / Beginner Level)
  │
  ├─Q3: "What are 'prompts' in AI?" [nontech_concept_beginner_1]
  │     ├─ "Instructions you give to AI" ✓
  │     ├─ "Detailed requests with context and goals"
  │     └─ "Structured inputs optimized for best output"
  │
  ├─Q4: "What tasks do you use AI for?" [nontech_operational_beginner_1]
  │     ├─ "Haven't used it yet"
  │     ├─ "Writing emails or simple content" ✓
  │     └─ "Complex projects with multiple iterations"
  │
  ├─Q5: "What information should you NOT share with AI?" [nontech_governance_beginner_1]
  │     ├─ "Anything personal"
  │     ├─ "Passwords and private company data" ✓
  │     └─ "Confidential data, PII, and proprietary information"
  │
  ├─Q6: "What does it mean when AI 'hallucinates'?" [nontech_concept_beginner_2]
  │     ├─ "Makes up false information" ✓
  │     ├─ "Generates plausible but incorrect content"
  │     └─ "Conflates patterns inappropriately"
  │
  ├─Q7: "How do you verify AI-generated content?" [nontech_operational_beginner_2]
  │     ├─ "Trust it's accurate"
  │     ├─ "Quick review for obvious errors" ✓
  │     └─ "Systematic fact-checking and source verification"
  │
  └─... (continues with similar beginner-level questions)
```

---

## 🎓 Persona 4: Alex - Computer Science Student (Exploring AI)

```
START
│
├─Q1: "How would you describe your current experience with AI tools?"
│     └─→ Selected: "I've tried AI tools a few times" (explorer)
│
├─Q2: "Which best describes your primary work or interests?"
│     └─→ Selected: "Software development, data science, engineering" (technical)
│
└─ADAPTIVE QUESTIONS (Technical / Pre-Beginner Level)
  │
  ├─Q3: "What's the difference between training and inference?" [tech_concept_pre_beginner_1]
  │     ├─ "No difference"
  │     ├─ "Training creates the model, inference uses it" ✓
  │     └─ "Training optimizes parameters, inference generates predictions"
  │
  ├─Q4: "How would you call an AI API?" [tech_ops_pre_beginner_1]
  │     ├─ "Don't know how"
  │     ├─ "Send HTTP request with data" ✓
  │     └─ "POST request with authentication headers and JSON payload"
  │
  ├─Q5: "What is PII in the context of AI systems?" [tech_governance_pre_beginner_1]
  │     ├─ "A type of AI model"
  │     ├─ "Personally Identifiable Information" ✓
  │     └─ "Protected data requiring compliance controls"
  │
  └─... (continues with pre-beginner technical questions)
```

---

## 👔 Persona 5: Robert - CEO (AI Leader)

```
START
│
├─Q1: "How would you describe your current experience with AI tools?"
│     └─→ Selected: "I'm an AI expert or leader" (leader)
│
├─Q2: "Which best describes your primary work or interests?"
│     └─→ Selected: "Other or mixed technical/non-technical" (non_technical)
│
└─ADAPTIVE QUESTIONS (Non-Technical / Advanced Level)
  │
  ├─Q3: "How do you evaluate AI tools for your organization?" [nontech_concept_advanced_1]
  │     ├─ "Try them myself"
  │     ├─ "Run pilot programs with metrics" ✓
  │     └─ "Comprehensive evaluation framework with ROI analysis"
  │
  ├─Q4: "How do you train colleagues to use AI?" [nontech_operational_advanced_1]
  │     ├─ "Show them how to use it"
  │     ├─ "Create training materials and workshops"
  │     └─ "Develop comprehensive curriculum with certification paths" ✓
  │
  ├─Q5: "How do you lead AI ethics discussions?" [nontech_governance_advanced_1]
  │     ├─ "Mention ethics in meetings"
  │     ├─ "Facilitate structured discussions with frameworks"
  │     └─ "Implement ethics board with governance processes" ✓
  │
  └─... (continues with strategic/leadership questions)
```

---

## 📈 Question Selection Pattern Analysis

### Dimension Coverage Pattern
```
All Personas Follow This Sequence:
1. Conceptual (understanding)
2. Operational (practical use)
3. Governance (ethics/safety)
[Repeats to ensure all dimensions covered]
```

### Difficulty Adaptation Rules
```
┌─────────────────┐
│ User Selection  │
└────────┬────────┘
         ↓
┌─────────────────────────────────────┐
│ Baseline Answer → Starting Level    │
├─────────────────────────────────────┤
│ Never used      → No Exposure       │
│ Tried few times → Pre-Beginner      │
│ Occasionally    → Beginner          │
│ Regularly       → Intermediate      │
│ Expert/Leader   → Advanced          │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Track Selection → Question Set      │
├─────────────────────────────────────┤
│ Technical       → tech_* questions  │
│ Non-Technical   → nontech_* questions│
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Adaptive Engine Logic               │
├─────────────────────────────────────┤
│ IF user struggles (low answers)     │
│ THEN adjust down one level          │
│                                     │
│ IF user excels (high answers)       │
│ THEN maintain or adjust up          │
└─────────────────────────────────────┘
```

### Question Pool Structure
```
Total Question Bank: 90 Questions
│
├─ Technical Track: 45 Questions
│   ├─ Conceptual: 15 (3 per level × 5 levels)
│   ├─ Operational: 15 (3 per level × 5 levels)
│   └─ Governance: 15 (3 per level × 5 levels)
│
└─ Non-Technical Track: 45 Questions
    ├─ Conceptual: 15 (3 per level × 5 levels)
    ├─ Operational: 15 (3 per level × 5 levels)
    └─ Governance: 15 (3 per level × 5 levels)
```

### Assessment Guarantees
- ✅ Minimum 5 questions (excluding meta)
- ✅ Maximum 10 questions (excluding meta)
- ✅ All 3 dimensions covered
- ✅ Questions adapt to user responses
- ✅ Appropriate difficulty for experience level