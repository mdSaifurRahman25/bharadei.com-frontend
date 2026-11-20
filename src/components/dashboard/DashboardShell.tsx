"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarRange,
  Heart,
  Menu,
  Package,
  PlusCircle,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import type { DashboardNavItem } from "@/lib/dashboard-nav";

interface DashboardShellProps {
  title: string;
  subtitle: string;
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}

function NavIcon({ icon }: { icon: DashboardNavItem["icon"] }) {
  switch (icon) {
    case "rentals":
      return <CalendarRange size={17} />;
    case "favorites":
      return <Heart size={17} />;
    case "profile":
      return <UserCircle2 size={17} />;
    case "analytics":
      return <BarChart3 size={17} />;
    case "add":
      return <PlusCircle size={17} />;
    case "equipment":
      return <Package size={17} />;
    case "users":
      return <Users size={17} />;
  }
}

export default function DashboardShell({
  title,
  subtitle,
  navItems,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between gap-6">
      <div className="space-y-5">
        {/* User Profile Summary */}
        <div className="rounded-xl border border-[var(--card-line)] bg-[var(--surface-soft)] p-4 flex items-center gap-3">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-11 w-11 rounded-full object-cover border border-[var(--purple)]/40 shrink-0"
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-[var(--purple-2)] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[var(--ink-strong)] truncate">
              {user?.name}
            </p>
            <p className="text-[11px] font-mono font-semibold text-[var(--purple)] uppercase">
              {user?.role} Panel
            </p>
          </div>
        </div>

        <nav className="space-y-1.5" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5 text-sm font-bold transition-colors ${
                  active
                    ? "bg-[var(--purple-2)] text-white shadow-sm"
                    : "text-[var(--body)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink-strong)]"
                }`}
              >
                <NavIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-band)] p-3.5 text-xs text-[var(--muted)]">
        Signed in as{" "}
        <span className="font-semibold text-[var(--ink)] break-all">
          {user?.email}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[var(--bg-band)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Top bar for mobile/tablet + page heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <p className="bd-eyebrow">Dashboard</p>
            <h1 className="bd-heading text-2xl sm:text-3xl mt-1">{title}</h1>
            <p className="text-sm text-[var(--body)] mt-1">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden bd-btn-outline text-xs self-start"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            {sidebarOpen ? "Close Menu" : "Dashboard Menu"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Mobile Drawer */}
          {sidebarOpen && (
            <aside className="lg:hidden bd-card p-4">{sidebarContent}</aside>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 bd-card p-4 sticky top-24">
            {sidebarContent}
          </aside>

          {/* Main Full-Width Content */}
          <div className="lg:col-span-9 xl:col-span-10 space-y-6 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
