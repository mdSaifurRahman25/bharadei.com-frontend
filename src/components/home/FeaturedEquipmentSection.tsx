"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import EquipmentCard from "@/components/shared/EquipmentCard";
import type { EquipmentItem } from "@/types/equipment";

export default function FeaturedEquipmentSection() {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{ success: boolean; items: EquipmentItem[] }>(
      "/api/equipment/featured"
    )
      .then((res) => {
        if (active && Array.isArray(res.items)) {
          setItems(res.items.slice(0, 6));
        }
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-[var(--bg)]">
      <div className="bd-container space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="bd-eyebrow">Featured Inventory</p>
            <h2 className="bd-heading text-3xl md:text-4xl">
              Top Approved Equipment
            </h2>
            <p className="text-sm sm:text-base text-[var(--body)] max-w-xl">
              Hand-picked, verified gear ready for immediate booking across
              Bangladesh.
            </p>
          </div>
          <Link href="/equipment" className="bd-btn-outline text-sm shrink-0">
            View All Equipment
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bd-card h-[370px] animate-pulse bg-[var(--bg-band)]"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bd-card p-10 text-center text-sm text-[var(--body)]">
            Equipment listings are warming up. Check back shortly or visit{" "}
            <Link
              href="/equipment"
              className="font-bold text-[var(--purple)] underline"
            >
              All Equipment
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
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
