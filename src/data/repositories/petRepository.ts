import { Pet } from "@/types";
import { getItem, setItem, StorageKeys } from "@/data/storage/localStorage";

// Lazy migration: old pets without id/slotIndex/feedCount/revealedType
function migratePet(raw: Record<string, unknown>): Pet {
  return {
    id: (raw.id as string) || crypto.randomUUID(),
    childId: raw.childId as string,
    petType: raw.petType as Pet["petType"],
    name: raw.name as string,
    level: (raw.level as number) ?? 1,
    happiness: (raw.happiness as number) ?? 50,
    hunger: (raw.hunger as number) ?? 50,
    slotIndex: (raw.slotIndex as number) ?? 0,
    feedCount: (raw.feedCount as number) ?? 0,
    revealedType: (raw.revealedType as boolean) ?? true, // existing pets are revealed
  };
}

export const petRepository = {
  getAll(): Pet[] {
    const raw = getItem<Record<string, unknown>>(StorageKeys.PET);
    return raw.map(migratePet);
  },

  getByChildId(childId: string): Pet[] {
    return this.getAll().filter((p) => p.childId === childId);
  },

  getByChildIdAndSlot(childId: string, slotIndex: number): Pet | null {
    return (
      this.getAll().find(
        (p) => p.childId === childId && p.slotIndex === slotIndex
      ) ?? null
    );
  },

  save(pet: Pet): void {
    const all = this.getAll();
    const idx = all.findIndex(
      (p) => p.childId === pet.childId && p.slotIndex === pet.slotIndex
    );
    if (idx >= 0) {
      all[idx] = pet;
    } else {
      all.push(pet);
    }
    setItem(StorageKeys.PET, all);
  },

  deleteByChildId(childId: string): void {
    const all = this.getAll().filter((p) => p.childId !== childId);
    setItem(StorageKeys.PET, all);
  },

  deleteByChildIdAndSlot(childId: string, slotIndex: number): void {
    const all = this.getAll().filter(
      (p) => !(p.childId === childId && p.slotIndex === slotIndex)
    );
    setItem(StorageKeys.PET, all);
  },
};
