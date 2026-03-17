"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/i18n";
import { petService } from "@/domain/pet/petService";
import { Dose, Medicine, Child } from "@/types";
import DueNowStep from "./steps/DueNowStep";
import CalmModeStep from "./steps/CalmModeStep";
import ParentConfirmStep from "./steps/ParentConfirmStep";
import ChildSuccessStep from "./steps/ChildSuccessStep";
import RewardRevealStep from "./steps/RewardRevealStep";
import PostRewardStep from "./steps/PostRewardStep";

type WizardStep =
  | "due-now"
  | "calm-mode"
  | "parent-confirm"
  | "child-success"
  | "reward-reveal"
  | "post-reward";

interface MedicineWizardProps {
  dose: Dose;
  medicine: Medicine;
  child: Child;
}

function getDoseUrgency(
  scheduledAt: string
): "overdue" | "due-now" | "upcoming" {
  const now = new Date();
  const scheduled = new Date(scheduledAt);
  const diffMinutes = (now.getTime() - scheduled.getTime()) / (1000 * 60);

  if (diffMinutes > 30) return "overdue";
  if (diffMinutes >= -15) return "due-now";
  return "upcoming";
}

export default function MedicineWizard({
  dose,
  medicine,
  child,
}: MedicineWizardProps) {
  const router = useRouter();
  const { dir } = useTranslation();
  const { confirmDose, claimReward, skipDose, getRewards, getPet } =
    useAppStore();

  // Determine initial step based on dose state (refresh resilience)
  const getInitialStep = useCallback((): WizardStep => {
    if (
      (dose.status === "completed" || dose.status === "late") &&
      !dose.rewardGranted
    ) {
      return "child-success";
    }
    if (dose.rewardGranted) {
      // Already fully processed - shouldn't be here
      return "due-now";
    }
    return "due-now";
  }, [dose.status, dose.rewardGranted]);

  const [step, setStep] = useState<WizardStep>(getInitialStep);
  const [rewardData, setRewardData] = useState<{
    stars: number;
    streak: { current: number; best: number };
    dailyBonus: boolean;
  } | null>(null);
  const [confirmedDose, setConfirmedDose] = useState<Dose | null>(
    dose.status !== "pending" ? dose : null
  );

  // Redirect if dose is already fully processed
  useEffect(() => {
    if (dose.rewardGranted && dose.status !== "pending") {
      router.replace("/dashboard");
    }
  }, [dose.rewardGranted, dose.status, router]);

  // Get pet info for display
  const pet = getPet(child.id);
  const petEmoji = pet
    ? petService.getPetEmoji(pet.petType, pet.level, pet.revealedType)
    : null;

  const rewards = getRewards(child.id);
  const hasPet = !!pet;
  const hasEnoughStars = rewards.stars >= petService.getFeedCost();

  const handleSkip = () => {
    skipDose(dose.id);
    router.replace("/dashboard");
  };

  const handleConfirmDose = () => {
    const result = confirmDose(dose.id);
    if (result) {
      setConfirmedDose(result);
      setStep("child-success");
    }
  };

  const handleClaimReward = () => {
    const result = claimReward(dose.id);
    if (result) {
      setRewardData(result);
      setStep("reward-reveal");
    }
  };

  const urgency = getDoseUrgency(dose.scheduledAt);

  const slideDirection = dir === "rtl" ? -1 : 1;

  const renderStep = () => {
    switch (step) {
      case "due-now":
        return (
          <DueNowStep
            childName={child.name}
            childAvatar={child.avatar}
            medicineName={medicine.name}
            medicineDosage={medicine.dosage}
            urgency={urgency}
            onStart={() => setStep("calm-mode")}
            onSkip={handleSkip}
          />
        );
      case "calm-mode":
        return <CalmModeStep onReady={() => setStep("parent-confirm")} />;
      case "parent-confirm":
        return (
          <ParentConfirmStep
            childName={child.name}
            medicineName={medicine.name}
            onConfirm={handleConfirmDose}
            onSkip={handleSkip}
          />
        );
      case "child-success":
        return (
          <ChildSuccessStep petEmoji={petEmoji} onClaim={handleClaimReward} />
        );
      case "reward-reveal":
        return rewardData ? (
          <RewardRevealStep
            stars={rewardData.stars}
            streak={rewardData.streak}
            dailyBonus={rewardData.dailyBonus}
            petEmoji={petEmoji}
            onContinue={() => setStep("post-reward")}
          />
        ) : null;
      case "post-reward":
        return (
          <PostRewardStep
            hasPet={hasPet}
            hasEnoughStars={hasEnoughStars}
            onFeedPet={() => router.push("/reward/pet")}
            onPlayGame={() => router.push("/games")}
            onDone={() => router.push("/dashboard")}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 40 * slideDirection }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 * slideDirection }}
        transition={{ duration: 0.25 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
}
