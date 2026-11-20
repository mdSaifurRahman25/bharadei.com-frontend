"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CUSTOMER_NAV } from "@/lib/dashboard-nav";
import type { EquipmentItem } from "@/types/equipment";

interface FavoriteRecord {
  id: string;
  equipmentId: string;
  createdAt: string;
  equipment: EquipmentItem | null;
}

function CustomerFavoritesInner() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let active = true;

    apiFetch<{ success: boolean; favorites: FavoriteRecord[] }>(
      "/api/favorites",
      { token }
    )
      .then((res) => {
        if (active) {
          setFavorites(Array.isArray(res.favorites) ? res.favorites : []);
        }
      })
      .catch(() => {
        if (active) setFavorites([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleRemove = async (equipmentId: string) => {
    try {
      await apiFetch(`/api/favorites/${equipmentId}`, {
        method: "DELETE",
        token,
      });
      setFavorites((prev) =>
        prev.filter((item) => item.equipmentId !== equipmentId)
      );
      toast.success("Removed from favorites.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove favorite."
      );
    }
  };

  return (
    <DashboardShell
      title="Saved Favorites"
      subtitle="Quick access to equipment you bookmarked for upcoming projects."
      navItems={CUSTOMER_NAV}
    >
      <div className="bd-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--line)]">
          <h2 className="bd-heading text-lg">Favorite Equipment</h2>
          <span className="text-xs font-mono text-[var(--muted)]">
            {favorites.length} saved
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg animate-pulse bg-[var(--bg-band)]"
              />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-[var(--body)]">
              No favorites saved yet. Browse equipment and click the heart icon
              to save items here.
            </p>
            <Link href="/equipment" className="bd-btn-primary text-sm">
              Browse Equipment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-band)] text-xs font-mono uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="px-5 py-3.5">Equipment</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {favorites.map((fav) => (
                  <tr
                    key={fav.id}
                    className="hover:bg-[var(--bg-band)]/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-[var(--ink-strong)]">
                      {fav.equipment?.name || "Equipment Item"}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--body)]">
                      {fav.equipment?.category || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--body)]">
                      {fav.equipment?.location || "—"}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[var(--ink-strong)]">
                      ৳{Number(fav.equipment?.rentalPrice || 0).toLocaleString()}{" "}
                      <span className="text-xs font-normal text-[var(--muted)]">
                        / {fav.equipment?.rentalType || "Daily"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/equipment/${fav.equipmentId}`}
                          className="bd-btn-blue px-3 py-1.5 text-xs"
                        >
                          <Eye size={14} />
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(fav.equipmentId)}
                          className="inline-flex items-center gap-1 rounded-[9px] border border-[#FDECEA] bg-[#FDECEA] px-3 py-1.5 text-xs font-bold text-[#B3261E] hover:opacity-85 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Remove
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
    </DashboardShell>
  );
}

export default function CustomerFavoritesPage() {
  return (
    <ProtectedRoute allowedRoles={["Customer"]}>
      <CustomerFavoritesInner />
    </ProtectedRoute>
  );
}
