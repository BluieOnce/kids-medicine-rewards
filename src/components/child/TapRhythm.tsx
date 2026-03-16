"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const PATTERN = [1, 0, 1, 0, 1, 1, 0, 1]; // 1 = tap, 0 = rest
const BEAT_MS = 500;

export default function TapRhythm() {
  const [running, setRunning] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [score, setScore] = useState(0);

  const advanceBeat = useCallback(() => {
    setBeatIndex((prev) => (prev + 1) % PATTERN.length);
    setTapped(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(advanceBeat, BEAT_MS);
    return () => clearInterval(timer);
  }, [running, advanceBeat]);

  const handleTap = () => {
    if (!running) {
      setRunning(true);
      setScore(0);
      setBeatIndex(0);
      return;
    }

    if (tapped) return;
    setTapped(true);

    if (PATTERN[beatIndex] === 1) {
      setScore((s) => s + 1);
    }
  };

  const currentShouldTap = PATTERN[beatIndex] === 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      {/* Pattern display */}
      <div className="flex gap-2 mb-8">
        {PATTERN.map((beat, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === beatIndex && running ? 1.3 : 1,
              opacity: i === beatIndex && running ? 1 : 0.4,
            }}
            className={`w-8 h-8 rounded-full ${
              beat === 1 ? "bg-blue-400" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Tap target */}
      <motion.button
        onTouchStart={handleTap}
        onClick={handleTap}
        whileTap={{ scale: 0.9 }}
        animate={{
          backgroundColor:
            running && currentShouldTap
              ? "#3b82f6"
              : running
                ? "#e5e7eb"
                : "#3b82f6",
        }}
        className="w-40 h-40 rounded-full flex items-center justify-center
          text-white text-xl font-bold shadow-lg mb-6"
      >
        {running ? (currentShouldTap ? "TAP!" : "wait") : "Start"}
      </motion.button>

      {/* Score */}
      <p className="text-2xl font-bold text-gray-700">
        Score: {score}
      </p>

      {running && (
        <button
          onClick={() => setRunning(false)}
          className="mt-4 text-sm text-gray-400"
        >
          Stop
        </button>
      )}

      <p className="text-gray-400 text-xs mt-6 text-center max-w-xs">
        Follow the pattern! Tap when the blue circles light up.
        Focusing on rhythm helps distract from worry.
      </p>
    </div>
  );
}
