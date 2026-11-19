"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Flame } from "lucide-react";
import { apiFetch } from "@/lib/api";
import EquipmentCard from "@/components/shared/EquipmentCard";
import type { EquipmentItem } from "@/types/equipment";

export default function PopularRecentSection() {
  const [tab, setTab] = useState<"popular" | "recent">("popular");
  const [popular, setPopular] = useState<EquipmentItem[]>([]);
  const [recent, setRecent] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{
      success: boolean;
      popular: EquipmentItem[];
      recent: EquipmentItem[];
    }>("/api/equipment/highlights")
      .then((res) => {
        if (!active) return;
        setPopular(Array.isArray(res.popular) ? res.popular.slice(0, 3) : []);
        setRecent(Array.isArray(res.recent) ? res.recent.slice(0, 3) : []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayed = tab === "popular" ? popular : recent;

  return (
    <section className="py-16 md:py-20 bg-[var(--bg-band)] border-t border-[var(--line)]">
      <div className="bd-container space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="bd-eyebrow">Marketplace Spotlight</p>
            <h2 className="bd-heading text-3xl md:text-4xl">
              Popular &amp; Recently Added Gear
            </h2>
            <p className="text-sm sm:text-base text-[var(--body)]">
              Switch between most-booked equipment and the newest listings from
              verified owners.
            </p>
          </div>

          <div className="inline-flex rounded-[11px] border border-[var(--card-line)] bg-[var(--surface)] p-1 self-start">
            <button
              type="button"
              onClick={() => setTab("popular")}
              className={`inline-flex items-center gap-1.5 rounded-[8px] px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                tab === "popular"
                  ? "bg-[var(--purple-2)] text-white"
                  : "text-[var(--body)] hover:text-[var(--ink-strong)]"
              }`}
            >
              <Flame size={14} />
              Popular Equipment
            </button>
            <button
              type="button"
              onClick={() => setTab("recent")}
              className={`inline-flex items-center gap-1.5 rounded-[8px] px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                tab === "recent"
                  ? "bg-[var(--purple-2)] text-white"
                  : "text-[var(--body)] hover:text-[var(--ink-strong)]"
              }`}
            >
              <Clock3 size={14} />
              Recently Added
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bd-card h-[360px] animate-pulse bg-[var(--surface)]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((item, idx) => (
              <motion.div
                key={`${tab}-${item.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.05 }}
                className="h-full"
              >
                <EquipmentCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
