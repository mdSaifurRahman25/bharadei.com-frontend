"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api";
import { uploadImageToImgbb } from "@/lib/imgbb";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { OWNER_NAV } from "@/lib/dashboard-nav";
import { EQUIPMENT_CATEGORIES } from "@/types/equipment";

function AddEquipmentInner() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(EQUIPMENT_CATEGORIES[0]);
  const [location, setLocation] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [rentalType, setRentalType] = useState("Daily");
  const [availableQuantity, setAvailableQuantity] = useState("1");
  const [condition, setCondition] = useState("Like New");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [image, setImage] = useState("");
  const [rentalTerms, setRentalTerms] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToImgbb(file);
      setImage(url);
      toast.success("Equipment image uploaded to imgbb.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim()) {
      toast.error("Please upload an equipment image via imgbb or provide an image URL.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/owner/equipment", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
          rentalPrice: Number(rentalPrice),
          rentalType,
          availableQuantity: Number(availableQuantity),
          condition,
          brand: brand.trim(),
          model: model.trim(),
          image: image.trim(),
          rentalTerms: rentalTerms.trim(),
        }),
      });

      await Swal.fire({
        icon: "success",
        title: "Equipment Listed!",
        text: "Your listing was submitted with Pending status for Admin approval.",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard/owner/my-equipment");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add equipment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell
      title="Add New Equipment"
      subtitle="Submit equipment details and upload an image via imgbb for marketplace approval."
      navItems={OWNER_NAV}
    >
      <div className="bd-card p-6 sm:p-8 max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
          <div>
            <p className="text-xs font-mono uppercase text-[var(--muted)]">
              Owner Information
            </p>
            <p className="text-sm font-bold text-[var(--ink-strong)]">
              {user?.name} ({user?.email})
            </p>
          </div>
          <span className="rounded-full bg-[#FFF4E0] px-3 py-1 text-xs font-bold text-[#8A5300]">
            Initial Status: Pending
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Equipment Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Canon EOS R5 Cinema Body"
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              >
                {EQUIPMENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--ink)]">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include key specs, included accessories, and ideal use cases..."
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Banani, Dhaka"
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Rental Price (৳)
              </label>
              <input
                type="number"
                min={1}
                required
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
                placeholder="3500"
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Rental Type
              </label>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Available Quantity
              </label>
              <input
                type="number"
                min={0}
                required
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Equipment Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Brand
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Canon / Bosch / DJI"
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Model
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="EOS R5 / GBH 2-26"
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>
          </div>

          {/* Equipment Image Upload via imgbb */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[var(--ink)]">
              Equipment Image (Upload via imgbb)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="inline-flex items-center justify-center gap-2 rounded-[9px] border border-dashed border-[var(--purple)] bg-[var(--surface-soft)] px-4 py-2.5 text-xs font-bold text-[var(--purple)] cursor-pointer hover:opacity-90 shrink-0">
                <ImagePlus size={16} />
                {uploading ? "Uploading to imgbb..." : "Upload Image (imgbb)"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>

              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Or paste hosted image URL (https://i.ibb.co/...)"
                className="flex-1 rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            {image && (
              <div className="pt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Equipment preview"
                  className="h-36 w-56 rounded-xl object-cover border border-[var(--card-line)]"
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--ink)]">
              Rental Terms &amp; Conditions
            </label>
            <textarea
              rows={3}
              required
              value={rentalTerms}
              onChange={(e) => setRentalTerms(e.target.value)}
              placeholder="NID verification, security deposit notes, care & late-return terms..."
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="bd-btn-primary text-sm"
          >
            <PlusCircle size={16} />
            {submitting ? "Submitting..." : "Submit Equipment Listing"}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}

export default function OwnerAddEquipmentPage() {
  return (
    <ProtectedRoute allowedRoles={["Owner"]}>
      <AddEquipmentInner />
    </ProtectedRoute>
  );
}
