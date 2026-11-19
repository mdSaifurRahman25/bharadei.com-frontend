"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Cpu,
  Hammer,
  Mic2,
  Tractor,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  EQUIPMENT_CATEGORIES,
  type CategorySummary,
} from "@/types/equipment";

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; subtitle: string; tint: string }
> = {
  "Construction Equipment": {
    icon: <Hammer size={22} />,
    subtitle: "Drills, mixers, scaffolding & site generators",
    tint: "bg-[#FFF4E0] text-[#8A5300]",
  },
  "Photography Equipment": {
    icon: <Camera size={22} />,
    subtitle: "Mirrorless cameras, lenses, gimbals & studio lights",
    tint: "bg-[#F4EEFE] text-[#7624F4]",
  },
  "Vehicles & Transportation": {
    icon: <Truck size={22} />,
    subtitle: "HiAce vans, cargo pickups & crew transport",
    tint: "bg-[#EAF1FF] text-[#0C50FB]",
  },
  "Agriculture Equipment": {
    icon: <Tractor size={22} />,
    subtitle: "Tractors, tillers, sprayers & farm machinery",
    tint: "bg-[#E8F6EF] text-[#16774A]",
  },
  Electronics: {
    icon: <Cpu size={22} />,
    subtitle: "Drones, laser projectors, workstations & audio",
    tint: "bg-[#F4EEFE] text-[#4B1FA8]",
  },
  "Event Equipment": {
    icon: <Mic2 size={22} />,
    subtitle: "PA sound rigs, mixers, stage lighting & tents",
    tint: "bg-[#FDECEA] text-[#B3261E]",
  },
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<CategorySummary[]>(
    EQUIPMENT_CATEGORIES.map((name) => ({ name, count: 0 }))
  );

  useEffect(() => {
    let active = true;
    apiFetch<{ success: boolean; categories: CategorySummary[] }>(
      "/api/equipment/categories"
    )
      .then((res) => {
        if (active && Array.isArray(res.categories)) {
          setCategories(res.categories);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-[var(--bg-band)] border-y border-[var(--line)]">
      <div className="bd-container space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="bd-eyebrow">Browse by Category</p>
          <h2 className="bd-heading text-3xl md:text-4xl">
            Popular Equipment Categories
          </h2>
          <p className="text-sm sm:text-base text-[var(--body)]">
            Jump straight into the gear category tailored for your project,
            production, or field operation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => {
            const meta = CATEGORY_META[cat.name] || {
              icon: <Cpu size={22} />,
              subtitle: "Verified rental listings",
              tint: "bg-[var(--surface-soft)] text-[var(--purple)]",
            };

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                  className="bd-card flex flex-col justify-between h-full p-6 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${meta.tint}`}
                    >
                      {meta.icon}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[var(--muted)] group-hover:text-[var(--purple)]">
                      {cat.count} {cat.count === 1 ? "item" : "items"}
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  <div className="mt-5 space-y-1.5">
                    <h3 className="text-lg font-extrabold text-[var(--ink-strong)] group-hover:text-[var(--purple)] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-[var(--body)]">{meta.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
