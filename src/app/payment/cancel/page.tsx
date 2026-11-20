"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

function PaymentCancelInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id") || "";
  const { token } = useAuth();

  useEffect(() => {
    if (!token || !bookingId) return;
    apiFetch("/api/payments/cancel", {
      method: "POST",
      token,
      body: JSON.stringify({ bookingId }),
    }).catch(() => {});
  }, [bookingId, token]);

  return (
    <section className="bd-hero-bg py-20">
      <div className="bd-container">
        <div className="mx-auto max-w-md bd-card p-8 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF4E0] text-[#8A5300]">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-2">
            <p className="bd-eyebrow">Checkout Cancelled</p>
            <h1 className="bd-heading text-2xl">Payment Was Cancelled</h1>
            <p className="text-sm text-[var(--body)]">
              No charge was made to your card. You can return to the equipment
              catalog and book anytime.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/equipment" className="bd-btn-primary text-sm">
              <ShoppingBag size={16} />
              Browse Equipment
            </Link>
            <Link href="/dashboard/customer" className="bd-btn-outline text-sm">
              <ArrowLeft size={16} />
              Customer Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaymentCancelPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="bd-container py-20 text-center text-sm text-[var(--muted)]">
            Updating booking status...
          </div>
        }
      >
        <PaymentCancelInner />
      </Suspense>
    </ProtectedRoute>
  );
}
