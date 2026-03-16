"use client";

import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function GamesPage() {
  const router = useRouter();

  return (
    <div className="pb-24">
      <PageHeader title="Games" />

      <div className="px-4 space-y-4 mt-4">
        <Card
          onClick={() => router.push("/games/balloon-pop")}
          className="py-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🎈</span>
            <div>
              <h3 className="font-semibold text-lg">Balloon Pop</h3>
              <p className="text-sm text-gray-400">
                Pop as many balloons as you can in 30 seconds!
              </p>
            </div>
          </div>
        </Card>

        <Card className="py-6 opacity-50">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🧩</span>
            <div>
              <h3 className="font-semibold text-lg">More games soon!</h3>
              <p className="text-sm text-gray-400">
                New games are on the way.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <NavBar />
    </div>
  );
}
