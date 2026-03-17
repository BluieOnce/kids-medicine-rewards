"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { children, loadData } = useAppStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData();
    setLoaded(true);
  }, [loadData]);

  useEffect(() => {
    if (!loaded) return;
    if (children.length > 0) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [children, router, loaded]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-7xl"
      >
        💊
      </motion.div>
    </div>
  );
}
