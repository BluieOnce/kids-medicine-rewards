"use client";

import { motion } from "framer-motion";

interface StarDisplayProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export default function StarDisplay({ count, size = "md" }: StarDisplayProps) {
  return (
    <motion.div
      key={count}
      initial={{ scale: 1.3 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1"
    >
      <span className={sizeMap[size]}>⭐</span>
      <span className={`font-bold text-amber-500 ${sizeMap[size]}`}>
        {count}
      </span>
    </motion.div>
  );
}
