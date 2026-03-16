"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

export default function Home() {
  const router = useRouter();
  const { children, loadData } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (children.length > 0) {
      router.replace("/dashboard");
    }
  }, [children, router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-8xl mb-6"
      >
        💊
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-800 mb-2"
      >
        {t("home.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 mb-8"
      >
        {t("home.subtitle")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button size="lg" onClick={() => router.push("/child/new")}>
          {t("home.getStarted")}
        </Button>
      </motion.div>
    </div>
  );
}
