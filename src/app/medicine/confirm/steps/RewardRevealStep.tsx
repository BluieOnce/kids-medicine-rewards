"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

interface RewardRevealStepProps {
  stars: number;
  streak: { current: number; best: number };
  dailyBonus: boolean;
  petEmoji: string | null;
  onContinue: () => void;
}

export default function RewardRevealStep({
  stars,
  streak,
  dailyBonus,
  petEmoji,
  onContinue,
}: RewardRevealStepProps) {
  const { t } = useTranslation();
  const [displayedStars, setDisplayedStars] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [showPet, setShowPet] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    // Star count-up animation
    const duration = 800;
    const steps = 20;
    const increment = stars / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= stars) {
        setDisplayedStars(stars);
        clearInterval(interval);
      } else {
        setDisplayedStars(Math.round(current));
      }
    }, duration / steps);

    // Staggered reveals
    const streakTimer = setTimeout(() => setShowStreak(true), 1000);
    const bonusTimer = setTimeout(() => setShowBonus(true), 1500);
    const petTimer = setTimeout(() => setShowPet(true), 1800);
    const continueTimer = setTimeout(() => setCanContinue(true), 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(streakTimer);
      clearTimeout(bonusTimer);
      clearTimeout(petTimer);
      clearTimeout(continueTimer);
    };
  }, [stars]);

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-yellow-50 to-amber-50 relative overflow-hidden"
      onClick={() => canContinue && onContinue()}
    >
      {/* Floating stars animation */}
      <AnimatePresence>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{
              opacity: 1,
              x: (Math.random() - 0.5) * 300,
              y: 100,
            }}
            animate={{
              opacity: 0,
              y: -300 - Math.random() * 150,
            }}
            transition={{
              duration: 2,
              delay: 0.1 + i * 0.12,
            }}
            className="absolute text-2xl pointer-events-none"
          >
            ⭐
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Star burst */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-7xl mb-4"
      >
        🌟
      </motion.div>

      {/* Star count */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-amber-600 mb-6"
      >
        {t("wizard.starsEarned", { stars: displayedStars })}
      </motion.div>

      {/* Streak */}
      {showStreak && streak.current > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-orange-500 font-semibold mb-3"
        >
          🔥 {t("wizard.streakUpdate", { days: streak.current })}
        </motion.div>
      )}

      {/* Daily bonus */}
      {showBonus && dailyBonus && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="text-lg text-purple-500 font-semibold mb-3"
        >
          🎁 {t("wizard.dailyBonusEarned")} ⭐
        </motion.div>
      )}

      {/* Pet reaction */}
      {showPet && petEmoji && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-6"
        >
          {petEmoji}
        </motion.div>
      )}

      {/* Tap to continue */}
      {canContinue && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-gray-400 mt-6"
        >
          {t("wizard.tapToContinue")}
        </motion.p>
      )}
    </div>
  );
}
