"use client";

import BalloonPopGame from "@/games/balloonPop/BalloonPopGame";
import PageHeader from "@/components/ui/PageHeader";
import { useTranslation } from "@/i18n";

export default function BalloonPopPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh">
      <PageHeader title={t("games.balloonPop")} showBack />
      <BalloonPopGame />
    </div>
  );
}
