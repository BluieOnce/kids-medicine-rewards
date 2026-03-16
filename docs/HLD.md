# High-Level Design: Medicine Heroes

## Overview
Mobile-first web app helping children take medicine through rewards, mini-games, calming tools, and streak tracking. Designed for parent-child shared device use.

## Architecture

```
┌─────────────────────────────────────────┐
│              Next.js App (UI)           │
│  Pages / Components / Framer Motion     │
├─────────────────────────────────────────┤
│           Zustand Store Layer           │
│       (useAppStore - state mgmt)        │
├─────────────────────────────────────────┤
│            Domain Services              │
│  doseService │ rewardService │ petSvc   │
│  streakService                          │
├─────────────────────────────────────────┤
│          Repository Layer               │
│  childRepo │ medicineRepo │ doseRepo    │
│  rewardsRepo │ petRepo                  │
├─────────────────────────────────────────┤
│         localStorage (JSON)             │
└─────────────────────────────────────────┘
```

## Data Models

| Model    | Key Fields                                    |
|----------|-----------------------------------------------|
| Child    | id, name, ageGroup, avatar                    |
| Medicine | id, childId, name, dosage, scheduleTimes[]    |
| Dose     | id, medicineId, scheduledAt, status, reward   |
| Rewards  | childId, stars, streakCurrent, streakBest      |
| Pet      | childId, petType, name, level, happiness, hunger |

## Key Screens

1. **Dashboard** - Today's doses, stars, streak, quick actions
2. **Child Profile** - Add/manage children
3. **Medicine Management** - Add/edit/pause medicines
4. **Dose Confirmation** - Child confirms taking medicine
5. **Reward Screen** - Stars, streaks, earning info
6. **Pet Screen** - Feed and play with virtual pet
7. **Calm Tools** - Breathing exercise, tap rhythm, counting stars
8. **Balloon Pop** - 30-second tap game

## Reward Rules

| Action              | Stars |
|---------------------|-------|
| On-time dose        | +10   |
| Late dose (>30min)  | +5    |
| Skipped             | 0     |
| All daily complete  | +10 bonus |

## Storage Keys
- `app:v1:children`
- `app:v1:medicines`
- `app:v1:doses`
- `app:v1:rewards`
- `app:v1:pet`

## Future Considerations
- Capacitor wrapping for Android
- Push notifications via Capacitor local notifications
- Prescription renewal tracking
- Child-safe chat (requires COPPA compliance)
- Additional mini-games
