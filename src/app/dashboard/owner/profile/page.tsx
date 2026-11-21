"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { OWNER_NAV } from "@/lib/dashboard-nav";

export default function OwnerProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["Owner"]}>
      <DashboardShell
        title="My Profile"
        subtitle="Keep your owner contact number and pickup address up to date."
        navItems={OWNER_NAV}
      >
        <ProfileSection />
      </DashboardShell>
    </ProtectedRoute>
  );
}
