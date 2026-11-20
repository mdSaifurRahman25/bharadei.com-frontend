"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

function DashboardRedirectInner() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    if (user.role === "Admin") router.replace("/dashboard/admin");
    else if (user.role === "Owner") router.replace("/dashboard/owner");
    else router.replace("/dashboard/customer");
  }, [user, loading, router]);

  return (
    <div className="bd-container py-20 text-center text-sm text-[var(--body)]">
      Redirecting to your {user?.role || ""} dashboard...
    </div>
  );
}

export default function DashboardRedirectPage() {
  return (
    <ProtectedRoute>
      <DashboardRedirectInner />
    </ProtectedRoute>
  );
}
