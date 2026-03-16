"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import NavBar from "@/components/ui/NavBar";
import { useTranslation } from "@/i18n";

export default function ChildListPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { children, loadData, deleteChild } = useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="pb-24">
      <PageHeader title={t("child.title")} showBack />

      <div className="px-4 space-y-3 mt-4">
        {children.map((child) => (
          <Card key={child.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{child.avatar}</span>
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
                  onClick={() => router.push(`/medicine?childId=${child.id}`)}
                >
                  {t("child.medicines")}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm(t("child.confirmRemove", { name: child.name }))) {
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
          className="w-full"
          onClick={() => router.push("/child/new")}
        >
          {t("child.addChild")}
        </Button>
      </div>

      <NavBar />
    </div>
  );
}
