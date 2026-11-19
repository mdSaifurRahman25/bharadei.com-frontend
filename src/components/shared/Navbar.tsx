"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  X as CloseIcon,
} from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "./BrandLogo";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

function getDashboardPath(role?: string) {
  if (role === "Admin") return "/dashboard/admin";
  if (role === "Owner") return "/dashboard/owner";
  return "/dashboard/customer";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    toast.success("Signed out successfully.");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-md">
      <div className="bd-container flex h-[80px] items-center justify-between gap-4">
        <BrandLogo />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-semibold transition-colors ${
                  active
                    ? "text-[var(--purple)]"
                    : "text-[var(--body)] hover:text-[var(--ink-strong)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[9px] border border-[var(--card-line)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--purple)] hover:text-[var(--purple)] cursor-pointer"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {loading ? (
            <div className="h-10 w-36 animate-pulse rounded-[9px] bg-[var(--surface-soft)]" />
          ) : user ? (
            <>
              <Link
                href={getDashboardPath(user.role)}
                className="bd-btn-outline text-sm"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="bd-btn-primary text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 text-[15px] font-bold text-[var(--ink)] transition-colors hover:text-[var(--purple)]"
              >
                Login
              </Link>
              <Link href="/register" className="bd-btn-primary text-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[9px] border border-[var(--card-line)] bg-[var(--surface)] text-[var(--ink)]"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[9px] border border-[var(--card-line)] bg-[var(--surface)] text-[var(--ink)]"
          >
            {mobileOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--line)] bg-[var(--bg)] px-5 py-4 space-y-3">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    active
                      ? "bg-[var(--surface-soft)] text-[var(--purple)]"
                      : "text-[var(--body)] hover:bg-[var(--bg-band)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-2">
            {loading ? (
              <div className="h-10 w-full animate-pulse rounded-[9px] bg-[var(--surface-soft)]" />
            ) : user ? (
              <>
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setMobileOpen(false)}
                  className="bd-btn-outline text-sm w-full"
                >
                  <LayoutDashboard size={16} />
                  Dashboard ({user.role})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bd-btn-primary text-sm w-full"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="bd-btn-outline text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="bd-btn-primary text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
