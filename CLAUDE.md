# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Medicine Heroes** is a mobile-first Next.js web app that helps children take medicine using:
- rewards
- streaks
- calming tools
- mini-games
- a pet progression loop

The app is designed for **parent + child sharing one device**.

Primary current platform:
- mobile web
- deployed on Vercel

Planned future platform:
- Android app via Capacitor wrapper

This is **not** a medical system, pharmacy platform, diagnosis tool, or clinician product.
It is a **behavior + emotional regulation product**.

### Core product loop
1. Parent sees medicine is due
2. Parent gives medicine
3. Child confirms in the app
4. App gives immediate positive feedback
5. Child earns stars / streak progress
6. Child feeds or grows a pet
7. Child optionally uses a mini-game or calming tool

### Most important user problem
The biggest real-world pain is often **fear and stress before injections or medicine**, not just tracking the dose.

When making product or UX decisions, prioritize:
1. reducing child anxiety
2. making parent actions fast and obvious
3. making reward moments emotionally satisfying
4. keeping persistence reliable

Mini-games matter, but they are secondary. Calm tools and fast parent UX matter more.

---

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```
No test framework is configured — there are currently no tests.

## Architecture

```
UI (pages/components) → Zustand Store → Domain Services → Repositories → localStorage
```

Data flow is strictly one-directional.
The store is the only layer that orchestrates cross-domain workflows.

Example: `completeDose()` in the store chains:
- `doseService.completeDose()`
- `rewardService.grantDoseReward()`
- `streakService.updateStreak()`
- daily bonus check
- pet progression update if relevant

### Critical rule
Domain services never call each other directly. They must remain pure and isolated. Cross-domain workflows belong in the store.

### Layers

#### UI
Location:
- `src/app/`
- `src/components/`

Rules:
- All pages are client components (`"use client"`)
- Components are split into:
  - `ui/` shared primitives
  - `child/` child-facing components
  - `parent/` parent-facing components
- All user-facing strings must use translation via `t()`
- Do not put business logic in components

#### Store
Location:
- `src/store/useAppStore.ts`

Rules:
- Single Zustand store orchestrates all cross-domain behavior
- Manages `activeChildId`
- `loadData()` auto-sets active child if only one exists
- Store is responsible for persistence hydration coordination

#### Domain
Location:
- `src/domain/`

Rules:
- Pure business logic only
- Singleton objects with arrow function methods
- No UI imports
- No storage imports
- No React imports
- No side effects beyond returned values

#### Repositories
Location:
- `src/data/repositories/`

Rules:
- CRUD over localStorage
- All repos read full array, filter in-memory, and write back
- No component should access localStorage directly
- Missing reward records are auto-initialized

#### Storage
Location:
- `src/data/storage/localStorage.ts`

Rules:
- Must use `isClient()` guard to prevent SSR issues
- Keys are prefixed with `app:v1:`
- Authentication adds user-scoped prefix when enabled

### Domain Services

Singleton objects with arrow-function methods, not classes.

**doseService** — Dose generation from medicine schedules, completion (on-time vs late), skipping. Late threshold: 30 min.

**rewardService** — Star granting per dose, daily bonus calculation, feed cost deduction.

**streakService** — Current/best streak calculation from dose history.

**petService** — Pet creation, feeding, playing, evolution logic, mystery egg reveal, unlock checks.

**analyticsService** — Child stats (completion rate, stars, streak), dose history with medicine names, weekly completion rates.

---

## Product Priorities for Claude

When choosing what to improve, prioritize in this order:

### 1. Parent clarity
The parent must understand the current state instantly:
- what is due now
- what is overdue
- what is completed
- what to do next

### 2. Child emotional experience
The child experience should feel:
- safe
- calm
- simple
- rewarding
- non-threatening

### 3. Reliable persistence
The app should survive:
- refresh
- browser close/open
- Vercel redeploys
- hydration without broken UI state

### 4. Reward satisfaction
Successful actions should feel meaningful:
- animation
- progression
- visible pet response
- immediate feedback

### 5. Simplicity over feature sprawl
Do not add large systems unless explicitly asked. Prefer polishing the core loop over adding new complexity.

---

## UX Design Rules

### Parent UX
- Parent screens should be fast and obvious
- The ideal parent flow is "open app and know what to do in under 2 seconds"
- Use clear statuses: due now, coming up, completed, skipped
- Prefer compact but readable cards
- Show progress like "2 / 3 doses completed today"

### Child UX
- Very few words
- Large buttons
- Clear visual states
- Strong reward moment
- Avoid clutter
- Avoid long menus
- Use emotional reactions: stars, pet animations, positive feedback

### Calm tools UX
This is a core differentiator. If improving the child flow, prefer:
- breathing guidance
- distraction interaction
- gentle animations
- calming colors
- low cognitive load

### Reward UX
Rewards should not be merely functional. A good reward flow includes:
- brief anticipation
- visible star count-up
- pet reaction
- optional unlock or progress reveal

---

## Persistence Rules

Persistent experience is critical.

### Current persistence model
- Zustand store + repositories + localStorage
- Storage must survive page refresh and browser restart

### Requirements
- Hydration must not cause broken UI
- Avoid flickering empty state before persisted data loads
- Any new persisted feature must work correctly with existing storage versioning
- If adding new fields, handle missing old values safely

### When modifying persistence
- Preserve backward compatibility where reasonable
- Do not break existing user data
- If a migration is needed, keep it small and explicit
- Prefer lazy migration when feasible

---

## Key Files
- `src/types/index.ts` — All Zod schemas with inferred TypeScript types. Uses `z.string().uuid()` for IDs. Types: Child, Medicine, Dose, Rewards, Pet, Reminder, GameScore.
- `src/store/useAppStore.ts` — Central store with actions grouped by domain (children, medicines, doses, rewards, pet).
- `src/data/storage/localStorage.ts` — Storage keys and `getItem<T>`/`setItem<T>` helpers.

### Types
All Zod schemas live in `src/types/index.ts`.

Rules:
- Use `z.string().uuid()` for IDs
- Keep schemas and inferred types aligned
- Prefer extending schemas over introducing parallel hand-written types

## Authentication & Firebase

Firebase is **optional**. If env vars are not set, the app works in unauthenticated local-only mode.

- **Setup**: Copy `.env.local.example` to `.env.local` and fill in Firebase config values.
- **`src/lib/firebase.ts`** — Lazy client-only initialization (prevents SSR crashes). Use `getFirebaseApp()` / `getFirebaseAuth()`.
- **`src/lib/auth.ts`** — Google Sign-In via popup, sign-out, `onAuthChange()` listener. Exports `AppUser` type.
- **`AuthGuard`** (`src/components/auth/AuthGuard.tsx`) — Wraps authenticated pages. Redirects to `/login` if unauthenticated, and away from `/login` if already signed in.
- **User-scoped storage**: On login, `setStoragePrefix(user.uid)` switches localStorage keys to `app:v1:[uid]:*`. Includes one-time migration from unscoped keys for existing data.

**Rule**: All features must still work without Firebase configured.

## Pet System

Multi-slot system (10 slots per child). Pets start as mystery eggs, revealed after 3 feeds.

- **Stages**: egg → baby (level 2-3) → child (4-5) → teen (6-7) → adult (8+). Level up when hunger reaches 100.
- **Unlock thresholds** (by best streak): cat: 0, dog: 3, bunny: 5, dragon: 7, hamster: 10, parrot: 14, turtle: 18, unicorn: 23, fox: 28, panda: 35.
- **Interactions**: Feed (−5 stars, +25 hunger, +5 happiness), Play (+20 happiness).
- Service: `src/domain/pet/petService.ts`, Repo: `src/data/repositories/petRepository.ts` (includes lazy migration for old single-pet format).

## i18n (Hebrew + English)

Custom lightweight translation system in `src/i18n/`. No external i18n library.

- **`TranslationProvider`** wraps the app in `layout.tsx`. Provides `t()`, `locale`, `setLocale`, `dir`.
- **`useTranslation()`** hook — use `t("key")` for strings, `t("key", { name: "value" })` for interpolation.
- **Translation files**: `src/i18n/locales/en.json` and `he.json`. Flat keys with dot-prefixed namespaces (e.g. `dashboard.stars`, `medicine.addTitle`).
- **Default language is Hebrew** (`he`). Stored in `localStorage` key `app:v1:locale`.
- **RTL**: `dir="rtl"` set on `<html>` for Hebrew. Use Tailwind's `rtl:` variant for directional overrides. `PageHeader` flips the back arrow based on `dir`.
- **Adding new strings**: Add the key to both `en.json` and `he.json`, then use `t("your.key")` in the component. English fallback is used if a Hebrew key is missing.

## Import Alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

## Reward Rules
| Action | Stars |
|---|---|
| On-time dose | +10 |
| Late dose (>30min) | +5 |
| Skipped | 0 |
| All daily doses complete | +10 bonus |
| Feed pet | -5 |

## Tailwind Theme

Custom colors: `primary` (blues), `reward-gold`/`reward-star` (ambers), `calm-light`/`calm-medium`/`calm-deep` (sky/cyan/blue).

Custom animations: `breathe-in`, `breathe-out`, `star-burst`, `float-up`, `bounce-in`.

Use existing design tokens before inventing new ones.

## Git Workflow
- Always use feature branches — never commit directly to main.
- Update CLAUDE.md when pushing to main (if architecture or conventions changed).

## Conventions
- Mobile-first design — max-width 480px centered
- Use existing UI components from `src/components/ui/` before creating new ones
- Domain logic must stay in `src/domain/`, never in components
- Repository pattern: all localStorage access goes through repos, never direct
- Framer Motion for all animations
- Emoji-based avatars and icons (no external icon library)
- Cascading deletes: deleting a child cascades to medicines, doses, rewards, and pet via the store
- All user-facing strings must use `t()` from `useTranslation()` — never hardcode text in components
- Pages using `useSearchParams()` must wrap content in a `<Suspense>` boundary (Next.js 14 requirement for static generation)

---

## Coding Behavior Expected from Claude

### When changing code

**Prefer:**
- small focused changes
- preserving existing patterns
- improving UX without rewriting architecture
- using existing components and utilities
- explicit and readable code over cleverness

**Avoid:**
- large rewrites unless requested
- introducing new libraries without strong reason
- mixing business logic into components
- breaking persistence
- changing translations casually
- adding fake abstraction layers

### When implementing a new feature

Claude should:
1. inspect existing patterns first
2. reuse store/repository/domain conventions
3. preserve translations
4. preserve RTL support
5. preserve local-only mode
6. preserve authenticated mode
7. avoid regressions in persistence

---

## Experience Improvements Priority List

If asked to improve the app experience, focus on these first:

**High priority:**
- stronger parent dashboard clarity
- better dose status visibility
- smoother reward moments
- better calm-mode experience
- more obvious pet progression
- more reliable persistence and hydration

**Medium priority:**
- analytics polish
- more badge feedback
- better empty states
- small motion polish

**Low priority:**
- adding new complex systems
- large gamification expansions
- over-designed visuals
- chat/social systems

---

## Review Heuristics for Claude

Before finalizing a UX-related change, ask internally:
1. Does this reduce parent confusion?
2. Does this reduce child stress?
3. Does this make success feel better?
4. Does this preserve persistence?
5. Does this keep the app simple?

If not, reconsider the change.

---

## Important Product Constraint

Do not drift into building:
- social chat between children
- medical advice features
- prescription management platform
- clinician tooling
- heavy backend systems

The current product wins by being:
- calm
- simple
- reliable
- emotionally rewarding
