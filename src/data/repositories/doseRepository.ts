import { Dose } from "@/types";
import { getItem, setItem, StorageKeys } from "@/data/storage/localStorage";

export const doseRepository = {
  getAll(): Dose[] {
    return getItem<Dose>(StorageKeys.DOSES);
  },

  getByChildId(childId: string): Dose[] {
    return this.getAll().filter((d) => d.childId === childId);
  },

  getByMedicineId(medicineId: string): Dose[] {
    return this.getAll().filter((d) => d.medicineId === medicineId);
  },

  getById(id: string): Dose | undefined {
    return this.getAll().find((d) => d.id === id);
  },

  getTodayByChildId(childId: string): Dose[] {
    const today = new Date().toISOString().split("T")[0];
    return this.getByChildId(childId).filter((d) =>
      d.scheduledAt.startsWith(today)
    );
  },

  save(dose: Dose): void {
    const all = this.getAll();
    const idx = all.findIndex((d) => d.id === dose.id);
    if (idx >= 0) {
      all[idx] = dose;
    } else {
      all.push(dose);
    }
    setItem(StorageKeys.DOSES, all);
  },

  deleteByMedicineId(medicineId: string): void {
    const all = this.getAll().filter((d) => d.medicineId !== medicineId);
    setItem(StorageKeys.DOSES, all);
  },

  deleteByChildId(childId: string): void {
    const all = this.getAll().filter((d) => d.childId !== childId);
    setItem(StorageKeys.DOSES, all);
  },
};
