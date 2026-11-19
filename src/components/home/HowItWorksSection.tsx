"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, CreditCard, PackageCheck, SearchCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: <SearchCheck size={20} />,
    title: "Browse & Filter Gear",
    description:
      "Search by equipment name, category, location, rental type, or price range to find the exact tool you need.",
  },
  {
    step: "02",
    icon: <CalendarCheck2 size={20} />,
    title: "Select Dates & Quantity",
    description:
      "Pick your rental start and end dates, enter delivery details, and preview the automatically calculated total.",
  },
  {
    step: "03",
    icon: <CreditCard size={20} />,
    title: "Pay Securely via Stripe",
    description:
      "Complete checkout in seconds through Stripe. Your booking and transaction receipt are logged immediately.",
  },
  {
    step: "04",
    icon: <PackageCheck size={20} />,
    title: "Pick Up, Work & Return",
    description:
      "Coordinate pickup or delivery with the verified owner, get the job done, and return smoothly on schedule.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-20 bg-[var(--bg)]">
      <div className="bd-container space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="bd-eyebrow">Simple 4-Step Flow</p>
          <h2 className="bd-heading text-3xl md:text-4xl">How BharaDei Works</h2>
          <p className="text-sm sm:text-base text-[var(--body)]">
            From discovery to verified payment and equipment return—built to be
            fast and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="bd-card flex flex-col justify-between h-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--purple)]">
                  {item.icon}
                </span>
                <span className="font-mono text-xs font-bold text-[var(--muted)]">
                  STEP {item.step}
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-[var(--ink-strong)]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--body)]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
