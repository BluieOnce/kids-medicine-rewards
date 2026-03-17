# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**Medicine Heroes** — Mobile-first Next.js web app helping children take medicine using rewards, mini-games, calming tools, and streak tracking. Designed for parent+child sharing one device. Will later be wrapped into Android via Capacitor.

## Commands
```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```
No test framework is configured — there are no tests.

## Architecture

```
UI (pages/components) → Zustand Store → Domain Services → Repositories → localStorage
```

**Data flow is strictly one-directional.** The store is the only layer that orchestrates cross-domain workflows. For example, `completeDose()` in the store chains: `doseService.completeDose()` → `rewardService.grantDoseReward()` → `streakService.updateStreak()` → daily bonus check. Domain services never call each other directly.

### Layers
- **UI** (`src/app/` pages, `src/components/`) — All pages are client components (`"use client"`). Components split into `ui/` (shared primitives), `child/` (child-facing), `parent/` (parent-facing).
- **Store** (`src/store/useAppStore.ts`) — Single Zustand store orchestrating all domains. Manages `activeChildId` for currently selected child. `loadData()` auto-sets active child if only one exists.
- **Domain** (`src/domain/`) — Pure business logic as singleton objects with arrow function methods (not classes). No UI or storage imports.
- **Repositories** (`src/data/repositories/`) — CRUD over localStorage. All repos read the full array, filter in-memory, and write back. `rewardsRepository.getByChildId()` auto-initializes missing children with `{stars: 0, streakCurrent: 0, streakBest: 0}`.
- **Storage** (`src/data/storage/localStorage.ts`) — Wrapper with `isClient()` guard to prevent SSR errors. Keys prefixed `app:v1:`.

### Key Files
- `src/types/index.ts` — All Zod schemas with inferred TypeScript types. Uses `z.string().uuid()` for IDs.
- `src/store/useAppStore.ts` — Central store with actions grouped by domain (children, medicines, doses, rewards, pet).
- `src/data/storage/localStorage.ts` — Storage keys and `getItem<T>`/`setItem<T>` helpers.

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
Custom colors: `primary` (blues), `reward-gold`/`reward-star` (ambers), `calm-light`/`calm-medium`/`calm-deep` (sky/cyan/blue). Custom animations: `breathe-in`, `breathe-out`, `star-burst`, `float-up`, `bounce-in`.

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
