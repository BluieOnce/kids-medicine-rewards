import { Pet, PetType, PetStage } from "@/types";
import { petRepository } from "@/data/repositories/petRepository";

const FEED_COST = 5; // stars
const FEED_HUNGER_AMOUNT = 25;
const PLAY_HAPPINESS_AMOUNT = 20;
const HATCH_FEED_THRESHOLD = 3;

// ── Unlock thresholds (best streak required) ──
const PET_UNLOCK_THRESHOLDS: Record<PetType, number> = {
  cat: 0,
  dog: 3,
  bunny: 5,
  dragon: 7,
  hamster: 10,
  parrot: 14,
  turtle: 18,
  unicorn: 23,
  fox: 28,
  panda: 35,
};

const PET_ORDER: PetType[] = [
  "cat",
  "dog",
  "bunny",
  "dragon",
  "hamster",
  "parrot",
  "turtle",
  "unicorn",
  "fox",
  "panda",
];

// ── Evolution stage emojis ──
const PET_STAGE_EMOJIS: Record<PetType, Record<PetStage, string>> = {
  cat:     { egg: "🥚", baby: "🐱", child: "😺", teen: "😸", adult: "😼" },
  dog:     { egg: "🥚", baby: "🐶", child: "🐕", teen: "🦮", adult: "🐕‍🦺" },
  bunny:   { egg: "🥚", baby: "🐰", child: "🐇", teen: "🐇", adult: "🐰" },
  dragon:  { egg: "🥚", baby: "🐲", child: "🐉", teen: "🐉", adult: "🐲" },
  hamster: { egg: "🥚", baby: "🐹", child: "🐹", teen: "🐭", adult: "🐹" },
  parrot:  { egg: "🥚", baby: "🐥", child: "🐤", teen: "🦜", adult: "🦜" },
  turtle:  { egg: "🥚", baby: "🐢", child: "🐢", teen: "🐢", adult: "🐢" },
  unicorn: { egg: "🥚", baby: "🦄", child: "🦄", teen: "🦄", adult: "🦄" },
  fox:     { egg: "🥚", baby: "🦊", child: "🦊", teen: "🦊", adult: "🦊" },
  panda:   { egg: "🥚", baby: "🐼", child: "🐼", teen: "🐻", adult: "🐼" },
};

export interface FeedResult {
  pet: Pet;
  hatched: boolean;
  evolved: boolean;
  newStage?: PetStage;
  revealedType?: PetType;
}

export const petService = {
  // ── Unlock helpers ──

  getUnlockedPets(bestStreak: number): PetType[] {
    return PET_ORDER.filter((type) => PET_UNLOCK_THRESHOLDS[type] <= bestStreak);
  },

  isUnlocked(petType: PetType, bestStreak: number): boolean {
    return PET_UNLOCK_THRESHOLDS[petType] <= bestStreak;
  },

  getUnlockThreshold(petType: PetType): number {
    return PET_UNLOCK_THRESHOLDS[petType];
  },

  getPetOrder(): PetType[] {
    return [...PET_ORDER];
  },

  // ── Evolution helpers ──

  getStage(level: number): PetStage {
    if (level <= 1) return "egg";
    if (level <= 3) return "baby";
    if (level <= 5) return "child";
    if (level <= 7) return "teen";
    return "adult";
  },

  getPetEmoji(petType: PetType, level: number, revealedType: boolean): string {
    if (!revealedType) return "🥚";
    const stage = this.getStage(level);
    return PET_STAGE_EMOJIS[petType]?.[stage] ?? "🥚";
  },

  checkEvolution(
    oldLevel: number,
    newLevel: number
  ): PetStage | null {
    const oldStage = this.getStage(oldLevel);
    const newStage = this.getStage(newLevel);
    return oldStage !== newStage ? newStage : null;
  },

  // ── CRUD ──

  createPet(childId: string, slotIndex: number, name: string, unlockedPets: PetType[]): Pet {
    // Get existing pets to avoid duplicates
    const existingPets = petRepository.getByChildId(childId);
    const existingTypes = existingPets.map((p) => p.petType);

    // Pick a random type from unlocked ones that the child doesn't already have
    const availableTypes = unlockedPets.filter(
      (type) => !existingTypes.includes(type)
    );

    const randomType =
      availableTypes.length > 0
        ? availableTypes[Math.floor(Math.random() * availableTypes.length)]
        : unlockedPets[Math.floor(Math.random() * unlockedPets.length)];

    const pet: Pet = {
      id: crypto.randomUUID(),
      childId,
      petType: randomType,
      name,
      level: 1,
      happiness: 50,
      hunger: 50,
      slotIndex,
      feedCount: 0,
      revealedType: false, // starts as mystery egg
    };
    petRepository.save(pet);
    return pet;
  },

  getPet(childId: string, slotIndex: number): Pet | null {
    return petRepository.getByChildIdAndSlot(childId, slotIndex);
  },

  getPets(childId: string): Pet[] {
    return petRepository.getByChildId(childId);
  },

  feedPet(childId: string, slotIndex: number): FeedResult | null {
    const pet = petRepository.getByChildIdAndSlot(childId, slotIndex);
    if (!pet) return null;

    const oldLevel = pet.level;
    const updated: Pet = {
      ...pet,
      hunger: Math.min(100, pet.hunger + FEED_HUNGER_AMOUNT),
      happiness: Math.min(100, pet.happiness + 5),
      feedCount: pet.feedCount + 1,
    };

    // Level up every time hunger reaches 100
    if (updated.hunger === 100 && pet.hunger < 100) {
      updated.level = Math.min(10, updated.level + 1);
    }

    // Check for hatching (egg → baby)
    let hatched = false;
    let revealedType: PetType | undefined;
    if (!pet.revealedType && updated.feedCount >= HATCH_FEED_THRESHOLD) {
      updated.revealedType = true;
      updated.level = Math.max(updated.level, 2); // ensure at least baby stage
      hatched = true;
      revealedType = updated.petType;
    }

    // Check for evolution
    const newStage = this.checkEvolution(oldLevel, updated.level);
    const evolved = !!newStage && !hatched; // don't double-trigger on hatch

    petRepository.save(updated);
    return {
      pet: updated,
      hatched,
      evolved,
      newStage: newStage ?? undefined,
      revealedType,
    };
  },

  playWithPet(childId: string, slotIndex: number): Pet | null {
    const pet = petRepository.getByChildIdAndSlot(childId, slotIndex);
    if (!pet) return null;

    const updated: Pet = {
      ...pet,
      happiness: Math.min(100, pet.happiness + PLAY_HAPPINESS_AMOUNT),
    };

    petRepository.save(updated);
    return updated;
  },

  getFeedCost(): number {
    return FEED_COST;
  },

  getHatchThreshold(): number {
    return HATCH_FEED_THRESHOLD;
  },
};
