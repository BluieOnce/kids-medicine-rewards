"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

interface ChildSuccessStepProps {
  petEmoji: string | null;
  onClaim: () => void;
}

export default function ChildSuccessStep({
  petEmoji,
  onClaim,
}: ChildSuccessStepProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-green-50 to-emerald-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="text-8xl mb-2"
      >
        {petEmoji || "🎉"}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-emerald-600 mb-1"
      >
        {t("wizard.youDidIt")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-500 mb-10"
      >
        {t("wizard.braveHero")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="w-full"
      >
        <Button className="w-full" size="lg" onClick={onClaim}>
          ⭐ {t("wizard.claimStars")}
        </Button>
      </motion.div>
    </div>
  );
}
