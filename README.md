# Medicine Heroes

A mobile-first web app that helps children take medicine using rewards, mini-games, calming tools, and streak tracking. Designed for parent + child sharing one device.

## Why

The biggest real-world pain is fear and stress before injections or medicine. Medicine Heroes turns medicine time into a calm, rewarding experience with immediate positive feedback, pet progression, and anxiety-reduction tools.

## Tech Stack

- **Next.js 14** - App Router, TypeScript
- **Tailwind CSS** - Mobile-first styling with RTL support
- **Zustand** - State management
- **Zod** - Schema validation
- **Framer Motion** - Animations and reward moments
- **localStorage** - Persistence (survives refresh and browser close)
- **Firebase** (optional) - Google Sign-In with user-scoped storage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone or in mobile view.

### Firebase (optional)

Copy `.env.local.example` to `.env.local` and fill in Firebase config values. The app works fully without Firebase in local-only mode.

## Features

### For Parents
- Dashboard with clear dose status: overdue, due now, upcoming, completed
- Doses sorted by urgency so the most important action is always at the top
- Progress bar showing daily completion
- Add children with emoji avatars and age groups
- Add medicines with multiple daily schedule times
- Mark doses as complete or skipped
- Track streaks and stars earned
- Admin statistics dashboard with dose history and weekly trends

### For Children
- Confirm medicine taken with satisfying star burst animation
- Earn stars for on-time doses (+10), late doses (+5), and daily bonus (+10)
- Feed and play with virtual pets across 10 slots
- Hatch mystery eggs after 3 feeds with reveal animation
- Watch pets evolve through 5 stages (egg, baby, child, teen, adult)
- Unlock new pet types with longer streaks (cat, dog, bunny, dragon, and more)
- Play Balloon Pop mini-game
- Streak milestone celebrations at 3, 7, 14, 21, 30, 50, and 100 days

### Calm Tools
- **Breathing Bubble** - Evidence-based 4-2-4-1 breathing pattern with animated guide
- **Tap Rhythm** - Pattern-following distraction game with score feedback
- **Counting Stars** - Tap-to-catch grounding exercise with calming dark theme

### i18n
- Full Hebrew and English support
- RTL layout for Hebrew
- Default language: Hebrew

## Project Structure

```
src/
  app/          # Next.js pages (dashboard, medicine, reward, calm-tools, games, settings)
  components/   # React components (ui/, parent/, child/)
  domain/       # Business logic (dose, rewards, streak, pet, analytics)
  data/         # Repository pattern + localStorage
  store/        # Zustand store (single store orchestrating all domains)
  types/        # Zod schemas and TypeScript types
  i18n/         # Translation system (en.json, he.json)
  games/        # Mini-game modules
```

## Architecture

```
UI (pages/components) → Zustand Store → Domain Services → Repositories → localStorage
```

1. **UI Layer** - React components with Framer Motion animations
2. **Store Layer** - Zustand for state management and cross-domain orchestration
3. **Domain Layer** - Pure business logic services (no UI, no storage imports)
4. **Data Layer** - Repository pattern over localStorage with SSR guards

Domain services never call each other directly. Cross-domain workflows live in the store.

See [docs/HLD.md](docs/HLD.md) for the full high-level design.

## Deployment

Deployed on Vercel. Future plan: Android app via Capacitor wrapper.
