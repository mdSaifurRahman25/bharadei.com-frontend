"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useAuth, type AuthUser } from "@/components/providers/AuthProvider";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

function getDefaultRedirect(role: AuthUser["role"]) {
  if (role === "Admin") return "/dashboard/admin";
  if (role === "Owner") return "/dashboard/owner";
  return "/dashboard/customer";
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);

  const handleCopy = async (value: string, field: "email" | "password") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success(`Copied ${field === "email" ? "Admin Email" : "Admin Password"}`);
      window.setTimeout(() => setCopiedField(null), 1500);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  const handleFillAdmin = () => {
    setEmail("admin@bharadei.com");
    setPassword("Admin@BharaDei2026");
    toast.success("Admin credentials filled. Click Login to continue.");
  };

  const redirectParam = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        user: AuthUser;
        token: string;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      setSession(res.user, res.token);

      await Swal.fire({
        icon: "success",
        title: `Welcome back, ${res.user.name}!`,
        text: "You have signed in to BharaDei.com successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      const target =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : getDefaultRedirect(res.user.role);
      router.push(target);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const callbackURL =
        redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      if (error) {
        toast.error(error.message || "Google sign-in is currently unavailable.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to connect to Google authentication."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="bd-hero-bg py-16 md:py-24">
      <div className="bd-container">
        <div className="mx-auto max-w-md bd-card p-8 space-y-6">
          <div className="space-y-2 text-center">
            <p className="bd-eyebrow">Member Access</p>
            <h1 className="bd-heading text-3xl">Welcome back</h1>
            <p className="text-sm text-[var(--body)]">
              Sign in to manage bookings, favorites, or your listed equipment.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="bd-btn-outline w-full py-2.5 text-sm"
          >
            <GoogleIcon />
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <div className="relative flex items-center justify-center">
            <span className="h-px w-full bg-[var(--line)]" />
            <span className="bg-[var(--surface)] px-3 text-xs font-mono uppercase text-[var(--muted)]">
              or
            </span>
            <span className="h-px w-full bg-[var(--line)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-[var(--ink)]"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-[var(--ink)]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] pl-10 pr-10 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bd-btn-primary w-full py-2.5 text-sm"
            >
              <LogIn size={16} />
              {submitting ? "Signing in..." : "Login to BharaDei"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--body)]">
            New to BharaDei.com?{" "}
            <Link
              href="/register"
              className="font-bold text-[var(--purple)] hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* Demo Admin Access Box for Examiner / Quick Testing */}
          <div className="rounded-xl border border-[var(--card-line)] bg-[var(--surface-soft)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--purple)]">
                <ShieldCheck size={15} />
                Demo Admin Access
              </span>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="rounded-md bg-[var(--purple-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--purple-hover)] transition-colors cursor-pointer"
              >
                Auto-fill Admin
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 rounded-lg border border-[var(--card-line)] bg-[var(--surface)] px-3 py-2">
                <div className="truncate">
                  <span className="font-semibold text-[var(--muted)] mr-1.5">
                    Email:
                  </span>
                  <code className="font-mono font-semibold text-[var(--ink-strong)]">
                    admin@bharadei.com
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("admin@bharadei.com", "email")}
                  aria-label="Copy Admin Email"
                  className="text-[var(--muted)] hover:text-[var(--purple)] shrink-0 cursor-pointer"
                >
                  {copiedField === "email" ? (
                    <Check size={14} className="text-[#16774A]" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-lg border border-[var(--card-line)] bg-[var(--surface)] px-3 py-2">
                <div className="truncate">
                  <span className="font-semibold text-[var(--muted)] mr-1.5">
                    Password:
                  </span>
                  <code className="font-mono font-semibold text-[var(--ink-strong)]">
                    Admin@BharaDei2026
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("Admin@BharaDei2026", "password")}
                  aria-label="Copy Admin Password"
                  className="text-[var(--muted)] hover:text-[var(--purple)] shrink-0 cursor-pointer"
                >
                  {copiedField === "password" ? (
                    <Check size={14} className="text-[#16774A]" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bd-container py-20 text-center text-sm text-[var(--muted)]">
          Loading login form...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
