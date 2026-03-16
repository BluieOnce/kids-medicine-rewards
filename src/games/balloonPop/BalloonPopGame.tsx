"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

interface Balloon {
  id: number;
  x: number;
  color: string;
  speed: number;
  size: number;
}

const COLORS = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-orange-400",
];

const GAME_DURATION = 30; // seconds

export default function BalloonPopGame() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<"idle" | "playing" | "done">(
    "idle"
  );
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const nextId = useRef(0);

  const spawnBalloon = useCallback(() => {
    const balloon: Balloon = {
      id: nextId.current++,
      x: 5 + Math.random() * 80,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 3 + Math.random() * 4,
      size: 40 + Math.random() * 20,
    };
    setBalloons((prev) => [...prev, balloon]);

    // Remove balloon after it floats up
    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    }, balloon.speed * 1000);
  }, []);

  // Spawn balloons
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(spawnBalloon, 600);
    return () => clearInterval(interval);
  }, [gameState, spawnBalloon]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const popBalloon = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setBalloons([]);
    nextId.current = 0;
    setGameState("playing");
  };

  // Idle screen
  if (gameState === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.span
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl mb-6"
        >
          🎈
        </motion.span>
        <h2 className="text-2xl font-bold mb-2">{t("balloon.title")}</h2>
        <p className="text-gray-500 mb-6">
          {t("balloon.instructions", { seconds: GAME_DURATION })}
        </p>
        <Button size="lg" onClick={startGame}>
          {t("balloon.startGame")}
        </Button>
      </div>
    );
  }

  // Done screen
  if (gameState === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <span className="text-8xl">🎉</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mt-4 mb-2"
        >
          {t("balloon.greatJob")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-6"
        >
          {t("balloon.youPopped", { score })}
        </motion.p>
        <div className="space-y-3 w-full">
          <Button size="lg" className="w-full" onClick={startGame}>
            {t("balloon.playAgain")}
          </Button>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* HUD */}
      <div className="sticky top-0 z-30 flex justify-between items-center px-4 py-2 bg-white/80 backdrop-blur-sm">
        <div className="text-lg font-bold text-blue-500">
          {t("balloon.score", { score })}
        </div>
        <div
          className={`text-lg font-bold ${
            timeLeft <= 5 ? "text-red-500" : "text-gray-600"
          }`}
        >
          {timeLeft}s
        </div>
      </div>

      {/* Balloon field */}
      <div className="relative w-full h-[70vh]">
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.button
              key={balloon.id}
              initial={{ y: "100vh", opacity: 1 }}
              animate={{ y: "-20vh" }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{
                y: { duration: balloon.speed, ease: "linear" },
                exit: { duration: 0.2 },
              }}
              onClick={() => popBalloon(balloon.id)}
              style={{
                position: "absolute",
                left: `${balloon.x}%`,
                width: balloon.size,
                height: balloon.size * 1.2,
              }}
              className={`${balloon.color} rounded-full shadow-md active:scale-90`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
