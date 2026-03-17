"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import StatCard from "@/components/parent/StatCard";
import { analyticsService } from "@/domain/analytics/analyticsService";
import { useTranslation } from "@/i18n";

interface AdminDashboardProps {
  childId: string;
}

const STATUS_EMOJI: Record<string, string> = {
  completed: "✅",
  late: "⏰",
  skipped: "⏭️",
};

const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS_HE = ["שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון"];

export default function AdminDashboard({ childId }: AdminDashboardProps) {
  const { t, locale } = useTranslation();

  const stats = useMemo(
    () => analyticsService.getChildStats(childId),
    [childId]
  );

  const history = useMemo(
    () => analyticsService.getDoseHistory(childId, 20),
    [childId]
  );

  const weeklyRates = useMemo(
    () => analyticsService.getWeeklyCompletionRate(childId),
    [childId]
  );

  const dayLabels = locale === "he" ? DAY_LABELS_HE : DAY_LABELS_EN;
  // Shift labels to align with current weekday
  const today = new Date().getDay(); // 0=Sun
  const adjustedLabels = useMemo(() => {
    const result: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayIdx = d.getDay(); // 0=Sun
      // Convert to Mon=0 index
      const labelIdx = locale === "he"
        ? (dayIdx === 0 ? 6 : dayIdx - 1)
        : (dayIdx === 0 ? 6 : dayIdx - 1);
      result.push(dayLabels[labelIdx]);
    }
    return result;
  }, [today, dayLabels, locale]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 overflow-hidden"
    >
      {/* Stats Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        <StatCard
          emoji="💊"
          value={stats.totalDoses}
          label={t("admin.totalDoses")}
        />
        <StatCard
          emoji="📊"
          value={`${stats.completionRate}%`}
          label={t("admin.completionRate")}
        />
        <StatCard
          emoji="⭐"
          value={stats.totalStarsEarned}
          label={t("admin.starsEarned")}
        />
        <StatCard
          emoji="🔥"
          value={stats.bestStreak}
          label={t("admin.bestStreak")}
        />
      </div>

      {/* Weekly Chart */}
      <Card>
        <h3 className="font-semibold text-gray-700 mb-3">
          {t("admin.weeklyProgress")}
        </h3>
        <div className="flex items-end justify-between gap-1 h-24">
          {weeklyRates.map((rate, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(rate, 4)}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`w-full rounded-t-sm ${
                  rate >= 80
                    ? "bg-green-400"
                    : rate >= 50
                      ? "bg-amber-400"
                      : rate > 0
                        ? "bg-red-400"
                        : "bg-gray-200"
                }`}
                style={{ minHeight: "4px" }}
              />
              <span className="text-[10px] text-gray-400">
                {adjustedLabels[i]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Dose History */}
      <Card>
        <h3 className="font-semibold text-gray-700 mb-3">
          {t("admin.doseHistory")}
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            {t("admin.noDoses")}
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.dose.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{entry.medicineName}</p>
                  <p className="text-xs text-gray-400">
                    {entry.date} · {entry.time}
                  </p>
                </div>
                <span className="text-lg">
                  {STATUS_EMOJI[entry.dose.status] || ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
