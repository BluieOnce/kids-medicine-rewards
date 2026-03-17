"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { useTranslation } from "@/i18n";

interface PostRewardStepProps {
  hasPet: boolean;
  hasEnoughStars: boolean;
  onFeedPet: () => void;
  onPlayGame: () => void;
  onDone: () => void;
}

export default function PostRewardStep({
  hasPet,
  hasEnoughStars,
  onFeedPet,
  onPlayGame,
  onDone,
}: PostRewardStepProps) {
  const { t } = useTranslation();

  const options = [
    ...(hasPet && hasEnoughStars
      ? [{ emoji: "🍎", label: t("wizard.feedPet"), action: onFeedPet }]
      : []),
    { emoji: "🎮", label: t("wizard.playGame"), action: onPlayGame },
    { emoji: "✅", label: t("wizard.allDone"), action: onDone },
  ];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-6">🎊</div>

      <div className="space-y-4 w-full">
        {options.map((opt, i) => (
          <motion.div
            key={opt.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <Card onClick={opt.action} className="py-6">
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">{opt.emoji}</span>
                <span className="text-lg font-semibold">{opt.label}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
