import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bd-container py-24">
      <div className="mx-auto max-w-lg bd-card p-10 text-center space-y-5">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--purple)]">
          <Compass size={28} />
        </div>
        <div className="space-y-2">
          <p className="bd-eyebrow">404 — Page Not Found</p>
          <h1 className="bd-heading text-3xl">This route could not be found</h1>
          <p className="text-sm text-[var(--body)]">
            The equipment listing or page you are looking for may have moved or
            is no longer available.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/" className="bd-btn-primary text-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link href="/equipment" className="bd-btn-outline text-sm">
            Browse Equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
