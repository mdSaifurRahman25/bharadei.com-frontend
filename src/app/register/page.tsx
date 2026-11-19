"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Link2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgbb } from "@/lib/imgbb";
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

function validatePasswordClient(password: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoMode, setPhotoMode] = useState<"url" | "upload">("url");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const uploadedUrl = await uploadImageToImgbb(file);
      setPhotoUrl(uploadedUrl);
      toast.success("Profile photo uploaded to imgbb.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload photo."
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    const passwordError = validatePasswordClient(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        user: AuthUser;
        token: string;
      }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          image: photoUrl.trim(),
          password,
        }),
      });

      setSession(res.user, res.token);

      await Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Welcome to BharaDei.com. Your Customer account is ready.",
        timer: 1800,
        showConfirmButton: false,
      });

      router.push("/dashboard/customer");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });
      if (error) {
        toast.error(error.message || "Google sign-in is currently unavailable.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Google authentication failed."
      );
    }
  };

  return (
    <section className="bd-hero-bg py-14 md:py-20">
      <div className="bd-container">
        <div className="mx-auto max-w-md bd-card p-8 space-y-6">
          <div className="space-y-2 text-center">
            <p className="bd-eyebrow">Join BharaDei.com</p>
            <h1 className="bd-heading text-3xl">Create your account</h1>
            <p className="text-sm text-[var(--body)]">
              Start renting gear or apply to list your own equipment.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="bd-btn-outline w-full py-2.5 text-sm"
          >
            <GoogleIcon />
            Continue with Google
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
                htmlFor="reg-name"
                className="block text-sm font-semibold text-[var(--ink)]"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Md. Saifur Rahman"
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reg-email"
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
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--ink)]">
                  Profile Photo
                </label>
                <div className="inline-flex rounded-lg border border-[var(--card-line)] p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPhotoMode("url")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      photoMode === "url"
                        ? "bg-[var(--purple-2)] text-white"
                        : "text-[var(--body)]"
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode("upload")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      photoMode === "upload"
                        ? "bg-[var(--purple-2)] text-white"
                        : "text-[var(--body)]"
                    }`}
                  >
                    imgbb Upload
                  </button>
                </div>
              </div>

              {photoMode === "url" ? (
                <div className="relative">
                  <Link2
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://i.ibb.co/..."
                    className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                  />
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 rounded-[9px] border border-dashed border-[var(--purple)] bg-[var(--surface-soft)] px-4 py-3 text-xs font-semibold text-[var(--purple)] cursor-pointer hover:opacity-90">
                  <ImagePlus size={16} />
                  {uploadingPhoto
                    ? "Uploading to imgbb..."
                    : photoUrl
                      ? "Photo uploaded — click to replace"
                      : "Choose photo to upload via imgbb"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                    disabled={uploadingPhoto}
                  />
                </label>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reg-password"
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
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars, uppercase & lowercase"
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
              <p className="text-[11px] font-mono text-[var(--muted)]">
                Requires 6+ characters, 1 uppercase, and 1 lowercase letter.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingPhoto}
              className="bd-btn-primary w-full py-2.5 text-sm"
            >
              <UserPlus size={16} />
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--body)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--purple)] hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
