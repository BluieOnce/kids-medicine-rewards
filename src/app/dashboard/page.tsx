"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import NavBar from "@/components/ui/NavBar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StarDisplay from "@/components/ui/StarDisplay";
import ProgressBar from "@/components/ui/ProgressBar";
import PageHeader from "@/components/ui/PageHeader";
import { Dose } from "@/types";
import { useTranslation } from "@/i18n";

export default function DashboardPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();
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
  } = useAppStore();

  const [todayDoses, setTodayDoses] = useState<Dose[]>([]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === "he" ? "en" : "he")}
              className="text-sm px-2 py-1 rounded-lg bg-gray-100 font-medium"
              title={t("language")}
            >
              {locale === "he" ? "EN" : "HE"}
            </button>
            <button
              onClick={() => router.push("/child")}
              className="text-sm text-blue-500 font-medium"
            >
              {t("dashboard.settings")}
            </button>
          </div>
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
          </Card>
          <Card className="flex-1 text-center">
            <p className="text-4xl font-bold text-orange-500">
              {streak?.current || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">{t("dashboard.dayStreak")}</p>
          </Card>
        </div>

        {/* Today's Progress */}
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">{t("dashboard.todaysMedicines")}</h2>
            <span className="text-sm text-gray-400">
              {completedCount}/{todayDoses.length}
            </span>
          </div>
          <ProgressBar value={progressPercent} color="bg-green-500" />
        </Card>

        {/* Dose List */}
        {todayDoses.length > 0 ? (
          <div className="space-y-2">
            {todayDoses.map((dose) => {
              const med = medicines.find((m) => m.id === dose.medicineId);
              const time = new Date(dose.scheduledAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <motion.div
                  key={dose.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card
                    onClick={() => {
                      if (dose.status === "pending") {
                        router.push(`/medicine/confirm?doseId=${dose.id}`);
                      }
                    }}
                    className={
                      dose.status !== "pending" ? "opacity-60" : ""
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {med?.name || t("dashboard.medicine")}
                        </p>
                        <p className="text-sm text-gray-400">
                          {med?.dosage} · {time}
                        </p>
                      </div>
                      <span className="text-2xl">
                        {dose.status === "completed" && "✅"}
                        {dose.status === "late" && "⏰"}
                        {dose.status === "skipped" && "⏭️"}
                        {dose.status === "pending" && "💊"}
                      </span>
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
