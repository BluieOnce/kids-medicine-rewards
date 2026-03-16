import { Pet, PetType } from "@/types";
import { petRepository } from "@/data/repositories/petRepository";

const FEED_COST = 5; // stars
const FEED_HUNGER_AMOUNT = 25;
const PLAY_HAPPINESS_AMOUNT = 20;

export const petService = {
  createPet(childId: string, petType: PetType, name: string): Pet {
    const pet: Pet = {
      childId,
      petType,
      name,
      level: 1,
      happiness: 50,
      hunger: 50,
    };
    petRepository.save(pet);
    return pet;
  },

  getPet(childId: string): Pet | null {
    return petRepository.getByChildId(childId);
  },

  feedPet(childId: string): Pet | null {
    const pet = petRepository.getByChildId(childId);
    if (!pet) return null;

    const updated: Pet = {
      ...pet,
      hunger: Math.min(100, pet.hunger + FEED_HUNGER_AMOUNT),
      happiness: Math.min(100, pet.happiness + 5),
    };

    // Level up every time hunger reaches 100
    if (updated.hunger === 100 && pet.hunger < 100) {
      updated.level = Math.min(10, updated.level + 1);
    }

    petRepository.save(updated);
    return updated;
  },

  playWithPet(childId: string): Pet | null {
    const pet = petRepository.getByChildId(childId);
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
};
