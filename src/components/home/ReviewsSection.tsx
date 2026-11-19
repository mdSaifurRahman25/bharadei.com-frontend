"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { CustomerReview } from "@/types/equipment";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{ success: boolean; reviews: CustomerReview[] }>("/api/reviews")
      .then((res) => {
        if (active && Array.isArray(res.reviews)) {
          setReviews(res.reviews);
        }
      })
      .catch(() => {
        if (active) setReviews([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-[var(--bg-band)] border-y border-[var(--line)]">
      <div className="bd-container space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="bd-eyebrow">Customer Stories</p>
          <h2 className="bd-heading text-3xl md:text-4xl">
            Trusted by Renters Across Bangladesh
          </h2>
          <p className="text-sm sm:text-base text-[var(--body)]">
            Real feedback from filmmakers, contractors, event organizers, and
            agri-teams renting on BharaDei.com.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bd-card h-60 animate-pulse bg-[var(--surface)]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.slice(0, 4).map((review, idx) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.07 }}
                className="bd-card flex flex-col justify-between h-full p-6 gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-0.5 text-[#F59E0B]"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          size={15}
                          fill={starIdx < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <Quote size={18} className="text-[var(--purple)] opacity-60" />
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--body)]">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)] space-y-1">
                  <p className="text-sm font-extrabold text-[var(--ink-strong)]">
                    {review.customerName}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{review.role}</p>
                  {review.equipmentName && (
                    <p className="text-[11px] font-mono text-[var(--purple)] truncate">
                      {review.equipmentName}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
