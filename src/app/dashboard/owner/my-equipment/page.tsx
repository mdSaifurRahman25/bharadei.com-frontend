"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { OWNER_NAV } from "@/lib/dashboard-nav";
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

function OwnerMyEquipmentInner() {
  const { token } = useAuth();
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;

    apiFetch<{ success: boolean; items: EquipmentItem[] }>(
      "/api/owner/equipment",
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

    return () => {
      active = false;
    };
  }, [token]);

  const handleDelete = async (item: EquipmentItem) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Equipment?",
      text: `Are you sure you want to remove "${item.name}"?`,
      showCancelButton: true,
      confirmButtonColor: "#B3261E",
      confirmButtonText: "Yes, delete it",
    });
    if (!confirm.isConfirmed) return;

    try {
      await apiFetch(`/api/owner/equipment/${item.id}`, {
        method: "DELETE",
        token,
      });
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      toast.success("Equipment deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete equipment."
      );
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSavingEdit(true);
    try {
      const res = await apiFetch<{ success: boolean; equipment: EquipmentItem }>(
        `/api/owner/equipment/${editingItem.id}`,
        {
          method: "PUT",
          token,
          body: JSON.stringify({
            name: editingItem.name,
            category: editingItem.category,
            location: editingItem.location,
            rentalPrice: Number(editingItem.rentalPrice),
            rentalType: editingItem.rentalType,
            availableQuantity: Number(editingItem.availableQuantity),
            description: editingItem.description,
          }),
        }
      );

      setItems((prev) =>
        prev.map((x) => (x.id === editingItem.id ? res.equipment : x))
      );
      setEditingItem(null);
      toast.success("Equipment updated successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update equipment."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <DashboardShell
      title="My Equipment"
      subtitle="Manage your listed gear, pricing, stock availability, and approval status."
      navItems={OWNER_NAV}
    >
      <div className="bd-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[var(--line)]">
          <h2 className="bd-heading text-lg">Your Equipment Listings</h2>
          <Link
            href="/dashboard/owner/add-equipment"
            className="bd-btn-primary text-xs px-4 py-2"
          >
            <PlusCircle size={15} />
            Add Equipment
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
        ) : items.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-[var(--body)]">
              You haven&apos;t listed any equipment yet.
            </p>
            <Link
              href="/dashboard/owner/add-equipment"
              className="bd-btn-primary text-sm"
            >
              Add Your First Listing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-band)] text-xs font-mono uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="px-5 py-3.5">Equipment Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Rental Price</th>
                  <th className="px-5 py-3.5">Available Qty</th>
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
                    </td>
                    <td className="px-5 py-3.5 text-[var(--body)]">
                      {item.category}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[var(--ink-strong)]">
                      ৳{item.rentalPrice.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-[var(--muted)]">
                        / {item.rentalType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[var(--body)]">
                      {item.availableQuantity}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/equipment/${item.id}`}
                          className="bd-btn-outline px-2.5 py-1.5 text-xs"
                          title="View Details"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...item })}
                          className="bd-btn-blue px-2.5 py-1.5 text-xs"
                        >
                          <Pencil size={14} />
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1 rounded-[9px] bg-[#FDECEA] px-2.5 py-1.5 text-xs font-bold text-[#B3261E] hover:opacity-85 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Delete
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

      {/* Update Equipment Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bd-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="bd-heading text-lg">Update Equipment</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-[var(--muted)] hover:text-[var(--ink-strong)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  Equipment Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)]"
                  >
                    {EQUIPMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.location}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        location: e.target.value,
                      })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingItem.rentalPrice}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        rentalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Rental Type
                  </label>
                  <select
                    value={editingItem.rentalType}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        rentalType: e.target.value,
                      })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)]"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingItem.availableQuantity}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        availableQuantity: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bd-btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="bd-btn-primary text-xs"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function OwnerMyEquipmentPage() {
  return (
    <ProtectedRoute allowedRoles={["Owner"]}>
      <OwnerMyEquipmentInner />
    </ProtectedRoute>
  );
}
