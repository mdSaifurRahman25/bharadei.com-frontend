"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function ClosingCtaSection() {
  return (
    <section
      className="py-16 md:py-20 text-white"
      style={{
        background:
          "linear-gradient(100deg, #7921F4 0%, #6A22EC 45%, #5725DC 80%, #4D25D7 100%)",
      }}
    >
      <div className="bd-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-white/80">
              Ready to Get Started?
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Rent smarter for your next project—or earn from idle gear you own.
            </h2>
            <p className="text-sm sm:text-base text-white/85">
              Join thousands of creators, contractors, and equipment owners
              across Bangladesh on BharaDei.com.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 rounded-[10px] bg-white px-5 py-3 text-sm font-extrabold text-[#5B14CF] shadow-md transition-transform hover:scale-[1.02]"
            >
              Browse Equipment
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ShieldCheck size={16} />
              Create Free Account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
