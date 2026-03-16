"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { AgeGroup } from "@/types";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { motion } from "framer-motion";

const avatars = ["🦸", "🧒", "👧", "👦", "🧑", "🦹", "🧚", "🦄"];
const ageGroups: { value: AgeGroup; label: string }[] = [
  { value: "toddler", label: "Toddler (2-4)" },
  { value: "child", label: "Child (5-8)" },
  { value: "preteen", label: "Preteen (9-12)" },
];

export default function NewChildPage() {
  const router = useRouter();
  const { addChild, setActiveChild } = useAppStore();

  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("child");
  const [avatar, setAvatar] = useState("🦸");

  const handleSubmit = () => {
    if (!name.trim()) return;
    const child = addChild(name.trim(), ageGroup, avatar);
    setActiveChild(child.id);
    router.push("/dashboard");
  };

  return (
    <div className="pb-8">
      <PageHeader title="Add Child" showBack />

      <div className="px-4 space-y-6 mt-4">
        {/* Avatar */}
        <Card>
          <p className="text-sm font-medium text-gray-500 mb-3">
            Choose an avatar
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {avatars.map((a) => (
              <motion.button
                key={a}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAvatar(a)}
                className={`text-4xl p-2 rounded-2xl transition-colors
                  ${avatar === a ? "bg-blue-100 ring-2 ring-blue-400" : "bg-gray-50"}`}
              >
                {a}
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Child's name"
            className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={50}
          />
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Age Group
          </label>
          <div className="flex gap-2">
            {ageGroups.map((ag) => (
              <button
                key={ag.value}
                onClick={() => setAgeGroup(ag.value)}
                className={`flex-1 py-3 px-2 rounded-2xl text-sm font-medium transition-colors
                  ${
                    ageGroup === ag.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {ag.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          Add {name || "Child"}
        </Button>
      </div>
    </div>
  );
}
