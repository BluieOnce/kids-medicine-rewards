"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

interface Star {
  id: number;
  x: number;
  y: number;
}

export default function CountingStars() {
  const { t } = useTranslation();
  const [stars, setStars] = useState<Star[]>([]);
  const [count, setCount] = useState(0);
  const [nextId, setNextId] = useState(0);
  const [running, setRunning] = useState(false);

  const spawnStar = useCallback(() => {
    const x = 10 + Math.random() * 70; // percentage
    const y = 10 + Math.random() * 60;
    setStars((prev) => [...prev, { id: nextId, x, y }]);
    setNextId((prev) => prev + 1);
  }, [nextId]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(spawnStar, 1500);
    return () => clearInterval(timer);
  }, [running, spawnStar]);

  const handleTapStar = (id: number) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
    setCount((c) => c + 1);
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] px-6 relative">
      {/* Counter */}
      <div className="text-center mt-4 mb-4">
        <p className="text-4xl font-bold text-amber-500">{count}</p>
        <p className="text-sm text-gray-400">{t("counting.starsCaught")}</p>
      </div>

      {/* Star field */}
      <div className="relative w-full h-[50vh] bg-gradient-to-b from-indigo-900 to-purple-900 rounded-3xl overflow-hidden">
        <AnimatePresence>
          {stars.map((star) => (
            <motion.button
              key={star.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleTapStar(star.id)}
              style={{
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
              className="text-3xl cursor-pointer"
            >
              ⭐
            </motion.button>
          ))}
        </AnimatePresence>

        {!running && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => {
                setRunning(true);
                setCount(0);
                setStars([]);
              }}
              className="px-8 py-3 bg-amber-400 rounded-full text-white font-bold text-lg shadow-lg"
            >
              {t("counting.start")}
            </button>
          </div>
        )}
      </div>

      {running && (
        <button
          onClick={() => setRunning(false)}
          className="mt-4 text-sm text-gray-400"
        >
          {t("counting.stop")}
        </button>
      )}

      <p className="text-gray-400 text-xs mt-4 text-center max-w-xs">
        {t("counting.helpText")}
      </p>
    </div>
  );
}
