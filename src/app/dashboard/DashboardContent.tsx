"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/ui/NavBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StarDisplay from "@/components/ui/StarDisplay";
import ProgressBar from "@/components/ui/ProgressBar";
import PageHeader from "@/components/ui/PageHeader";
import { Dose } from "@/types";
import { useTranslation } from "@/i18n";

type DoseUrgency = "overdue" | "due-now" | "upcoming" | "done";

function getDoseUrgency(dose: Dose): DoseUrgency {
  if (dose.status !== "pending") return "done";
  const now = new Date();
  const scheduled = new Date(dose.scheduledAt);
  const diffMinutes = (now.getTime() - scheduled.getTime()) / (1000 * 60);
  if (diffMinutes > 30) return "overdue";
  if (diffMinutes >= -15) return "due-now";
  return "upcoming";
}

function getDoseStatusStyle(urgency: DoseUrgency, status: Dose["status"]) {
  if (status === "completed") return "border-l-4 border-l-green-400 opacity-60";
  if (status === "late") return "border-l-4 border-l-amber-400 opacity-60";
  if (status === "skipped") return "border-l-4 border-l-gray-300 opacity-60";
  if (urgency === "overdue") return "border-l-4 border-l-red-400 bg-red-50";
  if (urgency === "due-now") return "border-l-4 border-l-amber-400 bg-amber-50";
  return "border-l-4 border-l-blue-200";
}

function getDoseIcon(urgency: DoseUrgency, status: Dose["status"]) {
  if (status === "completed") return "✅";
  if (status === "late") return "⏰";
  if (status === "skipped") return "⏭️";
  if (urgency === "overdue") return "🚨";
  if (urgency === "due-now") return "💊";
  return "🕐";
}

function getUrgencyLabel(urgency: DoseUrgency, t: (key: string) => string) {
  if (urgency === "overdue") return t("dashboard.overdue");
  if (urgency === "due-now") return t("dashboard.dueNow");
  return t("dashboard.upcoming");
}

interface DashboardContentProps {
  isTesting?: boolean;
}

