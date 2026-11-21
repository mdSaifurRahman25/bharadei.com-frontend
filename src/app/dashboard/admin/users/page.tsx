"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { useAuth, type AuthUser, type UserRole } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/lib/dashboard-nav";

function AdminUsersInner() {
  const { user: currentUser, token } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let active = true;

    apiFetch<{ success: boolean; users: AuthUser[] }>("/api/admin/users", {
      token,
    })
      .then((res) => {
        if (active) setUsers(Array.isArray(res.users) ? res.users : []);
      })
      .catch(() => {
        if (active) setUsers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleRoleChange = async (userId: string, nextRole: UserRole) => {
    try {
      const res = await apiFetch<{ success: boolean; user: AuthUser }>(
        `/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          token,
          body: JSON.stringify({ role: nextRole }),
        }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? res.user : u))
      );
      toast.success(`Role updated to ${nextRole}.`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update role."
      );
    }
  };

  const handleDeleteUser = async (target: AuthUser) => {
    if (!target.id) return;
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Remove User Account?",
      text: `Remove ${target.name} (${target.email}) from BharaDei.com?`,
      showCancelButton: true,
      confirmButtonColor: "#B3261E",
      confirmButtonText: "Remove User",
    });
    if (!confirm.isConfirmed) return;

    try {
      await apiFetch(`/api/admin/users/${target.id}`, {
        method: "DELETE",
        token,
      });
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      toast.success("User removed.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not remove user."
      );
    }
  };

  return (
    <DashboardShell
      title="All Users Management"
      subtitle="View registered members, promote Customers to Owners or Admins, and manage accounts."
      navItems={ADMIN_NAV}
    >
      <div className="bd-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[var(--line)]">
          <h2 className="bd-heading text-lg">Registered Platform Users</h2>
          <span className="text-xs font-mono text-[var(--muted)]">
            {users.length} total
          </span>
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-band)] text-xs font-mono uppercase text-[var(--muted)] border-b border-[var(--line)]">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Registration Date</th>
                  <th className="px-5 py-3.5 text-right">Manage Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {users.map((u) => {
                  const isSelf = u.email === currentUser?.email;
                  return (
                    <tr
                      key={u.id || u.email}
                      className="hover:bg-[var(--bg-band)]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-bold text-[var(--ink-strong)]">
                        {u.name}
                        {isSelf && (
                          <span className="ml-2 rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-mono text-[var(--purple)]">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--body)]">
                        {u.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          aria-label={`Change role for ${u.name}`}
                          disabled={isSelf}
                          value={u.role}
                          onChange={(e) =>
                            u.id &&
                            handleRoleChange(u.id, e.target.value as UserRole)
                          }
                          className="rounded-[8px] border border-[var(--card-line)] bg-[var(--bg)] px-2.5 py-1.5 text-xs font-bold text-[var(--ink)] disabled:opacity-60"
                        >
                          <option value="Customer">Customer</option>
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--muted)]">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(u)}
                          className="inline-flex items-center gap-1 rounded-[9px] bg-[#FDECEA] px-3 py-1.5 text-xs font-bold text-[#B3261E] hover:opacity-85 disabled:opacity-40 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminUsersInner />
    </ProtectedRoute>
  );
}
