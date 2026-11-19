import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <section className="bd-hero-bg border-b border-[var(--line)]">
      <div className="bd-container py-20 md:py-28">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--purple)]">
            <Sparkles size={14} />
            Bangladesh&apos;s Smart Equipment Rental Marketplace
          </div>
          <h1 className="bd-heading text-4xl sm:text-5xl md:text-6xl">
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-[#6A1FE0] to-[#0C50FB] bg-clip-text text-transparent">
              Ready to Rent.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--body)] leading-relaxed max-w-2xl">
            BharaDei.com connects verified equipment owners with renters across
            cameras, power tools, construction machinery, vehicles, and event
            gear—with transparent pricing and Stripe-secured checkout.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/equipment" className="bd-btn-blue">
              Browse All Equipment
              <ArrowRight size={17} />
            </Link>
            <Link href="/register" className="bd-btn-outline">
              <ShieldCheck size={17} className="text-[var(--purple)]" />
              List Your Equipment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
