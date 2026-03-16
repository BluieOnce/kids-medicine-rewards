import { z } from "zod";

// ── Age Groups ──
export const AgeGroup = z.enum(["toddler", "child", "preteen"]);
export type AgeGroup = z.infer<typeof AgeGroup>;

// ── Child ──
export const ChildSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  ageGroup: AgeGroup,
  avatar: z.string(), // emoji or identifier
  createdAt: z.string().datetime(),
});
export type Child = z.infer<typeof ChildSchema>;

// ── Medicine ──
export const MedicineSchema = z.object({
  id: z.string().uuid(),
  childId: z.string().uuid(),
  name: z.string().min(1).max(100),
  dosage: z.string().min(1),
  scheduleTimes: z.array(z.string()), // HH:mm format
  active: z.boolean(),
  createdAt: z.string().datetime(),
});
export type Medicine = z.infer<typeof MedicineSchema>;

// ── Dose Status ──
export const DoseStatus = z.enum(["pending", "completed", "skipped", "late"]);
export type DoseStatus = z.infer<typeof DoseStatus>;

// ── Dose ──
export const DoseSchema = z.object({
  id: z.string().uuid(),
  medicineId: z.string().uuid(),
  childId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  status: DoseStatus,
  completedAt: z.string().datetime().nullable(),
  rewardGranted: z.boolean(),
});
export type Dose = z.infer<typeof DoseSchema>;

// ── Rewards ──
export const RewardsSchema = z.object({
  childId: z.string().uuid(),
  stars: z.number().int().min(0),
  streakCurrent: z.number().int().min(0),
  streakBest: z.number().int().min(0),
});
export type Rewards = z.infer<typeof RewardsSchema>;

// ── Pet Type ──
export const PetType = z.enum(["cat", "dog", "bunny", "dragon"]);
export type PetType = z.infer<typeof PetType>;

// ── Pet ──
export const PetSchema = z.object({
  childId: z.string().uuid(),
  petType: PetType,
  name: z.string().min(1).max(30),
  level: z.number().int().min(1),
  happiness: z.number().int().min(0).max(100),
  hunger: z.number().int().min(0).max(100),
});
export type Pet = z.infer<typeof PetSchema>;

// ── Reminder ──
export const ReminderSchema = z.object({
  id: z.string().uuid(),
  medicineId: z.string().uuid(),
  childId: z.string().uuid(),
  time: z.string(), // HH:mm
  enabled: z.boolean(),
});
export type Reminder = z.infer<typeof ReminderSchema>;

// ── Game Score ──
export const GameScoreSchema = z.object({
  childId: z.string().uuid(),
  game: z.string(),
  score: z.number().int().min(0),
  playedAt: z.string().datetime(),
});
export type GameScore = z.infer<typeof GameScoreSchema>;
