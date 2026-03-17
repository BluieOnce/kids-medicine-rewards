"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { setStoragePrefix, resetStoragePrefix } from "@/data/storage/localStorage";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const setUser = useAppStore((s) => s.setUser);
  const resetStore = useAppStore((s) => s.resetStore);

  useEffect(() => {
    // Dynamic import to avoid SSR issues — Firebase should only load on the client
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      // Firebase not configured — skip auth, allow all access
      setStatus("authenticated");
      return;
    }

    // Lazy-load auth module to prevent Firebase from initializing during SSR
    import("@/lib/auth").then(({ onAuthChange }) => {
      const unsubscribe = onAuthChange((user) => {
        if (user) {
          setStoragePrefix(user.uid);
          setUser(user);
          setStatus("authenticated");
        } else {
          // User logged out — clear in-memory state and reset storage prefix
          resetStore();
          resetStoragePrefix();
          setStatus("unauthenticated");
        }
      });

      // Store cleanup function
      return () => unsubscribe();
    });
  }, [setUser, resetStore]);

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
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl mb-4"
        >
          💊
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-gray-700 mb-2"
        >
          Medicine Heroes
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-400 text-sm"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated" && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
