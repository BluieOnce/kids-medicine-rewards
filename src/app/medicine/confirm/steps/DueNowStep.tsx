"use client";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

interface DueNowStepProps {
  childName: string;
  childAvatar: string;
  medicineName: string;
  medicineDosage: string;
  urgency: "overdue" | "due-now" | "upcoming";
  onStart: () => void;
  onSkip: () => void;
}

const urgencyConfig = {
  overdue: { emoji: "🚨", bg: "bg-red-50", border: "border-red-200", key: "dashboard.overdue" as const },
  "due-now": { emoji: "💊", bg: "bg-amber-50", border: "border-amber-200", key: "dashboard.dueNow" as const },
  upcoming: { emoji: "🕐", bg: "bg-blue-50", border: "border-blue-200", key: "dashboard.upcoming" as const },
};

export default function DueNowStep({
  childName,
  childAvatar,
  medicineName,
  medicineDosage,
  urgency,
  onStart,
  onSkip,
}: DueNowStepProps) {
  const { t } = useTranslation();
  const config = urgencyConfig[urgency];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">{childAvatar}</div>

      <h1 className="text-xl font-bold text-gray-800 mb-1">
        {t("wizard.medicineFor", { name: childName })}
      </h1>

      <div
        className={`w-full rounded-2xl p-6 mb-8 mt-4 border ${config.bg} ${config.border}`}
      >
        <div className="text-4xl mb-3">{config.emoji}</div>
        <p className="text-lg font-semibold text-gray-800">{medicineName}</p>
        <p className="text-sm text-gray-500">{medicineDosage}</p>
        <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-white/60">
          {t(config.key)}
        </span>
      </div>

      <div className="space-y-3 w-full">
        <Button className="w-full" size="lg" onClick={onStart}>
          {t("wizard.startMedicineTime")}
        </Button>

        <Button variant="ghost" className="w-full" onClick={onSkip}>
          {t("wizard.skipForNow")}
        </Button>
      </div>
    </div>
  );
}
