"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n";

const navItems = [
  { href: "/dashboard", labelKey: "nav.home", icon: "🏠" },
  { href: "/calm-tools", labelKey: "nav.calm", icon: "🫧" },
  { href: "/games", labelKey: "nav.games", icon: "🎮" },
  { href: "/reward", labelKey: "nav.rewards", icon: "⭐" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="max-w-[480px] mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors
                ${active ? "text-blue-600" : "text-gray-400"}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
