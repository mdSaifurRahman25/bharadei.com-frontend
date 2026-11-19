import { Suspense } from "react";
import AllEquipmentClient from "@/components/equipment/AllEquipmentClient";

export default function AllEquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="bd-container py-20 text-center text-sm text-[var(--muted)]">
          Loading equipment catalog...
        </div>
      }
    >
      <AllEquipmentClient />
    </Suspense>
  );
}
