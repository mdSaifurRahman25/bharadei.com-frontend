"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Heart,
  Layers,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Tag,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import BookingModal from "@/components/equipment/BookingModal";
import type { EquipmentItem } from "@/types/equipment";

interface EquipmentDetailsClientProps {
  equipmentId: string;
}

function EquipmentDetailsInner({ equipmentId }: EquipmentDetailsClientProps) {
  const { user, token } = useAuth();
  const [equipment, setEquipment] = useState<EquipmentItem | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favBusy, setFavBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;

    Promise.all([
      apiFetch<{ success: boolean; equipment: EquipmentItem }>(
        `/api/equipment/${equipmentId}`,
        { token }
      ),
      apiFetch<{ success: boolean; isFavorite: boolean }>(
        `/api/favorites/check/${equipmentId}`,
        { token }
      ).catch(() => ({ success: true, isFavorite: false })),
    ])
      .then(([eqRes, favRes]) => {
        if (!active) return;
        setEquipment(eqRes.equipment);
        setIsFavorite(Boolean(favRes.isFavorite));
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load equipment details."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [equipmentId, token]);

  const handleToggleFavorite = async () => {
    if (!equipment || !token) return;
    if (user?.role !== "Customer") {
      toast.error("Only Customer accounts can save favorites.");
      return;
    }

    setFavBusy(true);
    try {
      if (isFavorite) {
        await apiFetch(`/api/favorites/${equipment.id}`, {
          method: "DELETE",
          token,
        });
        setIsFavorite(false);
        toast.success("Removed from your favorites.");
      } else {
        await apiFetch("/api/favorites", {
          method: "POST",
          token,
          body: JSON.stringify({ equipmentId: equipment.id }),
        });
        setIsFavorite(true);
        toast.success("Saved to your favorites!");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update favorites."
      );
    } finally {
      setFavBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="bd-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 rounded-2xl animate-pulse bg-[var(--surface-soft)]" />
          <div className="lg:col-span-5 h-96 rounded-2xl animate-pulse bg-[var(--surface-soft)]" />
        </div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="bd-container py-20">
        <div className="mx-auto max-w-md bd-card p-8 text-center space-y-4">
          <h1 className="bd-heading text-2xl">Equipment Unavailable</h1>
          <p className="text-sm text-[var(--body)]">
            {error || "This equipment listing could not be loaded."}
          </p>
          <Link href="/equipment" className="bd-btn-primary text-sm">
            <ArrowLeft size={16} />
            Back to All Equipment
          </Link>
        </div>
      </div>
    );
  }

  const inStock = equipment.availableQuantity > 0;

  return (
    <div className="bg-[var(--bg)] py-12">
      <div className="bd-container space-y-8">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--body)] hover:text-[var(--purple)]"
        >
          <ArrowLeft size={16} />
          Back to All Equipment
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Image + Description + Terms */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-[var(--card-line)] bg-[var(--surface-soft)]">
              <Image
                src={
                  equipment.image ||
                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85"
                }
                alt={equipment.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>

            <div className="bd-card p-6 space-y-4">
              <h2 className="bd-heading text-xl">Equipment Overview</h2>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--body)]">
                {equipment.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-[var(--bg-band)] p-3 border border-[var(--line)]">
                  <p className="text-[11px] font-mono uppercase text-[var(--muted)]">
                    Brand
                  </p>
                  <p className="text-sm font-bold text-[var(--ink-strong)] mt-0.5">
                    {equipment.brand || "Standard"}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--bg-band)] p-3 border border-[var(--line)]">
                  <p className="text-[11px] font-mono uppercase text-[var(--muted)]">
                    Model
                  </p>
                  <p className="text-sm font-bold text-[var(--ink-strong)] mt-0.5">
                    {equipment.model || "Verified"}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--bg-band)] p-3 border border-[var(--line)]">
                  <p className="text-[11px] font-mono uppercase text-[var(--muted)]">
                    Condition
                  </p>
                  <p className="text-sm font-bold text-[var(--ink-strong)] mt-0.5">
                    {equipment.condition}
                  </p>
                </div>
              </div>
            </div>

            <div className="bd-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-[var(--purple)]">
                <ShieldCheck size={18} />
                <h2 className="bd-heading text-lg">
                  Rental Terms &amp; Conditions
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-[var(--body)]">
                {equipment.rentalTerms ||
                  "Valid national ID verification is required upon pickup. Equipment must be returned on schedule in the same working condition."}
              </p>
            </div>
          </div>

          {/* Right Pricing, Actions & Owner Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bd-card p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-bold text-[var(--purple)]">
                  <Tag size={13} />
                  {equipment.category}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                    inStock
                      ? "bg-[#E8F6EF] text-[#16774A]"
                      : "bg-[#FDECEA] text-[#B3261E]"
                  }`}
                >
                  {inStock ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  {inStock
                    ? `${equipment.availableQuantity} Available`
                    : "Out of Stock"}
                </span>
              </div>

              <h1 className="bd-heading text-2xl sm:text-3xl">
                {equipment.name}
              </h1>

              <div className="flex items-baseline gap-2 border-y border-[var(--line)] py-4">
                <span className="text-3xl font-extrabold font-mono text-[var(--ink-strong)]">
                  ৳{equipment.rentalPrice.toLocaleString()}
                </span>
                <span className="text-sm font-mono uppercase text-[var(--muted)]">
                  / {equipment.rentalType}
                </span>
              </div>

              <ul className="space-y-2.5 text-sm text-[var(--body)]">
                <li className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-[var(--purple)] shrink-0" />
                  <span>Location: {equipment.location}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Layers size={16} className="text-[var(--purple)] shrink-0" />
                  <span>Rental Type: {equipment.rentalType}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Package size={16} className="text-[var(--purple)] shrink-0" />
                  <span>
                    Available Quantity: {equipment.availableQuantity} unit(s)
                  </span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={!inStock}
                  onClick={() => {
                    if (user?.role !== "Customer") {
                      toast.error(
                        "Please sign in with a Customer account to place a rental booking."
                      );
                      return;
                    }
                    setBookingOpen(true);
                  }}
                  className="bd-btn-blue flex-1 py-3 text-sm disabled:opacity-50"
                >
                  <CalendarCheck size={17} />
                  {inStock ? "Book Now" : "Currently Unavailable"}
                </button>

                <button
                  type="button"
                  disabled={favBusy}
                  onClick={handleToggleFavorite}
                  className={`bd-btn-outline py-3 text-sm ${
                    isFavorite
                      ? "border-[#B3261E] text-[#B3261E] bg-[#FDECEA]/50"
                      : ""
                  }`}
                >
                  <Heart
                    size={17}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                  {isFavorite ? "Saved" : "Favorite"}
                </button>
              </div>
            </div>

            {/* Owner Card */}
            <div className="bd-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--purple)]">
                  <UserCheck size={20} />
                </span>
                <div>
                  <p className="text-xs font-mono uppercase text-[var(--muted)]">
                    Equipment Owner
                  </p>
                  <h3 className="text-base font-extrabold text-[var(--ink-strong)]">
                    {equipment.ownerName || "Verified Owner"}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[var(--body)] border-t border-[var(--line)] pt-3">
                {equipment.ownerEmail && (
                  <p className="flex items-center gap-2">
                    <Mail size={15} className="text-[var(--purple)]" />
                    <span>{equipment.ownerEmail}</span>
                  </p>
                )}
                {equipment.ownerPhone && (
                  <p className="flex items-center gap-2">
                    <Phone size={15} className="text-[var(--purple)]" />
                    <span>{equipment.ownerPhone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        equipment={equipment}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}

export default function EquipmentDetailsClient({
  equipmentId,
}: EquipmentDetailsClientProps) {
  return (
    <ProtectedRoute>
      <EquipmentDetailsInner equipmentId={equipmentId} />
    </ProtectedRoute>
  );
}
