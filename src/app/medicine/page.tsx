"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import NavBar from "@/components/ui/NavBar";

export default function MedicineListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  const { medicines, children, activeChildId, loadData, deleteMedicine, updateMedicine } =
    useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const effectiveChildId = childId || activeChildId;
  const child = children.find((c) => c.id === effectiveChildId);
  const childMedicines = medicines.filter(
    (m) => m.childId === effectiveChildId
  );

  return (
    <div className="pb-24">
      <PageHeader
        title={child ? `${child.name}'s Medicines` : "Medicines"}
        showBack
      />

      <div className="px-4 space-y-3 mt-4">
        {childMedicines.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-4xl mb-2">💊</p>
            <p className="text-gray-500 mb-3">No medicines yet</p>
          </Card>
        ) : (
          childMedicines.map((med) => (
            <Card key={med.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{med.name}</p>
                  <p className="text-sm text-gray-400">{med.dosage}</p>
                  <div className="flex gap-1 mt-1">
                    {med.scheduleTimes.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateMedicine({ ...med, active: !med.active })
                    }
                  >
                    {med.active ? "Pause" : "Resume"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Delete ${med.name}?`)) {
                        deleteMedicine(med.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}

        <Button
          className="w-full"
          onClick={() =>
            router.push(
              `/medicine/add${effectiveChildId ? `?childId=${effectiveChildId}` : ""}`
            )
          }
        >
          + Add Medicine
        </Button>
      </div>

      <NavBar />
    </div>
  );
}
