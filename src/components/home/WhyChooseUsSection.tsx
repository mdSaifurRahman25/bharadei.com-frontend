"use client";

import { motion } from "framer-motion";
import { BadgePercent, CalendarClock, LockKeyhole, ShieldCheck } from "lucide-react";

const BENEFITS = [
  {
    icon: <BadgePercent size={22} />,
    title: "Affordable Rental Prices",
    description:
      "Access flagship cameras, industrial drills, and heavy machinery at a fraction of purchase cost with transparent BDT rates.",
    tint: "bg-[#F4EEFE] text-[#7624F4]",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Verified Equipment Owners",
    description:
      "Every listing goes through admin verification before going live so you rent from trusted, accountable owners.",
    tint: "bg-[#E8F6EF] text-[#16774A]",
  },
  {
    icon: <CalendarClock size={22} />,
    title: "Flexible Rental Periods",
    description:
      "Choose Daily, Weekly, or Monthly plans tailored to single-day shoots, weekend events, or multi-week field jobs.",
    tint: "bg-[#EAF1FF] text-[#0C50FB]",
  },
  {
    icon: <LockKeyhole size={22} />,
    title: "Stripe-Secured Payments",
    description:
      "Pay confidently through Stripe Checkout with instant booking confirmation and full transaction tracking.",
    tint: "bg-[#FFF4E0] text-[#8A5300]",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-20 bg-[var(--bg)]">
      <div className="bd-container space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="bd-eyebrow">Why BharaDei.com</p>
          <h2 className="bd-heading text-3xl md:text-4xl">
            Built for Reliability &amp; Peace of Mind
          </h2>
          <p className="text-sm sm:text-base text-[var(--body)]">
            Whether you are scaling a construction project or shooting a
            commercial campaign, we remove ownership overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="bd-card flex flex-col justify-between h-full p-6 space-y-4"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${benefit.tint}`}
              >
                {benefit.icon}
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-[var(--ink-strong)]">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--body)]">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
