"use client";

import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/NavBar";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import { useTranslation } from "@/i18n";

export default function GamesPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="pb-24">
      <PageHeader title={t("games.title")} />

      <div className="px-4 space-y-4 mt-4">
        <Card
          onClick={() => router.push("/games/balloon-pop")}
          className="py-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">🎈</span>
            <div>
              <h3 className="font-semibold text-lg">{t("games.balloonPop")}</h3>
              <p className="text-sm text-gray-400">
                {t("games.balloonPopDesc")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="py-6 opacity-50">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🧩</span>
            <div>
              <h3 className="font-semibold text-lg">{t("games.moreGamesSoon")}</h3>
              <p className="text-sm text-gray-400">
                {t("games.moreGamesDesc")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <NavBar />
    </div>
  );
}
