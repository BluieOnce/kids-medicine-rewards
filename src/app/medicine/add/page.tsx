"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useTranslation } from "@/i18n";

export default function AddMedicinePage() {
  return (
    <Suspense>
      <AddMedicineContent />
    </Suspense>
  );
}

function AddMedicineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childIdParam = searchParams.get("childId");
  const { t } = useTranslation();

  const { children, activeChildId, addMedicine, loadData } = useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const effectiveChildId = childIdParam || activeChildId;

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState<string[]>(["08:00"]);

  const addTime = () => {
    setTimes([...times, "12:00"]);
  };

  const updateTime = (index: number, value: string) => {
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
  };

  const removeTime = (index: number) => {
    if (times.length <= 1) return;
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim() || !dosage.trim() || !effectiveChildId) return;
    addMedicine(effectiveChildId, name.trim(), dosage.trim(), times);
    router.back();
  };

  return (
    <div className="pb-8">
      <PageHeader title={t("medicine.addTitle")} showBack />

      <div className="px-4 space-y-5 mt-4">
        {/* Select child if multiple */}
        {children.length > 1 && !childIdParam && (
          <Card>
            <p className="text-sm font-medium text-gray-500 mb-2">
              {t("medicine.forWhichChild")}
            </p>
            <div className="flex gap-2 flex-wrap">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() =>
                    useAppStore.getState().setActiveChild(child.id)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium
                    ${
                      child.id === effectiveChildId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {child.avatar} {child.name}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Medicine name */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            {t("medicine.medicineName")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("medicine.namePlaceholder")}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            {t("medicine.dosage")}
          </label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder={t("medicine.dosagePlaceholder")}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Schedule times */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            {t("medicine.scheduleTimes")}
          </label>
          <div className="space-y-2">
            {times.map((time, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => updateTime(i, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {times.length > 1 && (
                  <button
                    onClick={() => removeTime(i)}
                    className="text-red-400 text-xl px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addTime}
            className="mt-2 text-sm text-blue-500 font-medium"
          >
            {t("medicine.addAnotherTime")}
          </button>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!name.trim() || !dosage.trim() || !effectiveChildId}
        >
          {t("medicine.save")}
        </Button>
      </div>
    </div>
  );
}
