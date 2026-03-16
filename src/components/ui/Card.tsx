"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Card({ children, onClick, className = "" }: CardProps) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-3xl shadow-sm border border-gray-100
        p-4 ${onClick ? "cursor-pointer active:shadow-md" : ""} ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
