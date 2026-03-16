# Medicine Heroes

A mobile-first web app that helps children take medicine using rewards, mini-games, calming tools, and streak tracking.

## Tech Stack

- **Next.js 14** - App Router, TypeScript
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **localStorage** - Persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone or in mobile view.

## Features

### For Parents
- Create child profiles
- Add medicines with schedule times
- Mark doses as complete or skipped
- Track streaks and stars earned

### For Children
- Confirm medicine taken with reward animations
- Earn stars for on-time doses
- Feed and play with a virtual pet
- Play Balloon Pop mini-game
- Use calming tools before medicine time

### Calm Tools
- **Breathing Bubble** - Animated inhale/exhale circle
- **Tap Rhythm** - Follow-the-pattern distraction game
- **Counting Stars** - Tap stars as they appear

## Project Structure

```
src/
  app/          # Next.js pages
  components/   # React components (ui/, parent/, child/)
  domain/       # Business logic (dose, rewards, streak, pet)
  data/         # Repository pattern + localStorage
  store/        # Zustand store
  types/        # Zod schemas and TypeScript types
  games/        # Mini-game modules
```

## Architecture

The app follows a layered architecture:
1. **UI Layer** - React components with Framer Motion
2. **Store Layer** - Zustand for state management
3. **Domain Layer** - Pure business logic services
4. **Data Layer** - Repository pattern over localStorage

See [docs/HLD.md](docs/HLD.md) for the full high-level design.
