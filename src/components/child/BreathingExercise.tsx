"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const phases: { phase: Phase; duration: number; label: string }[] = [
  { phase: "inhale", duration: 4000, label: "Breathe in..." },
  { phase: "hold", duration: 2000, label: "Hold..." },
  { phase: "exhale", duration: 4000, label: "Breathe out..." },
  { phase: "rest", duration: 1000, label: "..." },
];

export default function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);

  const currentPhase = phases[phaseIdx];

  const advancePhase = useCallback(() => {
    setPhaseIdx((prev) => {
      const next = (prev + 1) % phases.length;
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
          {running ? currentPhase.label : "Tap to start"}
        </span>
      </motion.div>

      {/* Cycle counter */}
      {cycles > 0 && (
        <p className="text-gray-400 text-sm mb-4">
          {cycles} breath{cycles !== 1 ? "s" : ""} completed
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
        {running ? "Stop" : "Start Breathing"}
      </button>

      <p className="text-gray-400 text-xs mt-6 text-center max-w-xs">
        Take slow, deep breaths with the bubble.
        This helps your body feel calm and ready.
      </p>
    </div>
  );
}
