"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth, type UserRole } from "@/components/providers/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function getRoleDashboard(role: UserRole) {
  if (role === "Admin") return "/dashboard/admin";
  if (role === "Owner") return "/dashboard/owner";
  return "/dashboard/customer";
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // CRITICAL: Never redirect while auth session is still loading/hydrating
    if (loading) return;
    if (!user) {
      const target = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${target}`);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="bd-container py-20">
        <div className="flex flex-col items-center justify-center gap-3 min-h-[45vh]">
          <div className="h-10 w-10 rounded-full border-4 border-[var(--surface-tint)] border-t-[var(--purple)] animate-spin" />
          <p className="text-sm font-semibold text-[var(--body)]">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="bd-container py-20">
        <div className="mx-auto max-w-md bd-card p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF4E0] text-[#8A5300]">
            <ShieldAlert size={24} />
          </div>
          <h1 className="bd-heading text-xl">Access Restricted</h1>
          <p className="text-sm text-[var(--body)]">
            Your account role (<span className="font-bold">{user.role}</span>)
            does not have permission to view this page.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href={getRoleDashboard(user.role)} className="bd-btn-primary text-sm">
              Go to My Dashboard
            </Link>
            <Link href="/" className="bd-btn-outline text-sm">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
