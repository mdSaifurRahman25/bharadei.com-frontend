"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { OWNER_NAV } from "@/lib/dashboard-nav";

interface OwnerRentalRow {
  id: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string;
  equipmentName: string;
  equipmentCategory: string;
  startDate: string;
  endDate: string;
  days: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

function StatusBadge({ value }: { value: string }) {
  const lower = value.toLowerCase();
  let cls = "bg-[var(--surface-soft)] text-[var(--purple)]";
  if (lower === "paid" || lower === "confirmed" || lower === "completed") {
    cls = "bg-[#E8F6EF] text-[#16774A]";
  } else if (lower === "pending") {
    cls = "bg-[#FFF4E0] text-[#8A5300]";
  } else if (lower === "cancelled") {
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

function OwnerRentalsInner() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState<OwnerRentalRow[]>([]);
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
        rentals: OwnerRentalRow[];
        pagination: { totalPages: number };
      }>(`/api/owner/rentals?page=${page}&limit=10`, { token })
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

  const handleMarkCompleted = async (rentalId: string) => {
    try {
      await apiFetch(`/api/owner/rentals/${rentalId}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ bookingStatus: "Completed" }),
      });
      setRentals((prev) =>
        prev.map((r) =>
          r.id === rentalId ? { ...r, bookingStatus: "Completed" } : r
        )
      );
      toast.success("Rental marked as Completed and stock restored.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update booking status."
      );
    }
  };

  return (
    <DashboardShell
      title="My Equipment Rentals"
      subtitle="Track customer bookings, rental durations, payment statuses, and completions."
      navItems={OWNER_NAV}
    >
      <div className="bd-card overflow-hidden">
        <div className="p-5 border-b border-[var(--line)]">
          <h2 className="bd-heading text-lg">Incoming Equipment Bookings</h2>
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
            No bookings have been placed on your equipment yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-band)] text-xs font-mono uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="px-5 py-3.5">Customer Information</th>
                  <th className="px-5 py-3.5">Equipment Information</th>
                  <th className="px-5 py-3.5">Rental Duration</th>
                  <th className="px-5 py-3.5">Qty</th>
                  <th className="px-5 py-3.5">Booking Amount</th>
                  <th className="px-5 py-3.5">Payment Status</th>
                  <th className="px-5 py-3.5">Booking Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rentals.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[var(--bg-band)]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[var(--ink-strong)]">
                        {r.customerName}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {r.customerEmail}
                      </p>
                      {r.contactNumber && (
                        <p className="text-xs font-mono text-[var(--body)]">
                          {r.contactNumber}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[var(--ink-strong)]">
                        {r.equipmentName}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {r.equipmentCategory}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--body)]">
                      {new Date(r.startDate).toLocaleDateString()} &rarr;{" "}
                      {new Date(r.endDate).toLocaleDateString()}
                      <div className="text-[11px] text-[var(--muted)]">
                        {r.days} day(s)
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[var(--ink)]">
                      {r.quantity}
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
                    <td className="px-5 py-3.5 text-right">
                      {r.bookingStatus === "Confirmed" ? (
                        <button
                          type="button"
                          onClick={() => handleMarkCompleted(r.id)}
                          className="inline-flex items-center gap-1 rounded-[9px] bg-[#E8F6EF] px-3 py-1.5 text-xs font-bold text-[#16774A] hover:opacity-85 cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          Complete
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">—</span>
                      )}
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

export default function OwnerRentalsPage() {
  return (
    <ProtectedRoute allowedRoles={["Owner"]}>
      <OwnerRentalsInner />
    </ProtectedRoute>
  );
}
