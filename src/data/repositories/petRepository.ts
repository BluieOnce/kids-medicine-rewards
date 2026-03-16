import { Pet } from "@/types";
import { getItem, setItem, StorageKeys } from "@/data/storage/localStorage";

export const petRepository = {
  getAll(): Pet[] {
    return getItem<Pet>(StorageKeys.PET);
  },

  getByChildId(childId: string): Pet | null {
    return this.getAll().find((p) => p.childId === childId) ?? null;
  },

  save(pet: Pet): void {
    const all = this.getAll();
    const idx = all.findIndex((p) => p.childId === pet.childId);
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
};
