"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin, XCircle } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import type { EquipmentItem } from "@/types/equipment";

interface EquipmentCardProps {
  item: EquipmentItem;
}

export default function EquipmentCard({ item }: EquipmentCardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const inStock = item.availableQuantity > 0;

  const handleViewDetails = () => {
    const targetPath = `/equipment/${item.id}`;
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
      return;
    }
    router.push(targetPath);
  };

  return (
    <article className="bd-card flex flex-col h-full overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-soft)]">
        <Image
          src={
            item.image ||
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80"
          }
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-[var(--surface)]/95 px-2.5 py-1 text-[11px] font-bold text-[var(--purple)] border border-[var(--card-line)] backdrop-blur-sm">
            {item.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              inStock
                ? "bg-[#E8F6EF] text-[#16774A]"
                : "bg-[#FDECEA] text-[#B3261E]"
            }`}
          >
            {inStock ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {inStock ? "Available" : "Out of Stock"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold tracking-tight text-[var(--ink-strong)] line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-[var(--body)] line-clamp-2 min-h-[2.5rem]">
            {item.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] pt-1">
            <MapPin size={14} className="text-[var(--purple)] shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold text-[var(--ink-strong)] font-mono">
              ৳{item.rentalPrice.toLocaleString()}
            </p>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
              Per {item.rentalType}
            </p>
          </div>
          <button
            type="button"
            onClick={handleViewDetails}
            className="bd-btn-blue text-xs px-3.5 py-2"
          >
            View Details
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
