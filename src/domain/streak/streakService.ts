import { Dose } from "@/types";
import { rewardsRepository } from "@/data/repositories/rewardsRepository";
import { doseRepository } from "@/data/repositories/doseRepository";

export const streakService = {
  updateStreak(childId: string): { current: number; best: number } {
    const rewards = rewardsRepository.getByChildId(childId);
    const allDoses = doseRepository.getByChildId(childId);

    // Group doses by day
    const dosesByDay = new Map<string, Dose[]>();
    for (const dose of allDoses) {
      const day = dose.scheduledAt.split("T")[0];
      const existing = dosesByDay.get(day) || [];
      existing.push(dose);
      dosesByDay.set(day, existing);
    }

    // Sort days descending
    const days = Array.from(dosesByDay.keys()).sort().reverse();

    let streakCount = 0;
    for (const day of days) {
      const dayDoses = dosesByDay.get(day)!;
      const allCompleted = dayDoses.every(
        (d) => d.status === "completed" || d.status === "late"
      );
      if (allCompleted && dayDoses.length > 0) {
        streakCount++;
      } else {
        break;
      }
    }

    const updated = {
      ...rewards,
      streakCurrent: streakCount,
      streakBest: Math.max(rewards.streakBest, streakCount),
    };
    rewardsRepository.save(updated);

    return { current: updated.streakCurrent, best: updated.streakBest };
  },

  getStreak(childId: string): { current: number; best: number } {
    const rewards = rewardsRepository.getByChildId(childId);
    return {
      current: rewards.streakCurrent,
      best: rewards.streakBest,
    };
  },
};
