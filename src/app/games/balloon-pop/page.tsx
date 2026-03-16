"use client";

import BalloonPopGame from "@/games/balloonPop/BalloonPopGame";
import PageHeader from "@/components/ui/PageHeader";

export default function BalloonPopPage() {
  return (
    <div className="min-h-dvh">
      <PageHeader title="Balloon Pop" showBack />
      <BalloonPopGame />
    </div>
  );
}
