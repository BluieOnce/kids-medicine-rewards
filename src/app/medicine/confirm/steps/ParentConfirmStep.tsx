"use client";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

interface ParentConfirmStepProps {
  childName: string;
  medicineName: string;
  onConfirm: () => void;
  onSkip: () => void;
}

export default function ParentConfirmStep({
  childName,
  medicineName,
  onConfirm,
  onSkip,
}: ParentConfirmStepProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6">💊</div>

      <h1 className="text-xl font-bold text-gray-800 mb-8">
        {t("wizard.didChildTake", { name: childName, medicine: medicineName })}
      </h1>

      <div className="space-y-3 w-full">
        <Button className="w-full" size="lg" onClick={onConfirm}>
          {t("wizard.medicineGiven")} ✓
        </Button>

        <Button variant="ghost" className="w-full" onClick={onSkip}>
          {t("wizard.skipped")}
        </Button>
      </div>
    </div>
  );
}
