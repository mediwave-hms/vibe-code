# Contributing to MediWave HMS

This project participates in the **Drips Wave** program. All contributions follow the wave-based issue workflow below.

## Issue Complexity & Points

When picking up an issue, check its complexity label:

| Label | Points | Examples |
|---|---|---|
| `complexity: trivial` | 100 pts | Typo fixes, label changes, missing ARIA attributes, copy edits |
| `complexity: medium` | 150 pts | New UI feature, bug fix with moderate scope, filter/search addition |
| `complexity: high` | 200 pts | New module, complex refactor, new integration, algorithm change |

## Workflow

1. **Browse** open issues labeled with the current wave (e.g. `Wave 1`)
2. **Apply** by commenting on the issue — include a brief cover note
3. **Wait** for a maintainer to assign you before starting work
4. **Fork** the repo and create a branch: `feat/issue-42-patient-search` or `fix/issue-17-topbar-crash`
5. **Open a PR** referencing the issue: `Closes #42`
6. **Resolve before wave ends** — unresolved issues roll over to the next wave automatically

## Good First Issues

Look for the `good first issue` label. These are well-scoped, low-risk tasks ideal for onboarding:

- Add `BloodType` selector to patient registration form
- Display wave history trail count badge on case detail page
- Add "Copy Patient ID" button to patient detail header
- Fix mobile responsiveness of the appointments calendar grid
- Add empty state illustration to the review queue page

## Code Standards

- TypeScript strict mode — no implicit `any`
- Components in `src/components/`, pages in `src/pages/`
- Shared utilities in `src/utils/` — extract helpers rather than inlining logic
- Run `npm run typecheck` before opening a PR — zero errors required
- Follow existing naming conventions (PascalCase components, camelCase utils)

## Reviews

After your issue is resolved, both you and the maintainer leave a two-way review within **14 days**. Reviews are anonymous and cover:

**Maintainer → Contributor:** Communication, Code Quality, Timeliness, Problem Solving  
**Contributor → Maintainer:** Communication, Issue Clarity, Repo Code Quality, Timeliness

## Appeal Process

If your onboarding application is rejected:
- First appeal: eligible 14 days after rejection
- Second/third appeals: 30-day cooldown each
- Maximum 3 appeals per contributor
- Appeals must include substantive improvements since rejection
