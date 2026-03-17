"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BreathingExercise from "@/components/child/BreathingExercise";
import TapRhythm from "@/components/child/TapRhythm";
import CountingStars from "@/components/child/CountingStars";
import PageHeader from "@/components/ui/PageHeader";
import { useTranslation } from "@/i18n";

type CalmTool = "menu" | "breathing" | "tap" | "counting";

interface CalmModeStepProps {
  onReady: () => void;
}

export default function CalmModeStep({ onReady }: CalmModeStepProps) {
  const { t } = useTranslation();
  const [activeTool, setActiveTool] = useState<CalmTool>("menu");

  if (activeTool !== "menu") {
    const titles: Record<Exclude<CalmTool, "menu">, string> = {
      breathing: t("calm.breathing"),
      tap: t("calm.tapRhythm"),
      counting: t("calm.countingStars"),
    };

    return (
      <div className="min-h-dvh">
        <PageHeader
          title={titles[activeTool]}
          showBack
          onBack={() => setActiveTool("menu")}
          rightElement={
            <button
              onClick={() => setActiveTool("menu")}
              className="text-sm text-blue-500"
            >
              {t("wizard.backToCalm")}
            </button>
          }
        />
        {activeTool === "breathing" && <BreathingExercise />}
        {activeTool === "tap" && <TapRhythm />}
        {activeTool === "counting" && <CountingStars />}

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t">
          <Button className="w-full" size="lg" onClick={onReady}>
            {t("wizard.imReady")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">🫧</div>

      <h1 className="text-xl font-bold text-gray-800 mb-1">
        {t("wizard.feelingNervous")}
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        {t("wizard.tryCalmFirst")}
      </p>

      <div className="space-y-3 w-full mb-6">
        <Card onClick={() => setActiveTool("breathing")} className="py-5">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🫧</span>
            <div className="text-start">
              <h3 className="font-semibold">{t("calm.breathingBubble")}</h3>
              <p className="text-xs text-gray-400">{t("calm.breathingDesc")}</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => setActiveTool("tap")} className="py-5">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🥁</span>
            <div className="text-start">
              <h3 className="font-semibold">{t("calm.tapRhythm")}</h3>
              <p className="text-xs text-gray-400">{t("calm.tapDesc")}</p>
            </div>
          </div>
        </Card>

        <Card onClick={() => setActiveTool("counting")} className="py-5">
          <div className="flex items-center gap-4">
            <span className="text-4xl">✨</span>
            <div className="text-start">
              <h3 className="font-semibold">{t("calm.countingStars")}</h3>
              <p className="text-xs text-gray-400">{t("calm.countingDesc")}</p>
            </div>
          </div>
        </Card>
      </div>

      <Button className="w-full" size="lg" onClick={onReady}>
        {t("wizard.imReady")}
      </Button>
    </div>
  );
}
