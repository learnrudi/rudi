# RUDI Website - Product Requirements Document

## 1. Project Overview

**Mission**: Build a modern web platform for RUDI (Responsible Use of Digital Intelligence) that serves as both a studio showcase and academy portal for AI literacy and governance.

**Tech Stack**:
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, Prisma, PostgreSQL
- Content: MDX for rich documentation
- Auth: NextAuth.js
- Testing: Jest, React Testing Library, Playwright

## 2. Architecture Overview

```
rudi-web/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── (marketing)/       # Public pages
│   │   ├── (academy)/         # Protected learning pages
│   │   ├── (admin)/           # Admin dashboard
│   │   └── api/               # API routes
│   │
│   ├── components/            # UI components (grammar-ops structure)
│   │   ├── primitives/        # Base components
│   │   ├── composed/          # Combined components
│   │   ├── features/          # Business logic components
│   │   └── layout/            # Page structure
│   │
│   ├── lib/                   # Shared utilities
│   │   ├── auth/             # Authentication logic
│   │   ├── db/               # Database client
│   │   └── utils/            # Helper functions
│   │
│   ├── services/              # Business logic layer
│   │   ├── UserService.ts
│   │   ├── CourseService.ts
│   │   └── ContentService.ts
│   │
│   └── styles/               # Global styles & design tokens
│
├── prisma/                    # Database schema
├── content/                   # MDX content files
├── public/                    # Static assets
└── tests/                     # Test files
```

## 3. Core Features

### 3.1 Marketing/Public Site
**Pages**:
- `/` - Homepage with value prop
- `/about` - RUDI story and mission
- `/services` - Academy, Consulting, Tools
- `/resources` - Blog, guides, whitepapers
- `/contact` - Engagement options

**Components Needed**:
```
/features/
  ├── Hero/
  │   ├── HeroSection.tsx
  │   └── useHeroAnimation.ts
  ├── ServiceCard/
  │   ├── ServiceCard.tsx
  │   └── ServiceGrid.tsx
  ├── ResourceHub/
  │   ├── ResourceCard.tsx
  │   ├── ResourceFilter.tsx
  │   └── useResourceSearch.ts
  └── ContactForm/
      ├── ContactForm.tsx
      └── useContactSubmit.ts
```

### 3.2 Academy Platform
**Pages**:
- `/academy` - Course catalog
- `/academy/courses/[slug]` - Course detail
- `/academy/my-learning` - User dashboard
- `/academy/certificates` - Credentials

**Components Needed**:
```
/features/
  ├── CourseCard/
  │   ├── CourseCard.tsx
  │   ├── CourseProgress.tsx
  │   └── useCourseData.ts
  ├── LearningDashboard/
  │   ├── Dashboard.tsx
  │   ├── ProgressChart.tsx
  │   └── useLearningStats.ts
  ├── VideoPlayer/
  │   ├── VideoPlayer.tsx
  │   └── useVideoTracking.ts
  └── Certificate/
      ├── CertificateView.tsx
      └── useCertificateGeneration.ts
```

### 3.3 Tools & Demos
**Pages**:
- `/tools` - Tool directory
- `/tools/rudi` - Interactive demo
- `/tools/policy-builder` - Policy generator

**Components Needed**:
```
/features/
  ├── PromptBuilder/
  │   ├── PromptBuilder.tsx
  │   ├── PromptTemplate.tsx
  │   └── usePromptValidation.ts
  ├── PolicyGenerator/
  │   ├── PolicyWizard.tsx
  │   ├── PolicyPreview.tsx
  │   └── usePolicyGeneration.ts
  └── CodePlayground/
      ├── Playground.tsx
      └── useCodeExecution.ts
```

## 4. Shared Components Library

### Primitives (following grammar-ops)
```
/primitives/
  ├── Button.tsx         # Base button component
  ├── Input.tsx          # Text input
  ├── Select.tsx         # Dropdown select
  ├── Text.tsx           # Typography component
  ├── Link.tsx           # Next.js link wrapper
  ├── Image.tsx          # Next.js image wrapper
  └── Icon.tsx           # Icon component
```

