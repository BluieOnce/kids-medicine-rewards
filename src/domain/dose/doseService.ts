import { v4 as uuidv4 } from "uuid";
import { Dose, DoseStatus, Medicine } from "@/types";
import { doseRepository } from "@/data/repositories/doseRepository";

const LATE_THRESHOLD_MINUTES = 30;

export const doseService = {
  createDoseForToday(medicine: Medicine, scheduleTime: string): Dose {
    const today = new Date().toISOString().split("T")[0];
    const scheduledAt = new Date(`${today}T${scheduleTime}:00`).toISOString();

    const dose: Dose = {
      id: uuidv4(),
      medicineId: medicine.id,
      childId: medicine.childId,
      scheduledAt,
      status: "pending",
      completedAt: null,
      rewardGranted: false,
    };

    doseRepository.save(dose);
    return dose;
  },

  generateTodayDoses(medicines: Medicine[]): Dose[] {
    const today = new Date().toISOString().split("T")[0];
    const existingDoses = doseRepository.getAll();
    const newDoses: Dose[] = [];

    for (const med of medicines) {
      if (!med.active) continue;
      for (const time of med.scheduleTimes) {
        const scheduledAt = new Date(
          `${today}T${time}:00`
        ).toISOString();
        const exists = existingDoses.some(
          (d) =>
            d.medicineId === med.id &&
            d.scheduledAt === scheduledAt
        );
        if (!exists) {
          const dose = this.createDoseForToday(med, time);
          newDoses.push(dose);
        }
      }
    }
    return newDoses;
  },

  completeDose(doseId: string): Dose | null {
    const dose = doseRepository.getById(doseId);
    if (!dose || dose.status !== "pending") return null;

    const now = new Date();
    const scheduled = new Date(dose.scheduledAt);
    const diffMinutes =
      (now.getTime() - scheduled.getTime()) / (1000 * 60);

    const status: DoseStatus =
      diffMinutes > LATE_THRESHOLD_MINUTES ? "late" : "completed";

    const updated: Dose = {
      ...dose,
      status,
      completedAt: now.toISOString(),
      rewardGranted: true,
    };

    doseRepository.save(updated);
    return updated;
  },

  skipDose(doseId: string): Dose | null {
    const dose = doseRepository.getById(doseId);
    if (!dose || dose.status !== "pending") return null;

    const updated: Dose = {
      ...dose,
      status: "skipped",
      completedAt: new Date().toISOString(),
      rewardGranted: false,
    };

    doseRepository.save(updated);
    return updated;
  },

  getTodayProgress(childId: string): {
    total: number;
    completed: number;
    pending: number;
    skipped: number;
  } {
    const doses = doseRepository.getTodayByChildId(childId);
    return {
      total: doses.length,
      completed: doses.filter(
        (d) => d.status === "completed" || d.status === "late"
      ).length,
      pending: doses.filter((d) => d.status === "pending").length,
      skipped: doses.filter((d) => d.status === "skipped").length,
    };
  },
};
