"use client";

import React, { useState } from "react";
import { ImagePlus, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { uploadImageToImgbb } from "@/lib/imgbb";
import { useAuth, type AuthUser } from "@/components/providers/AuthProvider";

export default function ProfileSection() {
  const { user, token, setSession } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToImgbb(file);
      setImage(url);
      toast.success("Profile photo uploaded to imgbb.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch<{ success: boolean; user: AuthUser }>(
        "/api/auth/profile",
        {
          method: "PUT",
          token,
          body: JSON.stringify({
            name: name.trim(),
            image: image.trim(),
            phone: phone.trim(),
            address: address.trim(),
          }),
        }
      );

      if (res.user) {
        setSession(res.user, token);
      }
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bd-card p-6 sm:p-8 max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[var(--line)] pb-5">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name || "Profile"}
            className="h-16 w-16 rounded-2xl object-cover border border-[var(--card-line)]"
          />
        ) : (
          <div className="h-16 w-16 rounded-2xl bg-[var(--surface-soft)] text-[var(--purple)] flex items-center justify-center font-extrabold text-xl">
            {name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div>
          <h2 className="bd-heading text-xl">{user?.name}</h2>
          <p className="text-sm text-[var(--body)]">{user?.email}</p>
          <span className="inline-block mt-1 rounded-full bg-[var(--surface-soft)] px-2.5 py-0.5 text-[11px] font-mono font-bold text-[var(--purple)]">
            {user?.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="prof-name"
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
            >
              <User size={14} className="text-[var(--purple)]" />
              Full Name
            </label>
            <input
              id="prof-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="prof-email"
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
            >
              <Mail size={14} className="text-[var(--purple)]" />
              Email Address
            </label>
            <input
              id="prof-email"
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg-band)] px-3.5 py-2.5 text-sm text-[var(--muted)] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="prof-phone"
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
            >
              <Phone size={14} className="text-[var(--purple)]" />
              Phone Number
            </label>
            <input
              id="prof-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 17XX-XXXXXX"
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="prof-image"
              className="block text-xs font-bold text-[var(--ink)]"
            >
              Profile Image URL (or upload below)
            </label>
            <input
              id="prof-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 rounded-[9px] border border-dashed border-[var(--purple)] bg-[var(--surface-soft)] px-4 py-2 text-xs font-bold text-[var(--purple)] cursor-pointer hover:opacity-90">
            <ImagePlus size={15} />
            {uploading ? "Uploading to imgbb..." : "Upload New Photo via imgbb"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="prof-address"
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
          >
            <MapPin size={14} className="text-[var(--purple)]" />
            Address
          </label>
          <textarea
            id="prof-address"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House, Road, Area, City"
            className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="bd-btn-primary text-sm"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
