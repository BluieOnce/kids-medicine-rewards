import { Medicine } from "@/types";
import { getItem, setItem, StorageKeys } from "@/data/storage/localStorage";

export const medicineRepository = {
  getAll(): Medicine[] {
    return getItem<Medicine>(StorageKeys.MEDICINES);
  },

  getByChildId(childId: string): Medicine[] {
    return this.getAll().filter((m) => m.childId === childId);
  },

  getById(id: string): Medicine | undefined {
    return this.getAll().find((m) => m.id === id);
  },

  save(medicine: Medicine): void {
    const all = this.getAll();
    const idx = all.findIndex((m) => m.id === medicine.id);
    if (idx >= 0) {
      all[idx] = medicine;
    } else {
      all.push(medicine);
    }
    setItem(StorageKeys.MEDICINES, all);
  },

  delete(id: string): void {
    const all = this.getAll().filter((m) => m.id !== id);
    setItem(StorageKeys.MEDICINES, all);
  },

  deleteByChildId(childId: string): void {
    const all = this.getAll().filter((m) => m.childId !== childId);
    setItem(StorageKeys.MEDICINES, all);
  },
};
