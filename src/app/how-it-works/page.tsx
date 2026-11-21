import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CreditCard,
  PackageCheck,
  SearchCheck,
  UploadCloud,
} from "lucide-react";

const RENTER_STEPS = [
  {
    icon: <SearchCheck size={20} />,
    title: "1. Search & Filter",
    detail:
      "Browse approved equipment by category, city, rental period, or budget on the All Equipment page.",
  },
  {
    icon: <CalendarCheck2 size={20} />,
    title: "2. Select Rental Dates",
    detail:
      "Choose your start date, end date, and quantity. BharaDei calculates the exact rental total automatically.",
  },
  {
    icon: <CreditCard size={20} />,
    title: "3. Pay via Stripe",
    detail:
      "Complete checkout securely with Stripe. Your booking status updates immediately upon verification.",
  },
  {
    icon: <PackageCheck size={20} />,
    title: "4. Pick Up & Return",
    detail:
      "Coordinate pickup or delivery with the verified owner and track rental progress in your Customer Dashboard.",
  },
];

const OWNER_STEPS = [
  {
    icon: <UploadCloud size={20} />,
    title: "1. List Your Gear",
    detail:
      "Upload photos via imgbb, set daily/weekly/monthly rates, quantity, and rental terms from your Owner Dashboard.",
  },
  {
    icon: <PackageCheck size={20} />,
    title: "2. Admin Approval & Bookings",
    detail:
      "Once approved by an Admin, renters discover your gear, pay upfront via Stripe, and appear in your Rentals table.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[var(--bg)]">
      <section className="bd-hero-bg border-b border-[var(--line)] py-16 md:py-20">
        <div className="bd-container max-w-3xl space-y-4">
          <p className="bd-eyebrow">Platform Guide</p>
          <h1 className="bd-heading text-4xl sm:text-5xl">
            How BharaDei.com Works
          </h1>
          <p className="text-base sm:text-lg text-[var(--body)]">
            A streamlined, transparent rental workflow built for both project
            renters and verified equipment owners.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="bd-container space-y-14">
          <div className="space-y-6">
            <h2 className="bd-heading text-2xl md:text-3xl">
              For Customers (Renters)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {RENTER_STEPS.map((step) => (
                <div key={step.title} className="bd-card p-6 space-y-3 h-full">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--purple)]">
                    {step.icon}
                  </span>
                  <h3 className="text-lg font-extrabold text-[var(--ink-strong)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--body)] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="bd-heading text-2xl md:text-3xl">
              For Equipment Owners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {OWNER_STEPS.map((step) => (
                <div key={step.title} className="bd-card p-6 space-y-3 h-full">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-blue)] text-[var(--blue)]">
                    {step.icon}
                  </span>
                  <h3 className="text-lg font-extrabold text-[var(--ink-strong)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--body)] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/equipment" className="bd-btn-blue text-sm">
              Start Browsing Equipment
              <ArrowRight size={16} />
            </Link>
            <Link href="/register" className="bd-btn-outline text-sm">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
