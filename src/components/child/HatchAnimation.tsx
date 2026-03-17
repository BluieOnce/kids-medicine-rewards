"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PetType } from "@/types";
import { petService } from "@/domain/pet/petService";
import { useTranslation } from "@/i18n";

interface HatchAnimationProps {
  show: boolean;
  petType: PetType;
  onComplete: () => void;
}

export default function HatchAnimation({
  show,
  petType,
  onComplete,
}: HatchAnimationProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<"wobble" | "crack" | "reveal">("wobble");
  const babyEmoji = petService.getPetEmoji(petType, 2, true);

  useEffect(() => {
    if (!show) {
      setPhase("wobble");
      return;
    }
    const t1 = setTimeout(() => setPhase("crack"), 1200);
    const t2 = setTimeout(() => setPhase("reveal"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => phase === "reveal" && onComplete()}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          {/* Egg wobble phase */}
          {phase === "wobble" && (
            <motion.div
              animate={{
                rotate: [0, -15, 15, -15, 15, -10, 10, 0],
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="text-9xl"
            >
              🥚
            </motion.div>
          )}

          {/* Crack phase */}
          {phase === "crack" && (
            <motion.div
              animate={{
                scale: [1, 1.1, 0.9, 1.2, 0.8],
                rotate: [0, -5, 5, -3, 3],
              }}
              transition={{ duration: 1 }}
              className="text-9xl relative"
            >
              🪺
              {/* Crack particles */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: 0,
                    scale: 0.5,
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2 text-lg"
                >
                  💫
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Reveal phase */}
          {phase === "reveal" && (
            <>
              {/* Burst sparkles */}
              {[...Array(16)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos((i * 22.5 * Math.PI) / 180) * 130,
                    y: Math.sin((i * 22.5 * Math.PI) / 180) * 130,
                  }}
                  transition={{ duration: 1.2, delay: i * 0.05 }}
                  className="absolute text-2xl"
                >
                  {i % 2 === 0 ? "✨" : "⭐"}
                </motion.span>
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.5, 1.2], rotate: [-30, 15, 0] }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="text-9xl mb-6"
              >
                {babyEmoji}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white mb-2">
                  {t("pet.hatched", { type: t(`pet.${petType}`) })}
                </p>
                <p className="text-lg text-amber-300">
                  {t("pet.stage.baby")}
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-12 text-white text-sm"
              >
                {t("pet.tapToDismiss")}
              </motion.p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
