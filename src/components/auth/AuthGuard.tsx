"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthChange, AppUser } from "@/lib/auth";
import { setStoragePrefix } from "@/data/storage/localStorage";
import { motion } from "framer-motion";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    // Check if Firebase is configured
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      // Firebase not configured — skip auth, allow all access
      setStatus("authenticated");
      return;
    }

    const unsubscribe = onAuthChange((user: AppUser | null) => {
      if (user) {
        // Scope localStorage data by user ID
        setStoragePrefix(user.uid);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login") {
      router.replace("/login");
    }
    if (status === "authenticated" && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          💊
        </motion.div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated" && pathname !== "/login") {
    return null; // Will redirect
  }

  return <>{children}</>;
}
