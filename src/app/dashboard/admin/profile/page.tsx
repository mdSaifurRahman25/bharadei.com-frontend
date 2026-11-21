"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { ADMIN_NAV } from "@/lib/dashboard-nav";

export default function AdminProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <DashboardShell
        title="Admin Profile"
        subtitle="Manage your administrator profile information."
        navItems={ADMIN_NAV}
      >
        <ProfileSection />
      </DashboardShell>
    </ProtectedRoute>
  );
}
