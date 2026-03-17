"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PetStage } from "@/types";
import { useTranslation } from "@/i18n";

interface EvolutionAnimationProps {
  show: boolean;
  petEmoji: string;
  newStage: PetStage;
  onComplete: () => void;
}

export default function EvolutionAnimation({
  show,
  petEmoji,
  newStage,
  onComplete,
}: EvolutionAnimationProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          {/* Sparkles */}
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                y: Math.sin((i * 30 * Math.PI) / 180) * 120,
              }}
              transition={{ duration: 1.5, delay: 0.2 + i * 0.08 }}
              className="absolute text-2xl"
            >
              ✨
            </motion.span>
          ))}

          {/* Pet emoji growing */}
          <motion.div
            initial={{ scale: 0.3, rotate: -10 }}
            animate={{
              scale: [0.3, 1.4, 1.2],
              rotate: [-10, 10, 0],
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-9xl mb-6"
          >
            {petEmoji}
          </motion.div>

          {/* Evolution text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-white mb-2">
              {t("pet.evolved")}
            </p>
            <p className="text-xl text-amber-300">
              {t(`pet.stage.${newStage}`)}
            </p>
          </motion.div>

          {/* Tap to dismiss hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12 text-white text-sm"
          >
            {t("pet.tapToDismiss")}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
