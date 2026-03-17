import { Dose } from "@/types";
import { doseRepository } from "@/data/repositories/doseRepository";
import { medicineRepository } from "@/data/repositories/medicineRepository";
import { rewardsRepository } from "@/data/repositories/rewardsRepository";

export interface ChildStats {
  totalDoses: number;
  completedDoses: number;
  skippedDoses: number;
  lateDoses: number;
  completionRate: number;
  totalStarsEarned: number;
  currentStreak: number;
  bestStreak: number;
}

export interface DoseHistoryEntry {
  dose: Dose;
  medicineName: string;
  date: string;
  time: string;
}

export const analyticsService = {
  getChildStats(childId: string): ChildStats {
    const doses = doseRepository.getByChildId(childId);
    const rewards = rewardsRepository.getByChildId(childId);

    const nonPending = doses.filter((d) => d.status !== "pending");
    const completed = nonPending.filter((d) => d.status === "completed");
    const skipped = nonPending.filter((d) => d.status === "skipped");
    const late = nonPending.filter((d) => d.status === "late");

    const totalDone = completed.length + late.length;
    const completionRate =
      nonPending.length > 0
        ? Math.round((totalDone / nonPending.length) * 100)
        : 0;

    return {
      totalDoses: nonPending.length,
      completedDoses: completed.length,
      skippedDoses: skipped.length,
      lateDoses: late.length,
      completionRate,
      totalStarsEarned: rewards.stars,
      currentStreak: rewards.streakCurrent,
      bestStreak: rewards.streakBest,
    };
  },

  getDoseHistory(childId: string, limit: number = 20): DoseHistoryEntry[] {
    const doses = doseRepository.getByChildId(childId);
    const medicines = medicineRepository.getAll();

    const nonPending = doses
      .filter((d) => d.status !== "pending")
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() -
          new Date(a.scheduledAt).getTime()
      )
      .slice(0, limit);

    return nonPending.map((dose) => {
      const med = medicines.find((m) => m.id === dose.medicineId);
      const dt = new Date(dose.scheduledAt);
      return {
        dose,
        medicineName: med?.name ?? "Unknown",
        date: dt.toLocaleDateString(),
        time: dt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  },

  getWeeklyCompletionRate(childId: string): number[] {
    const doses = doseRepository.getByChildId(childId);
    const rates: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split("T")[0];

      const dayDoses = doses.filter((d) => d.scheduledAt.startsWith(dayStr));
      const nonPending = dayDoses.filter((d) => d.status !== "pending");

      if (nonPending.length === 0) {
        rates.push(0);
      } else {
        const done = nonPending.filter(
          (d) => d.status === "completed" || d.status === "late"
        ).length;
        rates.push(Math.round((done / nonPending.length) * 100));
      }
    }

    return rates;
  },
};
