import { Child } from "@/types";
import { getItem, setItem, StorageKeys } from "@/data/storage/localStorage";

export const childRepository = {
  getAll(): Child[] {
    return getItem<Child>(StorageKeys.CHILDREN);
  },

  getById(id: string): Child | undefined {
    return this.getAll().find((c) => c.id === id);
  },

  save(child: Child): void {
    const all = this.getAll();
    const idx = all.findIndex((c) => c.id === child.id);
    if (idx >= 0) {
      all[idx] = child;
    } else {
      all.push(child);
    }
    setItem(StorageKeys.CHILDREN, all);
  },

  delete(id: string): void {
    const all = this.getAll().filter((c) => c.id !== id);
    setItem(StorageKeys.CHILDREN, all);
  },
};
