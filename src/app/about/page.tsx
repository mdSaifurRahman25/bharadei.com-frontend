import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Users } from "lucide-react";

const PILLARS = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Admin-Verified Inventory",
    description:
      "Every piece of equipment is reviewed before appearing on BharaDei.com so renters work with reliable tools and accurate specs.",
  },
  {
    icon: <Users size={22} />,
    title: "Empowering Local Owners",
    description:
      "Production houses, contractors, and equipment owners across Bangladesh turn idle inventory into recurring monthly income.",
  },
  {
    icon: <Globe2 size={22} />,
    title: "Nationwide Coverage",
    description:
      "From Dhaka and Chattogram to Sylhet and Bogura, discover specialized gear close to your project site.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--bg)]">
      <section className="bd-hero-bg border-b border-[var(--line)] py-16 md:py-24">
        <div className="bd-container max-w-4xl space-y-5">
          <p className="bd-eyebrow">About BharaDei.com</p>
          <h1 className="bd-heading text-4xl sm:text-5xl">
            Rent what you need, lend what you own.
          </h1>
          <p className="text-base sm:text-lg text-[var(--body)] leading-relaxed">
            BharaDei.com is Bangladesh&apos;s smart equipment rental marketplace
            built to eliminate unnecessary ownership costs. Whether you need a
            cinema camera for a two-day commercial shoot or an industrial
            generator for a week-long event, BharaDei connects you directly with
            verified owners through transparent pricing and Stripe-secured
            checkout.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/equipment" className="bd-btn-blue text-sm">
              Browse All Equipment
              <ArrowRight size={16} />
            </Link>
            <Link href="/how-it-works" className="bd-btn-outline text-sm">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="bd-container space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="bd-card p-6 space-y-3 h-full">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--purple)]">
                  {pillar.icon}
                </span>
                <h2 className="bd-heading text-xl">{pillar.title}</h2>
                <p className="text-sm leading-relaxed text-[var(--body)]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bd-card p-8 bg-[var(--bg-band)] space-y-4">
            <h2 className="bd-heading text-2xl">
              Why Teams Choose BharaDei.com
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--body)]">
              {[
                "Daily, Weekly, and Monthly flexible rental plans",
                "Real-time stock availability and transparent BDT pricing",
                "Role-based dashboards for Customers, Owners, and Admins",
                "Stripe Checkout with verified transaction history",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#16774A] shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
