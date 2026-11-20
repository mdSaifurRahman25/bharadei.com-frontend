"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { CUSTOMER_NAV } from "@/lib/dashboard-nav";

export default function CustomerProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["Customer"]}>
      <DashboardShell
        title="My Profile"
        subtitle="Manage your contact details and delivery address for faster rentals."
        navItems={CUSTOMER_NAV}
      >
        <ProfileSection />
      </DashboardShell>
    </ProtectedRoute>
  );
}
