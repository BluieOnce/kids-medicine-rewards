"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { PetType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import StarDisplay from "@/components/ui/StarDisplay";
import { useTranslation } from "@/i18n";

const petEmojis: Record<PetType, string> = {
  cat: "🐱",
  dog: "🐶",
  bunny: "🐰",
  dragon: "🐲",
};

export default function PetPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    activeChildId,
    loadData,
    getPet,
    createPet,
    feedPet,
    playWithPet,
    getRewards,
  } = useAppStore();

  const [feedAnim, setFeedAnim] = useState(false);
  const [playAnim, setPlayAnim] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const petOptions: { type: PetType; labelKey: string }[] = [
    { type: "cat", labelKey: "pet.cat" },
    { type: "dog", labelKey: "pet.dog" },
    { type: "bunny", labelKey: "pet.bunny" },
    { type: "dragon", labelKey: "pet.dragon" },
  ];

  const pet = activeChildId ? getPet(activeChildId) : null;
  const rewards = activeChildId ? getRewards(activeChildId) : null;

  // Pet creation screen
  if (activeChildId && !pet) {
    return (
      <div className="pb-8">
        <PageHeader title={t("pet.chooseTitle")} showBack />
        <div className="px-4 space-y-4 mt-4">
          <p className="text-gray-500 text-center">
            {t("pet.pickInstruction")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {petOptions.map((opt) => (
              <Card
                key={opt.type}
                onClick={() => {
                  const label = t(opt.labelKey);
                  const name = prompt(t("pet.namePrompt", { type: label })) || label;
                  createPet(activeChildId, opt.type, name);
                }}
                className="text-center py-6"
              >
                <span className="text-6xl">{petEmojis[opt.type]}</span>
                <p className="mt-2 font-medium">{t(opt.labelKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!pet || !activeChildId) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">{t("reward.selectChild")}</p>
      </div>
    );
  }

  const canFeed = (rewards?.stars || 0) >= 5;

  const handleFeed = () => {
    if (!canFeed) return;
    feedPet(activeChildId);
    setFeedAnim(true);
    setTimeout(() => setFeedAnim(false), 1000);
  };

  const handlePlay = () => {
    playWithPet(activeChildId);
    setPlayAnim(true);
    setTimeout(() => setPlayAnim(false), 1000);
  };

  // Re-read after actions
  const currentPet = getPet(activeChildId);
  const currentRewards = getRewards(activeChildId);

  const petTypeKey = `pet.${pet.petType}` as const;

  return (
    <div className="pb-8">
      <PageHeader
        title={pet.name}
        showBack
        rightElement={
          <StarDisplay count={currentRewards?.stars || 0} size="sm" />
        }
      />

      <div className="px-4 space-y-4 mt-4">
        {/* Pet display */}
        <Card className="text-center py-8 relative overflow-hidden">
          <motion.div
            animate={
              feedAnim
                ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }
                : playAnim
                  ? { y: [0, -20, 0, -15, 0] }
                  : {}
            }
            transition={{ duration: 0.6 }}
            className="text-8xl mb-2"
          >
            {petEmojis[currentPet?.petType || pet.petType]}
          </motion.div>

          <AnimatePresence>
            {feedAnim && (
              <motion.span
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -60 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl"
              >
                😋
              </motion.span>
            )}
            {playAnim && (
              <motion.span
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -60 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl"
              >
                💖
              </motion.span>
            )}
          </AnimatePresence>

          <p className="text-sm text-gray-400">
            {t("pet.level", {
              level: currentPet?.level || pet.level,
              type: t(petTypeKey),
            })}
          </p>
        </Card>

        {/* Stats */}
        <Card>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("pet.hunger")}</span>
                <span>{currentPet?.hunger || pet.hunger}/100</span>
              </div>
              <ProgressBar
                value={currentPet?.hunger || pet.hunger}
                color="bg-orange-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("pet.happiness")}</span>
                <span>{currentPet?.happiness || pet.happiness}/100</span>
              </div>
              <ProgressBar
                value={currentPet?.happiness || pet.happiness}
                color="bg-pink-400"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleFeed}
            disabled={!canFeed}
            className="w-full"
            size="lg"
          >
            {t("pet.feed")}
          </Button>
          <Button
            onClick={handlePlay}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            {t("pet.play")}
          </Button>
        </div>

        {!canFeed && (
          <p className="text-center text-sm text-gray-400">
            {t("pet.earnMore")}
          </p>
        )}
      </div>
    </div>
  );
}
