"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: string;
}

export default function ProgressBar({
  value,
  color = "bg-blue-500",
  height = "h-3",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${height} ${color} rounded-full`}
      />
    </div>
  );
}