### Composed Components
```
/composed/
  ├── Card/
  │   ├── Card.tsx
  │   ├── CardHeader.tsx
  │   └── CardBody.tsx
  ├── Modal/
  │   ├── Modal.tsx
  │   └── useModal.ts
  ├── Tabs/
  │   ├── Tabs.tsx
  │   └── TabPanel.tsx
  ├── Alert/
  │   ├── Alert.tsx
  │   └── AlertTypes.ts
  └── FormField/
      ├── FormField.tsx
      └── useFormValidation.ts
```

## 5. Backend Architecture

### API Routes Structure
```
/app/api/
  ├── auth/
  │   ├── [...nextauth]/route.ts
  │   └── register/route.ts
  ├── users/
  │   ├── route.ts              # GET /api/users, POST /api/users
  │   └── [id]/route.ts         # GET/PUT/DELETE /api/users/:id
  ├── courses/
  │   ├── route.ts
  │   ├── [slug]/route.ts
  │   └── [slug]/enroll/route.ts
  ├── content/
  │   ├── route.ts
  │   └── [type]/route.ts
  └── admin/
      ├── stats/route.ts
      └── users/route.ts
```

### Database Schema (Prisma)
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String?
  role            Role      @default(LEARNER)
  enrollments     Enrollment[]
  certificates    Certificate[]
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
}

model Course {
  id              String    @id @default(cuid())
  slug            String    @unique
  title           String
  description     String
  modules         Module[]
  enrollments     Enrollment[]
  created_at      DateTime  @default(now())
}

model Module {
  id              String    @id @default(cuid())
  course_id       String
  course          Course    @relation(fields: [course_id], references: [id])
  title           String
  content         String    @db.Text
  order           Int
  lessons         Lesson[]
}

enum Role {
  LEARNER
  INSTRUCTOR
  ADMIN
}
```

## 6. Content Management

### MDX Structure
```
/content/
  ├── blog/
  │   ├── 2024-01-ai-literacy.mdx
  │   └── 2024-02-prompt-engineering.mdx
  ├── guides/
  │   ├── getting-started.mdx
  │   └── policy-framework.mdx
  ├── courses/
  │   └── ai-fundamentals/
  │       ├── meta.json
  │       ├── 01-introduction.mdx
  │       └── 02-ethics.mdx
  └── policies/
      ├── k12-template.mdx
      └── higher-ed-template.mdx
```

## 7. Design System

### Design Tokens (Tailwind config)
```javascript
{
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    accent: {
      50: '#fff7ed',
      500: '#f97316',
      900: '#7c2d12'
    }
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui'],
      mono: ['JetBrains Mono']
    }
  }
}
```

## 8. Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Next.js setup with TypeScript
- [ ] Component library (primitives + composed)
- [ ] Database schema and Prisma setup
- [ ] Authentication flow
- [ ] Basic layout components

### Phase 2: Marketing Site (Week 3-4)
- [ ] Homepage with hero and features
- [ ] Service pages
- [ ] Resource hub with MDX
- [ ] Contact form with API
- [ ] SEO optimization

### Phase 3: Academy Core (Week 5-6)
- [ ] Course catalog and detail pages
- [ ] User dashboard
- [ ] Enrollment system
- [ ] Progress tracking
- [ ] Basic video player

### Phase 4: Tools & Interactivity (Week 7-8)
- [ ] RUDI demo
- [ ] Policy builder wizard
- [ ] Interactive examples
- [ ] Code playground
- [ ] Share functionality

### Phase 5: Polish & Launch (Week 9-10)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] E2E testing
- [ ] Documentation
- [ ] Deployment setup

## 9. Success Metrics

- **Performance**: Lighthouse score > 90
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Core Web Vitals passing
- **User Experience**: <3s page load, smooth interactions
- **Code Quality**: 80%+ test coverage, grammar-ops compliant

## 10. Technical Considerations

- **State Management**: Zustand for client state, React Query for server state
- **Error Handling**: Centralized error boundaries and logging
- **Analytics**: Privacy-focused analytics (Plausible/Fathom)
- **Monitoring**: Sentry for error tracking
- **CI/CD**: GitHub Actions with preview deployments
- **Security**: Rate limiting, CSRF protection, input validation