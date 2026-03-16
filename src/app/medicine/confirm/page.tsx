"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

export default function ConfirmDosePage() {
  return (
    <Suspense>
      <ConfirmDoseContent />
    </Suspense>
  );
}

function ConfirmDoseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doseId = searchParams.get("doseId");
  const { t } = useTranslation();

  const { doses, medicines, completeDose, skipDose, loadData } = useAppStore();
  const [showReward, setShowReward] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dose = doses.find((d) => d.id === doseId);
  const medicine = dose
    ? medicines.find((m) => m.id === dose.medicineId)
    : null;

  if (!dose || !medicine) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">{t("medicine.doseNotFound")}</p>
      </div>
    );
  }

  const handleComplete = () => {
    const result = completeDose(dose.id);
    if (result) {
      setEarnedStars(result.stars);
      setShowReward(true);
    }
  };

  const handleSkip = () => {
    skipDose(dose.id);
    router.back();
  };

  if (showReward) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-yellow-50 to-amber-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="text-8xl mb-4"
        >
          🌟
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-amber-600 mb-2"
        >
          {t("medicine.amazing")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-600 mb-2"
        >
          {t("medicine.earnedStars", { stars: earnedStars })}
        </motion.p>

        {/* Floating stars animation */}
        <AnimatePresence>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{
                opacity: 1,
                x: (Math.random() - 0.5) * 200,
                y: 0,
              }}
              animate={{
                opacity: 0,
                y: -200 - Math.random() * 100,
              }}
              transition={{
                duration: 1.5,
                delay: 0.2 + i * 0.1,
              }}
              className="absolute text-3xl"
            >
              ⭐
            </motion.span>
          ))}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 space-y-3 w-full"
        >
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push("/reward")}
          >
            {t("medicine.seeRewards")}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            {t("medicine.backHome")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
        className="text-7xl mb-6"
      >
        💊
      </motion.div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {t("medicine.timeForMedicine")}
      </h1>

      <p className="text-lg text-gray-500 mb-1">{medicine.name}</p>
      <p className="text-gray-400 mb-8">{medicine.dosage}</p>

      <div className="space-y-3 w-full">
        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push("/calm-tools")}
          variant="secondary"
        >
          {t("medicine.needCalm")}
        </Button>

        <Button className="w-full" size="lg" onClick={handleComplete}>
          {t("medicine.iTookIt")}
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          onClick={handleSkip}
        >
          {t("medicine.skip")}
        </Button>
      </div>
    </div>
  );
}
