"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  XCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

interface VerifiedBooking {
  id: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}

interface VerifiedPayment {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const { token } = useAuth();

  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<VerifiedBooking | null>(null);
  const [payment, setPayment] = useState<VerifiedPayment | null>(null);

  useEffect(() => {
    if (!token) return;
    if (!sessionId) {
      const t = window.setTimeout(() => {
        setError("Missing Stripe session ID.");
        setVerifying(false);
      }, 0);
      return () => window.clearTimeout(t);
    }

    let active = true;
    apiFetch<{
      success: boolean;
      booking: VerifiedBooking;
      payment: VerifiedPayment;
    }>("/api/payments/verify", {
      method: "POST",
      token,
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => {
        if (!active) return;
        setBooking(res.booking);
        setPayment(res.payment);
        window.sessionStorage.removeItem("bharadei_pending_booking");
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Could not verify your payment."
        );
      })
      .finally(() => {
        if (active) setVerifying(false);
      });

    return () => {
      active = false;
    };
  }, [sessionId, token]);

  if (verifying) {
    return (
      <div className="bd-container py-24">
        <div className="mx-auto max-w-md bd-card p-10 text-center space-y-4">
          <div className="mx-auto h-10 w-10 rounded-full border-4 border-[var(--surface-tint)] border-t-[var(--purple)] animate-spin" />
          <h1 className="bd-heading text-xl">Confirming Stripe Payment...</h1>
          <p className="text-sm text-[var(--body)]">
            Please wait while we verify your transaction and confirm your rental.
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bd-container py-24">
        <div className="mx-auto max-w-md bd-card p-8 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDECEA] text-[#B3261E]">
            <XCircle size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="bd-heading text-2xl">Payment Verification Issue</h1>
            <p className="text-sm text-[var(--body)]">
              {error || "Unable to locate your booking confirmation."}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/customer" className="bd-btn-primary text-sm">
              Go to My Rentals
            </Link>
            <Link href="/equipment" className="bd-btn-outline text-sm">
              Browse Equipment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bd-hero-bg py-16 md:py-24">
      <div className="bd-container">
        <div className="mx-auto max-w-xl bd-card p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F6EF] text-[#16774A]">
              <CheckCircle2 size={30} />
            </div>
            <p className="bd-eyebrow">Payment Successful</p>
            <h1 className="bd-heading text-3xl">Booking Confirmed!</h1>
            <p className="text-sm text-[var(--body)]">
              Your Stripe payment has been verified and recorded. You can track
              this rental anytime from your Customer Dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--card-line)] bg-[var(--bg-band)] p-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Equipment</span>
              <span className="font-bold text-[var(--ink-strong)] text-right">
                {booking.equipmentName}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Rental Dates</span>
              <span className="font-mono text-xs font-semibold text-[var(--ink)]">
                {new Date(booking.startDate).toLocaleDateString()} &rarr;{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Quantity</span>
              <span className="font-mono font-semibold text-[var(--ink)]">
                {booking.quantity} unit(s)
              </span>
            </div>
            {payment?.transactionId && (
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Transaction ID</span>
                <span className="font-mono text-xs text-[var(--purple)] truncate max-w-[230px]">
                  {payment.transactionId}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-[var(--line)]">
              <span className="font-bold text-[var(--ink-strong)] flex items-center gap-1.5">
                <CreditCard size={15} className="text-[var(--purple)]" />
                Total Paid
              </span>
              <span className="text-xl font-extrabold font-mono text-[#16774A]">
                ৳{Number(booking.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/customer"
              className="bd-btn-primary flex-1 text-sm"
            >
              <LayoutDashboard size={16} />
              View My Rentals
            </Link>
            <Link href="/equipment" className="bd-btn-outline flex-1 text-sm">
              Browse More Equipment
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <ProtectedRoute allowedRoles={["Customer"]}>
      <Suspense
        fallback={
          <div className="bd-container py-20 text-center text-sm text-[var(--muted)]">
            Loading payment receipt...
          </div>
        }
      >
        <PaymentSuccessInner />
      </Suspense>
    </ProtectedRoute>
  );
}
