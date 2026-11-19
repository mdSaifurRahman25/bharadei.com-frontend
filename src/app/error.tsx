"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("BharaDei route error:", error);
  }, [error]);

  return (
    <div className="bd-container py-20">
      <div className="mx-auto max-w-lg bd-card p-8 text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDECEA] text-[#B3261E]">
          <AlertTriangle size={28} />
        </div>
        <div className="space-y-2">
          <p className="bd-eyebrow">Something went wrong</p>
          <h1 className="bd-heading text-2xl">We hit an unexpected error</h1>
          <p className="text-sm text-[var(--body)]">
            Please try refreshing this section or return to the BharaDei.com
            homepage.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button type="button" onClick={reset} className="bd-btn-primary text-sm">
            <RotateCcw size={16} />
            Try Again
          </button>
          <Link href="/" className="bd-btn-outline text-sm">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
