"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/lib/dashboard-nav";

interface AdminRentalRow {
  id: string;
  customerName: string;
  customerEmail: string;
  ownerName: string;
  ownerEmail: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  days: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

function PaymentBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  let cls = "bg-[#FFF4E0] text-[#8A5300]";
  if (lower === "paid") cls = "bg-[#E8F6EF] text-[#16774A]";
  else if (lower === "cancelled") cls = "bg-[#FDECEA] text-[#B3261E]";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}
    >
      {status}
    </span>
  );
}

function AdminRentalsInner() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState<AdminRentalRow[]>([]);
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
        rentals: AdminRentalRow[];
        pagination: { totalPages: number };
      }>(`/api/admin/rentals?page=${page}&limit=10`, { token })
        .then((res) => {
          if (!active) return;
          setRentals(Array.isArray(res.rentals) ? res.rentals : []);
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

  const handleStatusChange = async (id: string, bookingStatus: string) => {
    try {
      await apiFetch(`/api/admin/rentals/${id}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ bookingStatus }),
      });
      setRentals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, bookingStatus } : r))
      );
      toast.success(`Booking status updated to ${bookingStatus}.`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update booking."
      );
    }
  };

  return (
    <DashboardShell
      title="All Platform Rentals"
      subtitle="Monitor and manage every rental booking across customers and equipment owners."
      navItems={ADMIN_NAV}
    >
      <div className="bd-card overflow-hidden">
        <div className="p-5 border-b border-[var(--line)]">
          <h2 className="bd-heading text-lg">Platform Rental Records</h2>
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
          <div className="p-10 text-center text-sm text-[var(--body)]">
            No rental bookings recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-band)] text-xs font-mono uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="px-5 py-3.5">Customer Information</th>
                  <th className="px-5 py-3.5">Owner Information</th>
                  <th className="px-5 py-3.5">Equipment Name</th>
                  <th className="px-5 py-3.5">Rental Duration</th>
                  <th className="px-5 py-3.5">Booking Amount</th>
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
                    <td className="px-5 py-3.5 text-xs">
                      <p className="font-bold text-[var(--ink-strong)]">
                        {r.customerName}
                      </p>
                      <p className="text-[var(--muted)]">{r.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <p className="font-bold text-[var(--ink-strong)]">
                        {r.ownerName}
                      </p>
                      <p className="text-[var(--muted)]">{r.ownerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[var(--ink-strong)]">
                      {r.equipmentName}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--body)]">
                      {new Date(r.startDate).toLocaleDateString()} &rarr;{" "}
                      {new Date(r.endDate).toLocaleDateString()}
                      <div className="text-[11px] text-[var(--muted)]">
                        {r.days}d · Qty {r.quantity}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[var(--ink-strong)]">
                      ৳{r.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentBadge status={r.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        aria-label={`Booking status for ${r.equipmentName}`}
                        value={r.bookingStatus}
                        onChange={(e) =>
                          handleStatusChange(r.id, e.target.value)
                        }
                        className="rounded-[8px] border border-[var(--card-line)] bg-[var(--bg)] px-2.5 py-1.5 text-xs font-bold text-[var(--ink)]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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

export default function AdminRentalsPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminRentalsInner />
    </ProtectedRoute>
  );
}
