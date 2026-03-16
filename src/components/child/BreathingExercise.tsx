"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";

type Phase = "inhale" | "hold" | "exhale" | "rest";

export default function BreathingExercise() {
  const { t } = useTranslation();
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);

  const phases: { phase: Phase; duration: number; label: string }[] = [
    { phase: "inhale", duration: 4000, label: t("breathing.breatheIn") },
    { phase: "hold", duration: 2000, label: t("breathing.hold") },
    { phase: "exhale", duration: 4000, label: t("breathing.breatheOut") },
    { phase: "rest", duration: 1000, label: "..." },
  ];

  const currentPhase = phases[phaseIdx];

  const advancePhase = useCallback(() => {
    setPhaseIdx((prev) => {
      const next = (prev + 1) % 4;
      if (next === 0) setCycles((c) => c + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(advancePhase, currentPhase.duration);
    return () => clearTimeout(timer);
  }, [running, phaseIdx, currentPhase.duration, advancePhase]);

  const bubbleScale =
    currentPhase.phase === "inhale" || currentPhase.phase === "hold"
      ? 1.4
      : 0.6;

  const bubbleColor =
    currentPhase.phase === "inhale"
      ? "from-sky-300 to-blue-400"
      : currentPhase.phase === "hold"
        ? "from-blue-400 to-indigo-400"
        : "from-indigo-300 to-sky-300";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      {/* Breathing circle */}
      <motion.div
        animate={{
          scale: running ? bubbleScale : 0.8,
        }}
        transition={{
          duration: currentPhase.duration / 1000,
          ease: "easeInOut",
        }}
        className={`w-48 h-48 rounded-full bg-gradient-to-br ${bubbleColor}
          shadow-lg flex items-center justify-center mb-8`}
      >
        <span className="text-white text-xl font-medium text-center">
          {running ? currentPhase.label : t("breathing.tapToStart")}
        </span>
      </motion.div>

      {/* Cycle counter */}
      {cycles > 0 && (
        <p className="text-gray-400 text-sm mb-4">
          {cycles !== 1
            ? t("breathing.breathsCompletedPlural", { count: cycles })
            : t("breathing.breathsCompleted", { count: cycles })}
        </p>
      )}

      {/* Start/Stop button */}
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            setPhaseIdx(0);
          }
        }}
        className={`px-8 py-3 rounded-full font-semibold text-lg transition-colors
          ${
            running
              ? "bg-gray-200 text-gray-600"
              : "bg-blue-500 text-white"
          }`}
      >
        {running ? t("breathing.stop") : t("breathing.startBreathing")}
      </button>

      <p className="text-gray-400 text-xs mt-6 text-center max-w-xs">
        {t("breathing.helpText")}
      </p>
    </div>
  );
}
