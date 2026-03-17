"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { PetType, PetStage } from "@/types";
import { petService } from "@/domain/pet/petService";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import StarDisplay from "@/components/ui/StarDisplay";
import EvolutionAnimation from "@/components/child/EvolutionAnimation";
import HatchAnimation from "@/components/child/HatchAnimation";
import { useTranslation } from "@/i18n";

export default function PetPage() {
  const { t } = useTranslation();
  const {
    activeChildId,
    activePetSlot,
    loadData,
    getPet,
    getPets,
    createPet,
    feedPet,
    playWithPet,
    getRewards,
    getStreak,
    setActivePetSlot,
  } = useAppStore();

  const [feedAnim, setFeedAnim] = useState(false);
  const [playAnim, setPlayAnim] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionStage, setEvolutionStage] = useState<PetStage>("baby");
  const [evolutionEmoji, setEvolutionEmoji] = useState("");
  const [showHatch, setShowHatch] = useState(false);
  const [hatchType, setHatchType] = useState<PetType>("cat");
  const [viewMode, setViewMode] = useState<"slots" | "detail">("slots");

  useEffect(() => {
    loadData();
  }, [loadData]);

  const rewards = activeChildId ? getRewards(activeChildId) : null;
  const streak = activeChildId ? getStreak(activeChildId) : null;
  const bestStreak = streak?.best ?? 0;
  const unlockedPets = petService.getUnlockedPets(bestStreak);
  const petOrder = petService.getPetOrder();
  const allPets = activeChildId ? getPets(activeChildId) : [];

  const handleAdoptEgg = useCallback(
    (slotIndex: number) => {
      if (!activeChildId) return;
      const eggName = prompt(t("pet.nameYourEgg"));
      if (!eggName) return;
      createPet(activeChildId, slotIndex, eggName, unlockedPets);
      setActivePetSlot(slotIndex);
      setViewMode("detail");
    },
    [activeChildId, createPet, setActivePetSlot, t, unlockedPets]
  );

  const handleFeed = useCallback(() => {
    if (!activeChildId || !rewards || rewards.stars < 5) return;
    const result = feedPet(activeChildId, activePetSlot);
    if (!result) return;

    setFeedAnim(true);
    setTimeout(() => setFeedAnim(false), 1000);

    if (result.hatched && result.revealedType) {
      setHatchType(result.revealedType);
      setTimeout(() => setShowHatch(true), 600);
    } else if (result.evolved && result.newStage) {
      setEvolutionStage(result.newStage);
      setEvolutionEmoji(
        petService.getPetEmoji(result.pet.petType, result.pet.level, true)
      );
      setTimeout(() => setShowEvolution(true), 600);
    }
  }, [activeChildId, activePetSlot, feedPet, rewards]);

  const handlePlay = useCallback(() => {
    if (!activeChildId) return;
    playWithPet(activeChildId, activePetSlot);
    setPlayAnim(true);
    setTimeout(() => setPlayAnim(false), 1000);
  }, [activeChildId, activePetSlot, playWithPet]);

  if (!activeChildId) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">{t("reward.selectChild")}</p>
      </div>
    );
  }

  // ── Slot selection view ──
  if (viewMode === "slots") {
    return (
      <div className="pb-8">
        <PageHeader
          title={t("pet.chooseTitle")}
          showBack
          rightElement={
            <StarDisplay count={rewards?.stars || 0} size="sm" />
          }
        />
        <div className="px-4 space-y-4 mt-4">
          <p className="text-gray-500 text-center text-sm">
            {t("pet.slotsInstruction")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {petOrder.map((type, index) => {
              const isUnlocked = petService.isUnlocked(type, bestStreak);
              const threshold = petService.getUnlockThreshold(type);
              const existingPet = allPets.find((p) => p.slotIndex === index);

              if (!isUnlocked) {
                // Locked slot
                return (
                  <Card key={index} className="text-center py-6 opacity-50">
                    <span className="text-5xl">🔒</span>
                    <p className="mt-2 text-xs text-gray-400">
                      {t("pet.unlockAt", { streak: threshold })}
                    </p>
                  </Card>
                );
              }

              if (existingPet) {
                // Occupied slot — show pet
                const emoji = petService.getPetEmoji(
                  existingPet.petType,
                  existingPet.level,
                  existingPet.revealedType
                );
                const stage = petService.getStage(existingPet.level);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      onClick={() => {
                        setActivePetSlot(index);
                        setViewMode("detail");
                      }}
                      className="text-center py-6"
                    >
                      <span className="text-5xl">{emoji}</span>
                      <p className="mt-1 font-medium text-sm">
                        {existingPet.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {existingPet.revealedType
                          ? t(`pet.stage.${stage}`)
                          : t("pet.mysteryEgg")}
                      </p>
                    </Card>
                  </motion.div>
                );
              }

              // Empty unlocked slot
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    onClick={() => handleAdoptEgg(index)}
                    className="text-center py-6 border-2 border-dashed border-amber-300"
                  >
                    <span className="text-5xl">🥚</span>
                    <p className="mt-1 text-xs text-amber-500 font-medium">
                      {t("pet.tapToAdopt")}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Detail view for active pet ──
  const currentPet = getPet(activeChildId, activePetSlot);
  if (!currentPet) {
    // Pet doesn't exist in this slot, go back to slots
    return (
      <div className="pb-8">
        <PageHeader title={t("pet.chooseTitle")} showBack />
        <div className="px-4 mt-4 text-center">
          <p className="text-gray-400">{t("pet.noPetInSlot")}</p>
          <Button className="mt-4" onClick={() => setViewMode("slots")}>
            {t("pet.viewAllPets")}
          </Button>
        </div>
      </div>
    );
  }

  const canFeed = (rewards?.stars || 0) >= 5;
  const stage = petService.getStage(currentPet.level);
  const emoji = petService.getPetEmoji(
    currentPet.petType,
    currentPet.level,
    currentPet.revealedType
  );
  const isEgg = !currentPet.revealedType;
  const hatchProgress = currentPet.feedCount;
  const hatchThreshold = petService.getHatchThreshold();

  return (
    <div className="pb-8">
      <PageHeader
        title={currentPet.name}
        showBack
        onBack={() => setViewMode("slots")}
        rightElement={
          <StarDisplay count={rewards?.stars || 0} size="sm" />
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
            {emoji}
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

          {isEgg ? (
            <div>
              <p className="text-sm text-gray-400 mb-1">
                {t("pet.mysteryEgg")}
              </p>
              <p className="text-xs text-amber-500">
                {t("pet.hatchProgress", {
                  current: hatchProgress,
                  total: hatchThreshold,
                })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              {t("pet.levelAndStage", {
                level: currentPet.level,
                stage: t(`pet.stage.${stage}`),
                type: t(`pet.${currentPet.petType}`),
              })}
            </p>
          )}
        </Card>

        {/* Stats */}
        <Card>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("pet.hunger")}</span>
                <span>{currentPet.hunger}/100</span>
              </div>
              <ProgressBar
                value={currentPet.hunger}
                color="bg-orange-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("pet.happiness")}</span>
                <span>{currentPet.happiness}/100</span>
              </div>
              <ProgressBar
                value={currentPet.happiness}
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

        {/* Back to all pets */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setViewMode("slots")}
        >
          {t("pet.viewAllPets")}
        </Button>
      </div>

      {/* Animations */}
      <EvolutionAnimation
        show={showEvolution}
        petEmoji={evolutionEmoji}
        newStage={evolutionStage}
        onComplete={() => setShowEvolution(false)}
      />
      <HatchAnimation
        show={showHatch}
        petType={hatchType}
        onComplete={() => setShowHatch(false)}
      />
    </div>
  );
}
