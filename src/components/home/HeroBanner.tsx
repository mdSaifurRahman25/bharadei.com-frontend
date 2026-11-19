"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function HeroBanner() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed
        ? `/equipment?search=${encodeURIComponent(trimmed)}`
        : "/equipment"
    );
  };

  return (
    <section className="bd-hero-bg border-b border-[var(--line)] overflow-hidden">
      <div className="bd-container py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Copy & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--purple)] shadow-sm">
              <Sparkles size={14} />
              Bangladesh&apos;s Trusted Equipment Rental Marketplace
            </div>

            <h1 className="bd-heading text-4xl sm:text-5xl xl:text-[54px]">
              Everything You Need,{" "}
              <span className="bg-gradient-to-r from-[#6A1FE0] to-[#0C50FB] bg-clip-text text-transparent">
                Ready to Rent.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--body)] leading-relaxed max-w-2xl">
              Rent verified cinema cameras, power tools, heavy machinery,
              vehicles, and event gear directly from trusted owners—without the
              heavy upfront cost of ownership.
            </p>

            {/* Inline Vibe96-style Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-[14px] border border-[var(--card-line)] bg-[var(--surface)] shadow-sm max-w-xl"
            >
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cameras, generators, drills, or Dhaka..."
                  className="w-full rounded-[9px] bg-transparent pl-10 pr-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none"
                />
              </div>
              <button type="submit" className="bd-btn-blue text-sm px-5 py-2.5">
                Find Equipment
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link href="/equipment" className="bd-btn-primary text-sm">
                Explore Marketplace
              </Link>
              <Link href="/register" className="bd-btn-outline text-sm">
                <ShieldCheck size={16} className="text-[var(--purple)]" />
                Join as Member
              </Link>
            </div>
          </motion.div>

          {/* Right Split Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-[20px] border border-[var(--card-line)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px]">
                <Image
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85"
                  alt="Professional camera and production equipment ready for rent on BharaDei.com"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-xl bg-[var(--surface-soft)] px-3 py-2.5">
                  <p className="text-lg font-extrabold text-[var(--ink-strong)] font-mono">
                    6+
                  </p>
                  <p className="text-[11px] font-semibold text-[var(--body)]">
                    Categories
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--surface-blue)] px-3 py-2.5">
                  <p className="text-lg font-extrabold text-[var(--blue)] font-mono">
                    100%
                  </p>
                  <p className="text-[11px] font-semibold text-[var(--body)]">
                    Stripe Safe
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--surface-soft)] px-3 py-2.5 flex flex-col items-center justify-center">
                  <Zap size={18} className="text-[var(--purple)] mb-0.5" />
                  <p className="text-[11px] font-semibold text-[var(--body)]">
                    Instant Book
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
