import { Rewards } from "@/types";
import { getItem, setItem, StorageKeys } from "@/data/storage/localStorage";

export const rewardsRepository = {
  getAll(): Rewards[] {
    return getItem<Rewards>(StorageKeys.REWARDS);
  },

  getByChildId(childId: string): Rewards {
    const all = this.getAll();
    const existing = all.find((r) => r.childId === childId);
    if (existing) return existing;
    // Return default rewards if none exist
    return {
      childId,
      stars: 0,
      streakCurrent: 0,
      streakBest: 0,
    };
  },

  save(rewards: Rewards): void {
    const all = this.getAll();
    const idx = all.findIndex((r) => r.childId === rewards.childId);
    if (idx >= 0) {
      all[idx] = rewards;
    } else {
      all.push(rewards);
    }
    setItem(StorageKeys.REWARDS, all);
  },

  deleteByChildId(childId: string): void {
    const all = this.getAll().filter((r) => r.childId !== childId);
    setItem(StorageKeys.REWARDS, all);
  },
};
