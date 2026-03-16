"use client";

import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function PageHeader({
  title,
  showBack = false,
  rightElement,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="text-2xl p-1 -ml-1"
          >
            ←
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
}
