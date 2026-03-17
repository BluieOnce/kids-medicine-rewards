"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/i18n";
import MedicineWizard from "./MedicineWizard";

export default function ConfirmDosePage() {
  return (
    <Suspense>
      <ConfirmDoseContent />
    </Suspense>
  );
}

function ConfirmDoseContent() {
  const searchParams = useSearchParams();
  const doseId = searchParams.get("doseId");
  const { t } = useTranslation();

  const { doses, medicines, children, loadData, isLoaded } = useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">{t("dashboard.loading")}</p>
      </div>
    );
  }

  const dose = doses.find((d) => d.id === doseId);
  const medicine = dose ? medicines.find((m) => m.id === dose.medicineId) : null;
  const child = dose ? children.find((c) => c.id === dose.childId) : null;

  if (!dose || !medicine || !child) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">{t("medicine.doseNotFound")}</p>
      </div>
    );
  }

  return <MedicineWizard dose={dose} medicine={medicine} child={child} />;
}
