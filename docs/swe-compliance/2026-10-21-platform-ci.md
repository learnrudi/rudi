# Site platform CI — 2026-10-21

## Phase 0: Baseline and manual lookup

- [x] Node `site-ci`, attempt `site-ci-1`; initially clean feature branch
  `codex/platform-ci-20261021` at
  `95fe6aecac28e72f1414a69f0e11f9539476a2d2` (`origin/main`).
- [x] Assigned worktree:
  `/Users/hoff/RUDI/worktrees/learnrudi/platform-ci-20261021`.
- [x] No repository-root or nearer AGENTS.md; inherited RUDI workspace and
  supplied global guidance applies. Read package scripts/lockfile, README,
  Vercel configuration and existing tests. No CI workflow exists.
- [x] Applied the SWE compliance checklist skill already loaded in this agent;
  relevant manual sections: master doctrine Appendix C, Agent Co-Pilot,
  Security F8 and Infrastructure H1.
- [x] Verified the official [Vercel Git configuration documentation](https://vercel.com/docs/project-configuration/git-configuration)
  on 2026-10-21: boolean `git.deploymentEnabled: false` is the documented
  configuration for disabling automatic deployments on all branches.
- [x] Medium risk for source CI; deployment boundary is high risk. This node
  proposes source only. The coordinator has evidence of production deployments
  from main; the previous README also documented automatic deployment on push.

## Phase 1: Scope lock

- [x] Only `.github/workflows/ci.yml`, `README.md`, `vercel.json` and this record
  may change. No public content, application/test code, lockfile, provider,
  GitHub setting, credentials, database, Admin host, release or schedule writes.
- [x] One coherent proposed source slice: CI plus Vercel Git-deployment guard
  and current documentation. No commit, push, PR or merge by this node.
- [x] Contract: every PR to main and main push runs a single stable
  `Site CI required` job: Node 24, npm ci, npm test, npm run build; any failed
  step fails the job. No path filters, optional steps or allow-failure settings.
- [x] Workflow is read-only, hosted/ephemeral, no persisted checkout credential,
  deployment action, secret, environment, untrusted shell interpolation or
  pull_request_target. Keep existing npm lockfile and all Vercel settings other
  than the explicit Git deployment toggle.
- [x] Horizontal disposition: no obligation / no action. The same reviewed
  action pins as Registry are used; a single strict job needs no aggregate or
  shared action abstraction. No application responsibility is duplicated.
- [x] Source guard is not proof of effective provider state. Before any push,
  PR or merge, coordinator must verify both live Vercel projects `rudi-web`
  and `learnrudi`, their repository/root mappings, and effective automatic Git
  deployment controls, including previews. Source and publication stay held.

## Phase 2: Red evidence

- [x] Configuration-only: no application behavior changes or speculative unit
  tests. Baseline has no CI and no Git deployment guard. Actual workflow/static
  JSON validation and existing tests/build are the appropriate proof; no
  implementation-mirroring red test is introduced.

## Phase 3: Implementation

- [x] Add pinned, non-deploying PR/main Node24 verification workflow.
- [x] Add only `git.deploymentEnabled: false` to Vercel source configuration.
- [x] Update README's CI and release guidance, including the unresolved live
  provider verification hold and separate manual coordinator release intent.

## Phase 4: Green and refactor

- [x] Existing tests/build pass; no application refactor or weakened tests.
- [x] Actual workflow YAML, shell and JSON preservation checks pass.

## Phase 5: Full verification

Local Darwin arm64, Node 24.21.0 and npm 11.19.0. Task-local dependencies
installed with the existing lockfile; no canonical node_modules symlink.

| Check | Exact command / observed result |
| --- | --- |
| Dependencies | `npm ci` — exit 0, 46 packages installed; package manifest and lockfile unchanged |
| Tests | `npm test` — exit 0, 66 passed, no failure/cancellation/skip (264.119ms) |
| Build | `npm run build` — exit 0, 84 public skills verified; static site layout check passed |
| Workflow | `ruby -rjson -ryaml -e 'puts JSON.generate(YAML.load_file(ARGV.fetch(0)))' .github/workflows/ci.yml` parsed actual YAML; Python stdin assertions checked universal main/PR triggers, single strict named job, Node24, action pins, read-only permissions, no optional steps, no deployment or secrets, ordered npm ci/test/build; every run block passed `bash -n` |
| Vercel source | Python stdlib JSON parsed actual and HEAD configs; after removing exactly `git: {deploymentEnabled: false}`, every other value equals HEAD |
| Scope | `git diff --quiet -- package.json package-lock.json` — exit 0; no dependency-source changes |
| Diff | `git diff --check` — exit 0 |
| JS/TS debt | Not applicable: no JS/TS edited |

Local command logs remain in ignored `temp/site-ci/`. No implementation changes
followed successful checks, so no repeat test loops were needed. Existing lock
advisories reported by npm ci: 2 (1 moderate, 1 high); dependency remediation is
outside this configuration-only node and requires a separate reviewed update.

GitHub-hosted execution and live Vercel configuration are explicitly unverified.
Official documentation establishes the property and boolean value, not the
live project's effective configuration or repository root. No provider access,
browser, login, Vercel stack installation, preview or production deployment
occurred. Source publication remains held until the coordinator resolves both
live project mappings and Git deployment controls.

## Phase 6: Docs, contracts and closure

- [x] README agrees with source proposal and does not claim live enforcement.
- [ ] Coordinating task owns fresh Astra Standards/Spec/Proof review and future
  hosted CI after the provider hold is resolved. Closing proof is the review,
  verified live project mapping/controls and successful hosted job.
- [ ] Coordinating task owns retained-worktree closeout after review; trigger
  is acceptance and closing proof is receipt read-back naming this attempt.
- Publication: no commit, push, PR, merge, provider/settings mutation,
  deployment, Admin adoption, credential, database or recurrence changes.
- Verdict: local source proposal ready for independent Astra review; all local
  checks pass. Source-publication hold and live-provider/hosted-proof gates
  remain. Four allowed files are uncommitted at the exact base; no publication
  or live change performed.
