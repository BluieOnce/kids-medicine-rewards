"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

const steps = [
  { emoji: "💊", bgFrom: "from-blue-100", bgTo: "to-cyan-50" },
  { emoji: "⭐", bgFrom: "from-amber-100", bgTo: "to-yellow-50" },
  { emoji: "🐾", bgFrom: "from-purple-100", bgTo: "to-pink-50" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const titles = [
    t("onboarding.step1Title"),
    t("onboarding.step2Title"),
    t("onboarding.step3Title"),
  ];

  const descs = [
    t("onboarding.step1Desc"),
    t("onboarding.step2Desc"),
    t("onboarding.step3Desc"),
  ];

  const isLast = current === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push("/child/new");
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    router.push("/child/new");
  };

  const step = steps[current];

  return (
    <div
      className={`min-h-dvh flex flex-col items-center justify-between px-6 py-12 bg-gradient-to-b ${step.bgFrom} ${step.bgTo} transition-colors duration-500`}
    >
      {/* Skip button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="self-end"
      >
        <button
          onClick={handleSkip}
          className="text-gray-400 text-sm font-medium px-3 py-1"
        >
          {t("onboarding.skip")}
        </button>
      </motion.div>

      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* Animated emoji */}
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="text-[100px] mb-6 relative"
            >
              {/* Soft glow behind emoji */}
              <div className="absolute inset-0 blur-3xl bg-white/50 rounded-full scale-125" />
              <span className="relative">{step.emoji}</span>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {titles[current]}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              {descs[current]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="w-full max-w-xs flex flex-col items-center gap-5">
        {/* Dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? "#3b82f6" : "#d1d5db",
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* Next / Let's Go button */}
        <Button onClick={handleNext} size="lg" className="w-full">
          {isLast ? t("onboarding.letsGo") : t("onboarding.next")}
        </Button>
      </div>
    </div>
  );
}
