"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCircle2,
  Coins,
  Package,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { OWNER_NAV } from "@/lib/dashboard-nav";

interface OwnerAnalytics {
  totalListedEquipment: number;
  approvedEquipment: number;
  pendingEquipment: number;
  totalBookings: number;
  activeRentals: number;
  completedRentals: number;
  totalEarnings: number;
  monthlyEarnings: Array<{
    key: string;
    month: string;
    earnings: number;
    bookings: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
}

function OwnerOverviewInner() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let active = true;

    apiFetch<{ success: boolean; analytics: OwnerAnalytics }>(
      "/api/owner/analytics",
      { token }
    )
      .then((res) => {
        if (active) setAnalytics(res.analytics);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <DashboardShell
      title="Owner Analytics & Overview"
      subtitle="Monitor your listed gear, rental velocity, and monthly earnings."
      navItems={OWNER_NAV}
    >
      <div className="flex justify-end">
        <Link
          href="/dashboard/owner/add-equipment"
          className="bd-btn-primary text-sm"
        >
          <PlusCircle size={16} />
          Add New Equipment
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bd-card h-28 animate-pulse bg-[var(--surface)]"
            />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <Package size={14} className="text-[var(--purple)]" />
                Listed Equipment
              </p>
              <p className="text-2xl font-extrabold text-[var(--ink-strong)] font-mono">
                {analytics?.totalListedEquipment ?? 0}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {analytics?.approvedEquipment ?? 0} approved ·{" "}
                {analytics?.pendingEquipment ?? 0} pending
              </p>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#16774A]" />
                Completed Rentals
              </p>
              <p className="text-2xl font-extrabold text-[var(--ink-strong)] font-mono">
                {analytics?.completedRentals ?? 0}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {analytics?.activeRentals ?? 0} active confirmed
              </p>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[var(--blue)]" />
                Total Bookings
              </p>
              <p className="text-2xl font-extrabold text-[var(--ink-strong)] font-mono">
                {analytics?.totalBookings ?? 0}
              </p>
              <p className="text-xs text-[var(--muted)]">All-time requests</p>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <Coins size={14} className="text-[var(--purple)]" />
                Total Earnings
              </p>
              <p className="text-2xl font-extrabold text-[var(--purple)] font-mono">
                ৳{(analytics?.totalEarnings ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-[var(--muted)]">Verified paid bookings</p>
            </div>
          </div>

          {/* Recharts Analytics Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 bd-card p-6 space-y-4">
              <div>
                <p className="bd-eyebrow">Revenue Trend</p>
                <h2 className="bd-heading text-lg mt-0.5">
                  Monthly Earnings (Last 6 Months)
                </h2>
              </div>
              <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.monthlyEarnings || []}>
                    <defs>
                      <linearGradient id="ownerEarn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7624F4" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#7624F4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      name="Earnings (৳)"
                      stroke="#7624F4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#ownerEarn)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="xl:col-span-5 bd-card p-6 space-y-4">
              <div>
                <p className="bd-eyebrow">Inventory Mix</p>
                <h2 className="bd-heading text-lg mt-0.5">
                  Equipment by Category
                </h2>
              </div>
              <div className="h-[290px] w-full">
                {analytics?.categoryBreakdown?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Listings"
                        fill="#0C50FB"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-[var(--muted)]">
                    Add equipment to visualize category distribution.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}

export default function OwnerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["Owner"]}>
      <OwnerOverviewInner />
    </ProtectedRoute>
  );
}
