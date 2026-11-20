"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Package,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CUSTOMER_NAV } from "@/lib/dashboard-nav";

interface RentalItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

interface RentalSummary {
  totalBookings: number;
  activeRentals: number;
  completedRentals: number;
  totalSpent: number;
}

function StatusBadge({ value }: { value: string }) {
  const lower = value.toLowerCase();
  let cls = "bg-[var(--surface-soft)] text-[var(--purple)]";
  if (lower === "paid" || lower === "confirmed" || lower === "completed") {
    cls = "bg-[#E8F6EF] text-[#16774A]";
  } else if (lower === "pending") {
    cls = "bg-[#FFF4E0] text-[#8A5300]";
  } else if (lower === "cancelled" || lower === "rejected") {
    cls = "bg-[#FDECEA] text-[#B3261E]";
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}
    >
      {value}
    </span>
  );
}

function CustomerRentalsInner() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [summary, setSummary] = useState<RentalSummary>({
    totalBookings: 0,
    activeRentals: 0,
    completedRentals: 0,
    totalSpent: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let active = true;

    const timer = window.setTimeout(() => {
      if (!active) return;
      setLoading(true);
      apiFetch<{
        success: boolean;
        rentals: RentalItem[];
        summary: RentalSummary;
        pagination: { totalPages: number };
      }>(`/api/customer/rentals?page=${page}&limit=8`, { token })
        .then((res) => {
          if (!active) return;
          setRentals(Array.isArray(res.rentals) ? res.rentals : []);
          if (res.summary) setSummary(res.summary);
          if (res.pagination) setTotalPages(res.pagination.totalPages || 1);
        })
        .catch(() => {
          if (active) setRentals([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [token, page]);

  return (
    <DashboardShell
      title="My Rentals"
      subtitle="Track your active equipment bookings, payment receipts, and rental history."
      navItems={CUSTOMER_NAV}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bd-card p-5 space-y-1.5">
          <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
            <Package size={14} className="text-[var(--purple)]" />
            Total Bookings
          </p>
          <p className="text-2xl font-extrabold text-[var(--ink-strong)] font-mono">
            {summary.totalBookings}
          </p>
        </div>
        <div className="bd-card p-5 space-y-1.5">
          <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
            <Clock3 size={14} className="text-[var(--blue)]" />
            Active / Confirmed
          </p>
          <p className="text-2xl font-extrabold text-[var(--ink-strong)] font-mono">
            {summary.activeRentals}
          </p>
        </div>
        <div className="bd-card p-5 space-y-1.5">
          <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
            <CalendarCheck2 size={14} className="text-[#16774A]" />
            Completed Rentals
          </p>
          <p className="text-2xl font-extrabold text-[var(--ink-strong)] font-mono">
            {summary.completedRentals}
          </p>
        </div>
        <div className="bd-card p-5 space-y-1.5">
          <p className="text-xs font-mono uppercase text-[var(--muted)] flex items-center gap-1.5">
            <CreditCard size={14} className="text-[var(--purple)]" />
            Total Paid
          </p>
          <p className="text-2xl font-extrabold text-[var(--purple)] font-mono">
            ৳{summary.totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="bd-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[var(--line)]">
          <h2 className="bd-heading text-lg">Rental Booking History</h2>
          <Link href="/equipment" className="bd-btn-blue text-xs px-4 py-2">
            Rent New Equipment
          </Link>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg animate-pulse bg-[var(--bg-band)]"
              />
            ))}
          </div>
        ) : rentals.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-[var(--body)]">
              You have not booked any equipment yet.
            </p>
            <Link href="/equipment" className="bd-btn-primary text-sm">
              Explore Equipment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-band)] text-xs font-mono uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="px-5 py-3.5">Equipment Name</th>
                  <th className="px-5 py-3.5">Rental Start Date</th>
                  <th className="px-5 py-3.5">Rental End Date</th>
                  <th className="px-5 py-3.5">Booking Date</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Payment Status</th>
                  <th className="px-5 py-3.5">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rentals.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[var(--bg-band)]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-[var(--ink-strong)]">
                      <Link
                        href={`/equipment/${r.equipmentId}`}
                        className="hover:text-[var(--purple)]"
                      >
                        {r.equipmentName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--body)]">
                      {new Date(r.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--body)]">
                      {new Date(r.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--muted)]">
                      {new Date(r.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[var(--ink-strong)]">
                      ৳{r.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge value={r.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge value={r.bookingStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--line)]">
            <span className="text-xs font-mono text-[var(--muted)]">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="bd-btn-outline px-3 py-1.5 text-xs disabled:opacity-45"
              >
                <ChevronLeft size={14} />
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="bd-btn-outline px-3 py-1.5 text-xs disabled:opacity-45"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["Customer"]}>
      <CustomerRentalsInner />
    </ProtectedRoute>
  );
}
