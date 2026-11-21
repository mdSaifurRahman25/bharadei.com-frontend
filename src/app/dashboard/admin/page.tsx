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
  CalendarCheck2,
  Clock3,
  Coins,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/lib/dashboard-nav";

interface AdminAnalytics {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  pendingApprovals: number;
  completedRentals: number;
  totalRevenue: number;
  monthlyStats: Array<{
    key: string;
    month: string;
    bookings: number;
    revenue: number;
  }>;
  roleBreakdown: Array<{ role: string; count: number }>;
  equipmentStatusBreakdown: Array<{ status: string; count: number }>;
}

function AdminOverviewInner() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let active = true;

    apiFetch<{ success: boolean; analytics: AdminAnalytics }>(
      "/api/admin/analytics",
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
      title="Admin Platform Analytics"
      subtitle="Monitor marketplace users, pending equipment approvals, bookings, and total revenue."
      navItems={ADMIN_NAV}
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bd-card h-28 animate-pulse bg-[var(--surface)]"
            />
          ))}
        </div>
      ) : (
        <>
          {/* 6 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <Users size={14} className="text-[var(--purple)]" />
                Total Users
              </p>
              <p className="text-2xl font-extrabold font-mono text-[var(--ink-strong)]">
                {analytics?.totalUsers ?? 0}
              </p>
              <Link
                href="/dashboard/admin/users"
                className="text-xs font-bold text-[var(--purple)] hover:underline"
              >
                Manage users &rarr;
              </Link>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <Package size={14} className="text-[var(--blue)]" />
                Total Equipment
              </p>
              <p className="text-2xl font-extrabold font-mono text-[var(--ink-strong)]">
                {analytics?.totalEquipment ?? 0}
              </p>
              <Link
                href="/dashboard/admin/equipment"
                className="text-xs font-bold text-[var(--blue)] hover:underline"
              >
                Inspect listings &rarr;
              </Link>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <Clock3 size={14} className="text-[#8A5300]" />
                Pending Approvals
              </p>
              <p className="text-2xl font-extrabold font-mono text-[#8A5300]">
                {analytics?.pendingApprovals ?? 0}
              </p>
              <Link
                href="/dashboard/admin/equipment"
                className="text-xs font-bold text-[var(--purple)] hover:underline"
              >
                Review pending &rarr;
              </Link>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[var(--purple)]" />
                Total Bookings
              </p>
              <p className="text-2xl font-extrabold font-mono text-[var(--ink-strong)]">
                {analytics?.totalBookings ?? 0}
              </p>
              <Link
                href="/dashboard/admin/rentals"
                className="text-xs font-bold text-[var(--purple)] hover:underline"
              >
                View all rentals &rarr;
              </Link>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <CalendarCheck2 size={14} className="text-[#16774A]" />
                Completed Rentals
              </p>
              <p className="text-2xl font-extrabold font-mono text-[#16774A]">
                {analytics?.completedRentals ?? 0}
              </p>
              <p className="text-xs text-[var(--muted)]">Successfully fulfilled</p>
            </div>

            <div className="bd-card p-5 space-y-1.5">
              <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
                <Coins size={14} className="text-[var(--purple)]" />
                Total Revenue
              </p>
              <p className="text-2xl font-extrabold font-mono text-[var(--purple)]">
                ৳{(analytics?.totalRevenue ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-[var(--muted)]">Verified Stripe volume</p>
            </div>
          </div>

          {/* Recharts Analytics */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 bd-card p-6 space-y-4">
              <div>
                <p className="bd-eyebrow">Monthly Booking Statistics</p>
                <h2 className="bd-heading text-lg mt-0.5">
                  Platform Revenue &amp; Booking Volume (6 Months)
                </h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.monthlyStats || []}>
                    <defs>
                      <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
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
                      dataKey="revenue"
                      name="Revenue (৳)"
                      stroke="#7624F4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#adminRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="xl:col-span-5 bd-card p-6 space-y-4">
              <div>
                <p className="bd-eyebrow">Distribution</p>
                <h2 className="bd-heading text-lg mt-0.5">
                  Users &amp; Equipment Status
                </h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      ...(analytics?.roleBreakdown || []).map((r) => ({
                        label: `${r.role}s`,
                        count: r.count,
                      })),
                      ...(analytics?.equipmentStatusBreakdown || []).map((s) => ({
                        label: s.status,
                        count: s.count,
                      })),
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      name="Count"
                      fill="#0C50FB"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminOverviewInner />
    </ProtectedRoute>
  );
}