export default function DashboardContent({ isTesting = false }: DashboardContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    children,
    medicines,
    activeChildId,
    setActiveChild,
    loadData,
    generateTodayDoses,
    getTodayDoses,
    getRewards,
    getStreak,
    addStars,
    isLoaded,
  } = useAppStore();

  const [todayDoses, setTodayDoses] = useState<Dose[]>([]);
  const [now, setNow] = useState(new Date());
  const [starBump, setStarBump] = useState(0);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update "now" every minute to keep urgency labels fresh
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (children.length > 0 && !activeChildId) {
      setActiveChild(children[0].id);
    }
  }, [children, activeChildId, setActiveChild]);

  useEffect(() => {
    if (activeChildId) {
      generateTodayDoses();
      setTodayDoses(getTodayDoses(activeChildId));
    }
  }, [activeChildId, generateTodayDoses, getTodayDoses]);

  const activeChild = children.find((c) => c.id === activeChildId);
  const rewards = activeChildId ? getRewards(activeChildId) : null;
  const streak = activeChildId ? getStreak(activeChildId) : null;
  const childMedicines = activeChildId
    ? medicines.filter((m) => m.childId === activeChildId && m.active)
    : [];

  const completedCount = todayDoses.filter(
    (d) => d.status === "completed" || d.status === "late"
  ).length;
  const progressPercent =
    todayDoses.length > 0 ? (completedCount / todayDoses.length) * 100 : 0;

  // Sort doses: overdue first, then due-now, then upcoming, then done
  const sortedDoses = useMemo(() => {
    const urgencyOrder: Record<DoseUrgency, number> = {
      overdue: 0,
      "due-now": 1,
      upcoming: 2,
      done: 3,
    };
    return [...todayDoses].sort((a, b) => {
      const ua = getDoseUrgency(a);
      const ub = getDoseUrgency(b);
      if (urgencyOrder[ua] !== urgencyOrder[ub]) {
        return urgencyOrder[ua] - urgencyOrder[ub];
      }
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayDoses, now]);

  const allDone =
    todayDoses.length > 0 &&
    todayDoses.every((d) => d.status !== "pending");
  const allCompleted =
    todayDoses.length > 0 &&
    todayDoses.every((d) => d.status === "completed" || d.status === "late");

  // Streak milestones
  const streakMilestone =
    streak && [3, 7, 14, 21, 30, 50, 100].includes(streak.current)
      ? streak.current
      : null;

  const handleAddStars = () => {
    if (!activeChildId) return;
    addStars(activeChildId, 10);
    setStarBump((b) => b + 1);
  };

  // Loading state to prevent hydration flash
  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-5xl mb-4"
        >
          💊
        </motion.div>
        <p className="text-gray-400">{t("dashboard.loading")}</p>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-4">{t("dashboard.noChildren")}</p>
        <Button onClick={() => router.push("/child/new")}>
          {t("dashboard.addChild")}
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader
        title={t("dashboard.greeting", {
          name: activeChild?.name || "there",
          avatar: activeChild?.avatar || "",
        })}
        rightElement={
          <button
            onClick={() => router.push("/settings")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title={t("dashboard.settings")}
          >
            <span className="text-xl">⚙️</span>
          </button>
        }
      />

      <div className="px-4 space-y-4 mt-4">
        {/* Child selector (if multiple) */}
        {children.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setActiveChild(child.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    child.id === activeChildId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {child.avatar} {child.name}
              </button>
            ))}
          </div>
        )}

        {/* Stars & Streak */}
        <div className="flex gap-3">
          <Card className="flex-1 text-center">
            <StarDisplay count={rewards?.stars || 0} size="lg" />
            <p className="text-xs text-gray-400 mt-1">{t("dashboard.stars")}</p>
            {isTesting && (
              <motion.button
                key={starBump}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                onClick={handleAddStars}
                className="mt-2 px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
              >
                + 10 ⭐
              </motion.button>
            )}
          </Card>
          <Card className="flex-1 text-center">
            <p className="text-4xl font-bold text-orange-500">
              {streak?.current || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">{t("dashboard.dayStreak")}</p>
          </Card>
        </div>

        {/* Streak milestone celebration */}
        <AnimatePresence>
          {streakMilestone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Card className="text-center py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                <p className="text-lg font-bold text-orange-600">
                  {t("dashboard.streakMilestone", { days: String(streakMilestone) })}
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Progress */}
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">{t("dashboard.todaysMedicines")}</h2>
            <span className="text-sm text-gray-400">
              {completedCount}/{todayDoses.length}
            </span>
          </div>
          <ProgressBar
            value={progressPercent}
            color={progressPercent === 100 ? "bg-green-500" : "bg-blue-500"}
          />
        </Card>

        {/* Daily bonus celebration */}
        <AnimatePresence>
          {allCompleted && todayDoses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="text-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <p className="text-3xl mb-1">🎉</p>
                <p className="font-bold text-green-700">
                  {t("dashboard.allDoneBonus")}
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dose List */}
        {sortedDoses.length > 0 ? (
          <div className="space-y-2">
            {sortedDoses.map((dose, idx) => {
              const med = medicines.find((m) => m.id === dose.medicineId);
              const time = new Date(dose.scheduledAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const urgency = getDoseUrgency(dose);
              const statusStyle = getDoseStatusStyle(urgency, dose.status);
              const icon = getDoseIcon(urgency, dose.status);
              return (
                <motion.div
                  key={dose.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    onClick={() => {
                      if (dose.status === "pending") {
                        router.push(`/medicine/confirm?doseId=${dose.id}`);
                      }
                    }}
                    className={statusStyle}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {med?.name || t("dashboard.medicine")}
                        </p>
                        <p className="text-sm text-gray-400">
                          {med?.dosage} · {time}
                        </p>
                        {dose.status === "pending" && (
                          <p
                            className={`text-xs font-medium mt-0.5 ${
                              urgency === "overdue"
                                ? "text-red-500"
                                : urgency === "due-now"
                                ? "text-amber-600"
                                : "text-blue-400"
                            }`}
                          >
                            {getUrgencyLabel(urgency, t)}
                          </p>
                        )}
                      </div>
                      <span className="text-2xl">{icon}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : childMedicines.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-4xl mb-2">💊</p>
            <p className="text-gray-500 mb-3">{t("dashboard.noMedicines")}</p>
            <Button
              size="sm"
              onClick={() => router.push("/medicine/add")}
            >
              {t("dashboard.addMedicine")}
            </Button>
          </Card>
        ) : (
          <Card className="text-center py-8">
            <p className="text-gray-500">{t("dashboard.allDone")}</p>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            onClick={() => router.push("/calm-tools")}
            className="text-center py-5"
          >
            <p className="text-3xl mb-1">🫧</p>
            <p className="text-sm font-medium text-gray-600">{t("dashboard.calmTools")}</p>
          </Card>
          <Card
            onClick={() => router.push("/reward/pet")}
            className="text-center py-5"
          >
            <p className="text-3xl mb-1">🐾</p>
            <p className="text-sm font-medium text-gray-600">{t("dashboard.myPet")}</p>
          </Card>
        </div>

        {/* Parent quick links */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => router.push("/medicine/add")}
          >
            {t("dashboard.plusMedicine")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => router.push("/child/new")}
          >
            {t("dashboard.plusChild")}
          </Button>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
