"use client";

import React, { useMemo, useState } from "react";
import { CalendarDays, CreditCard, MapPin, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import type { EquipmentItem } from "@/types/equipment";

interface BookingModalProps {
  equipment: EquipmentItem;
  open: boolean;
  onClose: () => void;
}

function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function BookingModal({
  equipment,
  open,
  onClose,
}: BookingModalProps) {
  const { user, token } = useAuth();
  const today = useMemo(() => getTodayIso(), []);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState(user?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const calculation = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return { valid: false, days: 0, billingUnits: 0, totalAmount: 0 };
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const days = Math.max(1, diffDays);

    let billingUnits = days;
    if (equipment.rentalType === "Weekly") {
      billingUnits = Math.max(1, Math.ceil(days / 7));
    } else if (equipment.rentalType === "Monthly") {
      billingUnits = Math.max(1, Math.ceil(days / 30));
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const totalAmount = billingUnits * equipment.rentalPrice * qty;

    return { valid: true, days, billingUnits, totalAmount };
  }, [startDate, endDate, quantity, equipment.rentalPrice, equipment.rentalType]);

  if (!open) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculation.valid) {
      toast.error("End date must be on or after the start date.");
      return;
    }
    if (quantity < 1 || quantity > equipment.availableQuantity) {
      toast.error(
        `Please select between 1 and ${equipment.availableQuantity} unit(s).`
      );
      return;
    }
    if (!contactNumber.trim() || !deliveryAddress.trim()) {
      toast.error("Contact number and delivery address are required.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/bookings/validate", {
        method: "POST",
        token,
        body: JSON.stringify({
          equipmentId: equipment.id,
          startDate,
          endDate,
          quantity,
          contactNumber: contactNumber.trim(),
          deliveryAddress: deliveryAddress.trim(),
        }),
      });

      const bookingPayload = {
        equipmentId: equipment.id,
        startDate,
        endDate,
        quantity,
        contactNumber: contactNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        notes: notes.trim(),
      };
      window.sessionStorage.setItem(
        "bharadei_pending_booking",
        JSON.stringify(bookingPayload)
      );

      // Initiate Stripe Checkout session
      const checkout = await apiFetch<{ success: boolean; url?: string }>(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          token,
          body: JSON.stringify(bookingPayload),
        }
      );

      if (checkout.url) {
        window.location.href = checkout.url;
        return;
      }

      toast.success("Booking validated! Redirecting to checkout...");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to validate booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bd-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <p className="bd-eyebrow">Rental Booking</p>
            <h2 id="booking-modal-title" className="bd-heading text-xl mt-1">
              {equipment.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-line)] text-[var(--body)] hover:text-[var(--ink-strong)]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label
                htmlFor="book-start"
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
              >
                <CalendarDays size={14} className="text-[var(--purple)]" />
                Rental Start Date
              </label>
              <input
                id="book-start"
                type="date"
                min={today}
                required
                value={startDate}
                onChange={(e) => {
                  const next = e.target.value;
                  setStartDate(next);
                  if (endDate < next) setEndDate(next);
                }}
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="book-end"
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
              >
                <CalendarDays size={14} className="text-[var(--purple)]" />
                Rental End Date
              </label>
              <input
                id="book-end"
                type="date"
                min={startDate || today}
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label
                htmlFor="book-qty"
                className="block text-xs font-bold text-[var(--ink)]"
              >
                Required Quantity (Max {equipment.availableQuantity})
              </label>
              <input
                id="book-qty"
                type="number"
                min={1}
                max={equipment.availableQuantity}
                required
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="book-phone"
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
              >
                <Phone size={14} className="text-[var(--purple)]" />
                Contact Number
              </label>
              <input
                id="book-phone"
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="book-address"
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]"
            >
              <MapPin size={14} className="text-[var(--purple)]" />
              Delivery Address
            </label>
            <textarea
              id="book-address"
              rows={2}
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="House, Road, Area, City"
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="book-notes"
              className="block text-xs font-bold text-[var(--ink)]"
            >
              Additional Notes (Optional)
            </label>
            <textarea
              id="book-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pickup timing, accessory requests, or gate instructions..."
              className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
            />
          </div>

          {/* Live Price Breakdown */}
          <div className="rounded-xl border border-[var(--card-line)] bg-[var(--surface-soft)] p-4 space-y-2 text-sm">
            <div className="flex justify-between text-[var(--body)]">
              <span>
                Rate (৳{equipment.rentalPrice.toLocaleString()} /{" "}
                {equipment.rentalType})
              </span>
              <span className="font-mono font-semibold">
                {calculation.billingUnits} period(s) &times; {quantity} unit(s)
              </span>
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)]">
              <span>Rental Duration</span>
              <span className="font-mono">{calculation.days} day(s)</span>
            </div>
            <div className="border-t border-[var(--line)] pt-2 flex justify-between items-center">
              <span className="font-extrabold text-[var(--ink-strong)]">
                Total Payable
              </span>
              <span className="text-xl font-extrabold font-mono text-[var(--purple)]">
                ৳{calculation.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="bd-btn-outline text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !calculation.valid}
              className="bd-btn-blue text-sm"
            >
              <CreditCard size={16} />
              {submitting ? "Processing..." : "Confirm & Pay with Stripe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
