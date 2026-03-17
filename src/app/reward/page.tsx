"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import NavBar from "@/components/ui/NavBar";
import Card from "@/components/ui/Card";
import StarDisplay from "@/components/ui/StarDisplay";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 50, 100];

function getNextMilestone(current: number): number | null {
  return STREAK_MILESTONES.find((m) => m > current) ?? null;
}

export default function RewardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { activeChildId, children, loadData, getRewards, getStreak, isLoaded } =
    useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const child = children.find((c) => c.id === activeChildId);
  const rewards = activeChildId ? getRewards(activeChildId) : null;
  const streak = activeChildId ? getStreak(activeChildId) : null;

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-5xl"
        >
          ⭐
        </motion.div>
      </div>
    );
  }

  if (!activeChildId || !child) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">{t("reward.selectChild")}</p>
      </div>
    );
  }

  const nextMilestone = getNextMilestone(streak?.current || 0);
  const milestoneProgress = nextMilestone
    ? ((streak?.current || 0) / nextMilestone) * 100
    : 100;
  const isNewRecord =
    streak && streak.current > 0 && streak.current === streak.best;

  return (
    <div className="pb-24">
      <PageHeader title={t("reward.title")} />

      <div className="px-4 space-y-4 mt-4">
        {/* Stars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center py-6 bg-gradient-to-br from-amber-50 to-yellow-50">
            <StarDisplay count={rewards?.stars || 0} size="lg" />
            <p className="text-gray-500 mt-1">{t("reward.totalStars")}</p>
          </Card>
        </motion.div>

        {/* Streak */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center py-4">
              <p className="text-4xl font-bold text-orange-500">
                🔥 {streak?.current || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">{t("reward.currentStreak")}</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center py-4">
              <p className="text-4xl font-bold text-purple-500">
                🏆 {streak?.best || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">{t("reward.bestStreak")}</p>
            </Card>
          </motion.div>
        </div>

        {/* New record badge */}
        {isNewRecord && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="text-center py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <p className="font-bold text-purple-600">
                🏆 {t("reward.newRecord")}
              </p>
            </Card>
          </motion.div>
        )}

        {/* Next milestone progress */}
        {nextMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-600">
                  {t("reward.nextMilestone", { days: String(nextMilestone) })}
                </p>
                <span className="text-xs text-gray-400">
                  {streak?.current || 0}/{nextMilestone}
                </span>
              </div>
              <ProgressBar value={milestoneProgress} color="bg-orange-400" />
              <p className="text-xs text-gray-400 mt-2 text-center">
                {t("reward.streakKeepGoing")}
              </p>
            </Card>
          </motion.div>
        )}

        {/* How to earn */}
        <Card>
          <h3 className="font-semibold mb-3">{t("reward.howToEarn")}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("reward.onTimeDose")}</span>
              <span className="font-medium text-amber-500">+10 ⭐</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("reward.lateDose")}</span>
              <span className="font-medium text-amber-500">+5 ⭐</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("reward.allDoneToday")}</span>
              <span className="font-medium text-amber-500">{t("reward.bonus")}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            onClick={() => router.push("/reward/pet")}
            className="text-center py-5"
          >
            <p className="text-3xl mb-1">🐾</p>
            <p className="text-sm font-medium text-gray-600">{t("reward.feedPet")}</p>
            <p className="text-xs text-gray-400">{t("reward.fiveStars")}</p>
          </Card>
          <Card
            onClick={() => router.push("/games")}
            className="text-center py-5"
          >
            <p className="text-3xl mb-1">🎮</p>
            <p className="text-sm font-medium text-gray-600">{t("reward.playGame")}</p>
          </Card>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
