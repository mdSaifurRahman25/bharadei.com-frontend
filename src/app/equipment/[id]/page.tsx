import { Suspense } from "react";
import EquipmentDetailsClient from "@/components/equipment/EquipmentDetailsClient";

async function EquipmentDetailsLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EquipmentDetailsClient equipmentId={id} />;
}

export default function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="bd-container py-20 text-center text-sm text-[var(--muted)]">
          Loading equipment details...
        </div>
      }
    >
      <EquipmentDetailsLoader params={params} />
    </Suspense>
  );
}
