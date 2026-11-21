"use client";

import React, { useEffect, useState } from "react";
import { Check, Pencil, Trash2, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/lib/dashboard-nav";
import { EQUIPMENT_CATEGORIES, type EquipmentItem } from "@/types/equipment";

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  let cls = "bg-[#FFF4E0] text-[#8A5300]";
  if (lower === "approved") cls = "bg-[#E8F6EF] text-[#16774A]";
  else if (lower === "rejected") cls = "bg-[#FDECEA] text-[#B3261E]";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}
    >
      {status}
    </span>
  );
}

function AdminEquipmentInner() {
  const { token } = useAuth();
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EquipmentItem | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;

    const timer = window.setTimeout(() => {
      if (!active) return;
      setLoading(true);
      const qs =
        statusFilter !== "All"
          ? `?status=${encodeURIComponent(statusFilter)}`
          : "";
      apiFetch<{ success: boolean; items: EquipmentItem[] }>(
        `/api/admin/equipment${qs}`,
        { token }
      )
        .then((res) => {
          if (active) setItems(Array.isArray(res.items) ? res.items : []);
        })
        .catch(() => {
          if (active) setItems([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [token, statusFilter]);

  const handleStatusChange = async (
    id: string,
    status: "Approved" | "Rejected"
  ) => {
    try {
      const res = await apiFetch<{ success: boolean; equipment: EquipmentItem }>(
        `/api/admin/equipment/${id}/status`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify({ status }),
        }
      );
      setItems((prev) =>
        prev.map((item) => (item.id === id ? res.equipment : item))
      );
      toast.success(`Equipment ${status.toLowerCase()}.`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status."
      );
    }
  };

  const handleDelete = async (item: EquipmentItem) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Equipment?",
      text: `Permanently delete "${item.name}"?`,
      showCancelButton: true,
      confirmButtonColor: "#B3261E",
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await apiFetch(`/api/admin/equipment/${item.id}`, {
        method: "DELETE",
        token,
      });
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      toast.success("Equipment deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete equipment."
      );
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await apiFetch<{ success: boolean; equipment: EquipmentItem }>(
        `/api/admin/equipment/${editing.id}`,
        {
          method: "PUT",
          token,
          body: JSON.stringify({
            name: editing.name,
            category: editing.category,
            location: editing.location,
            rentalPrice: Number(editing.rentalPrice),
            availableQuantity: Number(editing.availableQuantity),
            status: editing.status,
          }),
        }
      );
      setItems((prev) =>
        prev.map((x) => (x.id === editing.id ? res.equipment : x))
      );
      setEditing(null);
      toast.success("Equipment updated.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell
      title="All Equipment Moderation"
      subtitle="Approve, reject, update, or remove equipment listings across the platform."
      navItems={ADMIN_NAV}
    >
      <div className="bd-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[var(--line)]">
          <h2 className="bd-heading text-lg">Marketplace Equipment</h2>

          <div className="inline-flex rounded-[10px] border border-[var(--card-line)] bg-[var(--bg-band)] p-1">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-[7px] px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? "bg-[var(--purple-2)] text-white"
                    : "text-[var(--body)] hover:text-[var(--ink-strong)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
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
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--body)]">
            No equipment found under status &ldquo;{statusFilter}&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-band)] text-xs font-mono uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="px-5 py-3.5">Equipment</th>
                  <th className="px-5 py-3.5">Owner</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg-band)]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-[var(--ink-strong)]">
                      {item.name}
                      <div className="text-xs font-normal text-[var(--muted)]">
                        {item.location} · Qty: {item.availableQuantity}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[var(--body)]">
                      <p className="font-semibold text-[var(--ink)]">
                        {item.ownerName}
                      </p>
                      <p className="text-[var(--muted)]">{item.ownerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--body)]">
                      {item.category}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[var(--ink-strong)]">
                      ৳{item.rentalPrice.toLocaleString()}
                      <span className="text-xs font-normal text-[var(--muted)]">
                        /{item.rentalType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status !== "Approved" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(item.id, "Approved")
                            }
                            className="inline-flex items-center gap-1 rounded-[8px] bg-[#E8F6EF] px-2.5 py-1.5 text-xs font-bold text-[#16774A] cursor-pointer"
                          >
                            <Check size={13} />
                            Approve
                          </button>
                        )}
                        {item.status !== "Rejected" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(item.id, "Rejected")
                            }
                            className="inline-flex items-center gap-1 rounded-[8px] bg-[#FFF4E0] px-2.5 py-1.5 text-xs font-bold text-[#8A5300] cursor-pointer"
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditing({ ...item })}
                          className="bd-btn-blue px-2.5 py-1.5 text-xs"
                        >
                          <Pencil size={13} />
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1 rounded-[8px] bg-[#FDECEA] px-2.5 py-1.5 text-xs font-bold text-[#B3261E] cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bd-card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="bd-heading text-lg">Edit Equipment</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-[var(--muted)]"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm"
                  >
                    {EQUIPMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Status</label>
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({ ...editing, status: e.target.value })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editing.rentalPrice}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        rentalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editing.availableQuantity}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        availableQuantity: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="bd-btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bd-btn-primary text-xs"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function AdminEquipmentPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminEquipmentInner />
    </ProtectedRoute>
  );
}
