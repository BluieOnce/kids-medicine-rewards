"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import BreathingExercise from "@/components/child/BreathingExercise";
import TapRhythm from "@/components/child/TapRhythm";
import CountingStars from "@/components/child/CountingStars";
import { useTranslation } from "@/i18n";

type Tool = "menu" | "breathing" | "tap" | "counting";

export default function CalmToolsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTool, setActiveTool] = useState<Tool>("menu");

  if (activeTool === "breathing") {
    return (
      <div className="min-h-dvh">
        <PageHeader
          title={t("calm.breathing")}
          showBack
          rightElement={
            <button
              onClick={() => setActiveTool("menu")}
              className="text-sm text-blue-500"
            >
              {t("calm.done")}
            </button>
          }
        />
        <BreathingExercise />
      </div>
    );
  }

  if (activeTool === "tap") {
    return (
      <div className="min-h-dvh">
        <PageHeader
          title={t("calm.tapRhythm")}
          showBack
          rightElement={
            <button
              onClick={() => setActiveTool("menu")}
              className="text-sm text-blue-500"
            >
              {t("calm.done")}
            </button>
          }
        />
        <TapRhythm />
      </div>
    );
  }

  if (activeTool === "counting") {
    return (
      <div className="min-h-dvh">
        <PageHeader
          title={t("calm.countingStars")}
          showBack
          rightElement={
            <button
              onClick={() => setActiveTool("menu")}
              className="text-sm text-blue-500"
            >
              {t("calm.done")}
            </button>
          }
        />
        <CountingStars />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title={t("calm.title")} />

      <div className="px-4 space-y-4 mt-4">
        <p className="text-gray-500 text-center text-sm">
          {t("calm.subtitle")}
        </p>

        <Card
          onClick={() => setActiveTool("breathing")}
          className="py-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🫧</span>
            <div>
              <h3 className="font-semibold text-lg">{t("calm.breathingBubble")}</h3>
              <p className="text-sm text-gray-400">
                {t("calm.breathingDesc")}
              </p>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => setActiveTool("tap")}
          className="py-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🥁</span>
            <div>
              <h3 className="font-semibold text-lg">{t("calm.tapRhythm")}</h3>
              <p className="text-sm text-gray-400">
                {t("calm.tapDesc")}
              </p>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => setActiveTool("counting")}
          className="py-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">✨</span>
            <div>
              <h3 className="font-semibold text-lg">{t("calm.countingStars")}</h3>
              <p className="text-sm text-gray-400">
                {t("calm.countingDesc")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <NavBar />
    </div>
  );
}
