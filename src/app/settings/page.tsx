"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import NavBar from "@/components/ui/NavBar";
import AdminDashboard from "@/components/parent/AdminDashboard";
import { useTranslation } from "@/i18n";

export default function SettingsPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();
  const { children, user, activeChildId, loadData, deleteChild, resetStore } =
    useAppStore();
  const [showStats, setShowStats] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Clear in-memory state first, then sign out.
      // AuthGuard's onAuthChange will also fire and reset storage prefix.
      resetStore();
      const { signOut } = await import("@/lib/auth");
      await signOut();
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className="pb-24">
      <PageHeader title={t("settings.title")} showBack />

      <div className="px-4 space-y-4 mt-4">
        {/* User Profile */}
        {user && (
          <Card>
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-12 h-12 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                  👤
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user.displayName || t("settings.user")}
                </p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Language */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <p className="font-medium text-gray-700">{t("language")}</p>
            </div>
            <button
              onClick={() => setLocale(locale === "he" ? "en" : "he")}
              className="px-4 py-2 rounded-lg bg-gray-100 font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              {locale === "he" ? "English" : "עברית"}
            </button>
          </div>
        </Card>

        {/* Statistics */}
        {activeChildId && (
          <div>
            <Card
              onClick={() => setShowStats(!showStats)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <p className="font-medium text-gray-700">
                    {t("settings.statistics")}
                  </p>
                </div>
                <span
                  className={`text-gray-400 transition-transform ${showStats ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>
            </Card>
            <AnimatePresence>
              {showStats && (
                <motion.div className="mt-2">
                  <AdminDashboard childId={activeChildId} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Children Management */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            {t("settings.manageChildren")}
          </h2>
          <div className="space-y-2">
            {children.map((child) => (
              <Card key={child.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{child.avatar}</span>
                    <div>
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-sm text-gray-400 capitalize">
                        {child.ageGroup}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        router.push(`/medicine?childId=${child.id}`)
                      }
                    >
                      {t("child.medicines")}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            t("child.confirmRemove", { name: child.name })
                          )
                        ) {
                          deleteChild(child.id);
                        }
                      }}
                    >
                      {t("child.remove")}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.push("/child/new")}
            >
              {t("child.addChild")}
            </Button>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="danger"
          className="w-full"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? t("auth.loading") : `🚪 ${t("auth.signOut")}`}
        </Button>
      </div>

      <NavBar />
    </div>
  );
}
