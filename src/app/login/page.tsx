"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.replace("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Animated pill */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="text-8xl mb-6"
      >
        💊
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-gray-800 mb-2"
      >
        {t("login.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 text-center mb-8 max-w-xs"
      >
        {t("auth.loginSubtitle")}
      </motion.p>

      {/* Floating emojis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-4 text-3xl mb-8"
      >
        {["⭐", "🐱", "🎮", "🫧"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      {/* Google Sign In */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="w-full max-w-xs"
      >
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? t("auth.loading") : t("auth.signInWithGoogle")}
        </Button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mt-3"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
