import { Dose, Rewards } from "@/types";
import { rewardsRepository } from "@/data/repositories/rewardsRepository";

const STARS_ON_TIME = 10;
const STARS_LATE = 5;
const STARS_SKIPPED = 0;
const DAILY_BONUS = 10;

export const rewardService = {
  calculateStarsForDose(dose: Dose): number {
    switch (dose.status) {
      case "completed":
        return STARS_ON_TIME;
      case "late":
        return STARS_LATE;
      case "skipped":
        return STARS_SKIPPED;
      default:
        return 0;
    }
  },

  grantDoseReward(childId: string, dose: Dose): number {
    const stars = this.calculateStarsForDose(dose);
    if (stars === 0) return 0;

    const rewards = rewardsRepository.getByChildId(childId);
    const updated: Rewards = {
      ...rewards,
      stars: rewards.stars + stars,
    };
    rewardsRepository.save(updated);
    return stars;
  },

  grantDailyBonus(childId: string): number {
    const rewards = rewardsRepository.getByChildId(childId);
    const updated: Rewards = {
      ...rewards,
      stars: rewards.stars + DAILY_BONUS,
    };
    rewardsRepository.save(updated);
    return DAILY_BONUS;
  },

  spendStars(childId: string, amount: number): boolean {
    const rewards = rewardsRepository.getByChildId(childId);
    if (rewards.stars < amount) return false;

    const updated: Rewards = {
      ...rewards,
      stars: rewards.stars - amount,
    };
    rewardsRepository.save(updated);
    return true;
  },

  getRewards(childId: string): Rewards {
    return rewardsRepository.getByChildId(childId);
  },
};
