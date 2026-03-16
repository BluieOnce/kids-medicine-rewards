"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import NavBar from "@/components/ui/NavBar";
import Card from "@/components/ui/Card";
import StarDisplay from "@/components/ui/StarDisplay";
import PageHeader from "@/components/ui/PageHeader";
import { motion } from "framer-motion";

export default function RewardPage() {
  const router = useRouter();
  const { activeChildId, children, loadData, getRewards, getStreak } =
    useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const child = children.find((c) => c.id === activeChildId);
  const rewards = activeChildId ? getRewards(activeChildId) : null;
  const streak = activeChildId ? getStreak(activeChildId) : null;

  if (!activeChildId || !child) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">Select a child first</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="Rewards" />

      <div className="px-4 space-y-4 mt-4">
        {/* Stars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center py-6 bg-gradient-to-br from-amber-50 to-yellow-50">
            <StarDisplay count={rewards?.stars || 0} size="lg" />
            <p className="text-gray-500 mt-1">Total Stars</p>
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
              <p className="text-xs text-gray-400 mt-1">Current Streak</p>
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
              <p className="text-xs text-gray-400 mt-1">Best Streak</p>
            </Card>
          </motion.div>
        </div>

        {/* How to earn */}
        <Card>
          <h3 className="font-semibold mb-3">How to earn stars</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">On-time dose</span>
              <span className="font-medium text-amber-500">+10 ⭐</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Late dose</span>
              <span className="font-medium text-amber-500">+5 ⭐</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">All done today</span>
              <span className="font-medium text-amber-500">+10 ⭐ bonus</span>
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
            <p className="text-sm font-medium text-gray-600">Feed Pet</p>
            <p className="text-xs text-gray-400">5 stars</p>
          </Card>
          <Card
            onClick={() => router.push("/games")}
            className="text-center py-5"
          >
            <p className="text-3xl mb-1">🎮</p>
            <p className="text-sm font-medium text-gray-600">Play Game</p>
          </Card>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
