# Grammar-Ops Alignment for RUDI Tech Stack

## ✅ Perfect Alignment Areas

### 1. Component Architecture
Our stack **exactly matches** grammar-ops structure:
```
/components/
  /primitives/      ✅ Button, Input, Text (base HTML elements)
  /composed/        ✅ Card, Modal, Tabs (built from primitives)
  /features/        ✅ CourseCard, PolicyBuilder (business logic)
  /layout/          ✅ Header, Navigation (page structure)
```

### 2. File Naming Conventions
```typescript
// ✅ Components: PascalCase
CourseCard.tsx
PolicyBuilder.tsx

// ✅ Hooks: camelCase with 'use' prefix
useCourseEnrollment.ts
useAuthSession.ts

// ✅ Services: PascalCase class files
UserService.ts
CourseService.ts

// ✅ API Routes: kebab-case URLs
/api/users          → users/route.ts
/api/course-modules → course-modules/route.ts
```

### 3. Database Layer (Prisma)
```prisma
// ✅ Tables: plural, snake_case
model users {
  user_id     String @id
  email_address String
  created_at  DateTime
}

// ✅ Columns: snake_case
// ✅ Relations: proper naming
model course_enrollments {
  enrollment_id String @id
  user_id      String
  course_id    String
}
```

### 4. API Patterns
```typescript
// ✅ RESTful verbs in service methods
class UserService {
  async findById(id: string)      // ✅ verb + noun
  async createUser(data: DTO)     // ✅ action verb
  async updateProfile(id, data)   // ✅ clear intent
  async deleteAccount(id)         // ✅ CRUD verb
}

// ✅ Route handlers follow conventions
export async function GET()     // index/show
export async function POST()    // create
export async function PUT()     // update
export async function DELETE()  // destroy
```

### 5. Testing Structure
```
// ✅ Test files next to source
UserService.ts
UserService.test.ts

// ✅ Test naming conventions
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data')
    it('should hash password before saving')
  })
})
```

## 🎯 Grammar-Ops Specific Features We'll Use

### 1. Metadata Headers
```typescript
/**
 * @purpose User authentication service
 * @layer services
 * @dependencies prisma, bcrypt, jwt
 */
export class AuthService {
  // ...
}
```

### 2. Component Metadata
```tsx
/**
 * @component CourseCard
 * @layer features
 * @imports Button from primitives, Card from composed
 * @exports CourseCard
 */
```

### 3. CSS Naming (Tailwind + BEM where needed)
```tsx
// Tailwind utilities (grammar-ops approved)
<div className="flex items-center gap-4 p-6">

// BEM for complex components
<div className="course-card">
  <div className="course-card__header">
  <div className="course-card__content">
</div>
```

### 4. Import Hierarchy
```typescript
// ✅ Grammar-ops import order
// 1. External imports
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Internal absolute imports
import { Button } from '@/components/primitives'
import { Card } from '@/components/composed'

// 3. Relative imports
import { useCourseData } from './hooks'
import type { CourseProps } from './types'
```

## 📋 Grammar-Ops Config for RUDI

```json
{
  "project": {
    "name": "rudi-web",
    "type": "fullstack",
    "language": "typescript"
  },
  "frameworks": {
    "frontend": "nextjs",
    "styling": "tailwind",
    "backend": "nextjs-api",
    "database": "prisma"
  },
  "rules": {
    "typescript": {
      "components": {
        "style": "PascalCase",
        "location": "src/components/{layer}/"
      },
      "hooks": {
        "prefix": "use",
        "style": "camelCase"
      }
    },
    "database": {
      "tables": "plural_snake_case",
      "columns": "snake_case",
      "models": "PascalCase"
    }
  }
}
```

## 🔧 Grammar-Ops Scripts We'll Add

```bash
# Component generation
./grammar-ops/scripts/generate-component.js CourseCard feature

# Naming audit
./grammar-ops/scripts/audit-full-stack-naming.sh

# Add metadata
./grammar-ops/scripts/add-universal-metadata.sh

# Style validation
./grammar-ops/scripts/validate-component-styles.cjs
```

## ⚡ Next.js Specific Adaptations

### App Router Conventions
```
/app/
  /(marketing)/        # Route groups (grammar-ops compatible)
    /page.tsx         # Pages are exceptions to component naming
    /layout.tsx       # Layouts use Next.js conventions
  
  /api/
    /users/
      /route.ts       # API routes use 'route.ts' naming
```

### Server vs Client Components
```tsx
// Grammar-ops metadata for server/client
/**
 * @component CourseList
 * @layer features
 * @runtime server
 */

/**
 * @component CourseFilter  
 * @layer features
 * @runtime client
 * @directive use client
 */
```

## 🚀 Implementation Plan

1. **Set up grammar-ops config** in project root
2. **Configure ESLint** with grammar-ops rules
3. **Create component templates** following the architecture
4. **Add pre-commit hooks** for naming validation
5. **Generate components** using grammar-ops scripts

The entire RUDI stack is designed to be 100% grammar-ops compliant from day one!