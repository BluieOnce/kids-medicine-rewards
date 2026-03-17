"use client";

import Card from "@/components/ui/Card";
import { motion } from "framer-motion";

interface StatCardProps {
  emoji: string;
  value: string | number;
  label: string;
}

export default function StatCard({ emoji, value, label }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-32"
    >
      <Card className="text-center py-3">
        <p className="text-2xl mb-1">{emoji}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
      </Card>
    </motion.div>
  );
}
