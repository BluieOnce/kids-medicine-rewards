"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import BreathingExercise from "@/components/child/BreathingExercise";
import TapRhythm from "@/components/child/TapRhythm";
import CountingStars from "@/components/child/CountingStars";

type Tool = "menu" | "breathing" | "tap" | "counting";

export default function CalmToolsPage() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<Tool>("menu");

  if (activeTool === "breathing") {
    return (
      <div className="min-h-dvh">
        <PageHeader
          title="Breathing"
          showBack
          rightElement={
            <button
              onClick={() => setActiveTool("menu")}
              className="text-sm text-blue-500"
            >
              Done
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
          title="Tap Rhythm"
          showBack
          rightElement={
            <button
              onClick={() => setActiveTool("menu")}
              className="text-sm text-blue-500"
            >
              Done
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
          title="Counting Stars"
          showBack
          rightElement={
            <button
              onClick={() => setActiveTool("menu")}
              className="text-sm text-blue-500"
            >
              Done
            </button>
          }
        />
        <CountingStars />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="Calm Tools" />

      <div className="px-4 space-y-4 mt-4">
        <p className="text-gray-500 text-center text-sm">
          Feeling nervous? These tools will help you feel calm and brave.
        </p>

        <Card
          onClick={() => setActiveTool("breathing")}
          className="py-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🫧</span>
            <div>
              <h3 className="font-semibold text-lg">Breathing Bubble</h3>
              <p className="text-sm text-gray-400">
                Watch the bubble grow and shrink. Breathe along with it.
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
              <h3 className="font-semibold text-lg">Tap Rhythm</h3>
              <p className="text-sm text-gray-400">
                Follow the pattern and tap along. Focus on the rhythm.
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
              <h3 className="font-semibold text-lg">Counting Stars</h3>
              <p className="text-sm text-gray-400">
                Tap the stars as they appear. Count them one by one.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <NavBar />
    </div>
  );
}
