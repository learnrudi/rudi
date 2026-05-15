## RUDI Web — Launch Readiness Assessment

Date: 2025-09-02

### Executive Summary
- Status: Pre‑launch; feature scaffolding is present but security, CI/CD, testing, and env hygiene need work before production.
- Key risks: Committed/plaintext secrets in scripts, unguarded admin API route, inconsistent env file handling, and missing test/CI pipeline.
- Blockers to address before launch: remove/rotate exposed secrets, protect admin API(s), fix Prisma runtime dependency, standardize envs, and align database strategy.

---

### Overview
- Framework: Next.js App Router (TypeScript), TailwindCSS, Lucide icons.
- Data/Backend: Prisma ORM with PostgreSQL; Supabase clients present (SSR + browser). tRPC and Better Auth are listed as deps but not implemented in code.
- Structure: `src/app` (routes), `src/components`, `src/lib`, `prisma/` (schema), `supabase/` (SQL migrations/seeds), `scripts/` (content importers, Cloudflare, Supabase utilities), `rudi-lms-package/` (separate Node/TS tooling for content/video ops).

Key files/paths
- Next config: `next.config.ts` (minimal)
- Prisma setup: `src/lib/prisma.ts`, `prisma/schema.prisma`
- Supabase clients: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`
- Admin API: `src/app/api/database/route.ts` (enumerates many tables)
- Docker (DB only): `docker-compose.yml`
- Env examples: `config/.env.local.example`

---

### Build & Run
- Scripts: `dev`, `build`, `start`, `lint` present in `package.json`.
- Local DB via Docker Compose (Postgres + Adminer). Issue: `docker-compose.yml` references `./init.sql`, which is missing.
- Next config is default; no custom build tweaks.

---

### Database & ORM
- Prisma schema is comprehensive (users/auth tables, organizations, courses/lessons/components, assets, progress, certificates, activity events, import staging).
- Prisma client used at runtime: `src/lib/prisma.ts`.
- Dependency issue: `@prisma/client` is in `devDependencies`. It must be in `dependencies` for production runtime imports to work.
- Dual schema sources: Prisma (ORM) and Supabase `migrations/` (SQL). This can drift; decide a single source of truth for production or clearly separate responsibilities.

---

### Authentication & Authorization
- `better-auth` dependency present but no `auth` setup or routes found.
- Supabase SSR cookie refresh middleware exists as `src/middleware.ts.disabled` (not active).
- No route guards found on privileged routes (see Admin API below).

---

### API & Backend Endpoints
- `src/app/api/database/route.ts` fetches and returns broad database contents (users, orgs, courses, lessons, assets, progress, sessions, etc.).
  - Risks: No authentication/authorization; potential PII leakage; heavy queries for large datasets.
  - Recommendation: Remove from production build or restrict with server-only auth and RBAC, and limit fields/pagination.

---

### Environment & Secrets
- Root `.env.local` exists and is ignored by `.gitignore` (good). Variables include DB URLs and several provider credentials (Cloudflare, Mux, AWS/R2). Values should never be printed or sent to client except `NEXT_PUBLIC_*`.
- `config/.env*` files exist (development, production, etc.). `.gitignore` does NOT ignore `config/` (it ignores `.config/`). Risk of accidental commit of secrets.
- Multiple scripts load `.env.production` from project root, which does not exist (most values appear in `.env.local` or `config/`). Standardize the env loading strategy.

Critical secret exposures (must fix):
- `scripts/cloudflare/upload-module-01.sh` includes hardcoded Cloudflare Account ID, email, and API key in plaintext.
- `scripts/data-import/import-production.js` includes fallback hardcoded Supabase service role key and Cloudflare token.
- Some docs also embed real-looking IDs. Even as “defaults,” these should not exist in the repo.

Recommendations:
- Immediately remove/rotate any exposed keys. Replace with environment variables read via `dotenv` or deploy-time secrets.
- Add `config/.env*` to `.gitignore` or move sensitive variants into `.secure/` (already ignored) and keep only a sanitized `config/.env.example`.
- Provide a single `README` section specifying which `.env` file(s) are used by runtime vs. scripts, and align all scripts.

---

### Frontend Readiness
- Pages and components render static marketing and program pages; Tailwind styles are present.
- Supabase clients are scaffolded; there’s no implemented login/registration or gated content yet.
- Some documentation references Storybook and SWR; these aren’t present in `package.json`.

---

### Testing & Quality
- Linting: ESLint with Next.js config present.
- TypeScript: Strict mode enabled.
- Tests: No unit/integration/E2E tests found in the app (only templates/docs in `grammar-ops/`).

Recommendations:
- Add minimum smoke tests for critical routes/components.
- Consider Playwright for basic E2E (public pages, a protected route once auth is added).
- Add a type-safe env validator (e.g., `zod` schema) to fail fast on misconfiguration.

---

### CI/CD & Deployment
- No GitHub Actions or other CI workflows found.
- No Vercel/Netlify config in repo.
- No Dockerfile for app containerization (only DB compose). Decide hosting path (e.g., Vercel) and add appropriate config.

Recommendations:
- Add CI with: install, type-check, lint, build, and tests.
- Add environment groups and secret management for dev/staging/prod.
- Add preview deployments for PRs if using Vercel.

---

### Observability & Compliance
- No logging/monitoring/error tracking libraries found (e.g., Sentry) and no privacy policy disclosures.
- No CSP or security headers configured in `next.config.ts` yet.

Recommendations:
- Add Sentry (server and client) or an equivalent error reporting.
- Add security headers (CSP, X-Frame-Options, Referrer-Policy) and verify with a basic security scan.
- Add a minimal privacy policy and cookie policy page before launch if analytics/auth will be enabled.

---

### Performance & SEO
- `src/app/layout.tsx` defines metadata (title, description, OpenGraph). Good baseline.
- No image optimization config beyond Next defaults; no obvious perf pitfalls surfaced in this scan.

---

### Content Pipeline (Cloudflare/Supabase)
- Rich set of scripts for uploading videos and assets to Cloudflare Stream and Supabase Storage.
- Issues:
  - Plaintext secrets in `upload-module-01.sh` and fallback secrets in `import-production.js`.
  - Hardcoded absolute local paths (e.g., `/Users/hoff/...`) reduce portability.
  - Mixed env loading; some scripts expect `.env.production` at root.

Recommendations:
- Remove hardcoded paths; use config/env vars and CLI args for paths.
- Normalize credential loading across scripts (single `.env` source per environment).
- Ensure all scripts fail hard on missing creds and never print secrets.

---

### Launch Blockers (Critical)
1. Secrets exposure in repo:
   - Remove/rotate any exposed keys in `scripts/cloudflare/upload-module-01.sh` and `scripts/data-import/import-production.js`.
   - Replace with environment variable usage; never commit secrets.
2. Admin API exposure:
   - Protect or remove `src/app/api/database/route.ts` before launch (auth + RBAC + output minimization).
3. Prisma runtime dependency:
   - Move `@prisma/client` from `devDependencies` to `dependencies`.
4. Env hygiene:
   - Add `config/.env*` to `.gitignore` (or relocate to `.secure/`) and keep only sanitized examples.
   - Standardize which `.env` files are used by the app vs. scripts.
5. Docker compose reference:
   - Remove or provide `init.sql` referenced by `docker-compose.yml`, or drop the mount.
6. Dual database strategy:
   - Decide Prisma vs. Supabase SQL as the authoritative schema for production; avoid drift.

---

### High-Priority (Pre‑GA)
- Authentication & authorization: implement Better Auth (or Supabase) with session middleware; add route guards for any admin endpoints.
- CI pipeline: add GitHub Actions to run type-check, lint, tests, and build on PRs.
- Testing baseline: add smoke tests and at least one E2E path.
- Error reporting: add Sentry or equivalent.
- Security headers and basic CSP; verify no sensitive data is sent to client.

---

### Nice-to‑Have (Post‑GA)
- Storybook for UI components and visual regression checks.
- Pre-commit hooks (lint-staged) and conventional commits.
- Env validation with zod and typed process.env.
- Analytics with consent and privacy disclosures.

---

### Quick Wins Checklist
- [ ] Move `@prisma/client` to `dependencies` in `package.json`.
- [ ] Delete plaintext keys from `scripts/cloudflare/upload-module-01.sh`; switch to envs.
- [ ] Delete fallback secrets from `scripts/data-import/import-production.js`.
- [ ] Add `config/.env*` to `.gitignore`; keep `config/.env.local.example` only.
- [ ] Remove/guard `src/app/api/database/route.ts`.
- [ ] Fix `docker-compose.yml` (either add `init.sql` or remove the mount).
- [ ] Add a minimal CI workflow (install → lint → typecheck → build).

---

### Notes & Inventory
- No `.github/` workflows; no Vercel config.
- `scripts/` and `rudi-lms-package/` are powerful but need environment standardization and secret hygiene.
- `src/middleware.ts.disabled` suggests intention for SSR auth cookie refresh; turning this on will change behavior—review carefully.

If you want, I can:
- Patch `package.json` to fix Prisma deps.
- Add `.gitignore` entries for `config/.env*` and extract sanitized `.env.example`.
- Replace hardcoded credentials in scripts with environment variables.
- Add a basic GitHub Actions CI file and a minimal Sentry/headers setup.

