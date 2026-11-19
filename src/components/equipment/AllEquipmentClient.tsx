"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import EquipmentCard from "@/components/shared/EquipmentCard";
import { EQUIPMENT_CATEGORIES, type EquipmentItem } from "@/types/equipment";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AllEquipmentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [category, setCategory] = useState(
    () => searchParams.get("category") || "All"
  );
  const [rentalType, setRentalType] = useState(
    () => searchParams.get("rentalType") || "All"
  );
  const [availability, setAvailability] = useState(
    () => searchParams.get("availability") || "All"
  );
  const [minPrice, setMinPrice] = useState(
    () => searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    () => searchParams.get("maxPrice") || ""
  );
  const [sort, setSort] = useState(() => searchParams.get("sort") || "recent");
  const [page, setPage] = useState(
    () => Math.max(1, Number(searchParams.get("page") || 1))
  );

  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category && category !== "All") params.set("category", category);
    if (rentalType && rentalType !== "All") params.set("rentalType", rentalType);
    if (availability && availability !== "All")
      params.set("availability", availability);
    if (minPrice.trim()) params.set("minPrice", minPrice.trim());
    if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "6");

    const timer = window.setTimeout(() => {
      if (!active) return;
      setLoading(true);
      setError("");

      apiFetch<{
        success: boolean;
        items: EquipmentItem[];
        pagination: PaginationMeta;
      }>(`/api/equipment?${params.toString()}`)
        .then((res) => {
          if (!active) return;
          setItems(Array.isArray(res.items) ? res.items : []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        })
        .catch((err) => {
          if (!active) return;
          setError(
            err instanceof Error ? err.message : "Failed to load equipment."
          );
          setItems([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search, category, rentalType, availability, minPrice, maxPrice, sort, page]);

  const syncUrl = useCallback(
    (overrides: Record<string, string | number>) => {
      const next = new URLSearchParams();
      const merged = {
        search,
        category,
        rentalType,
        availability,
        minPrice,
        maxPrice,
        sort,
        page,
        ...overrides,
      };
      if (String(merged.search).trim())
        next.set("search", String(merged.search).trim());
      if (merged.category && merged.category !== "All")
        next.set("category", String(merged.category));
      if (merged.rentalType && merged.rentalType !== "All")
        next.set("rentalType", String(merged.rentalType));
      if (merged.availability && merged.availability !== "All")
        next.set("availability", String(merged.availability));
      if (String(merged.minPrice).trim())
        next.set("minPrice", String(merged.minPrice).trim());
      if (String(merged.maxPrice).trim())
        next.set("maxPrice", String(merged.maxPrice).trim());
      if (merged.sort && merged.sort !== "recent")
        next.set("sort", String(merged.sort));
      if (Number(merged.page) > 1) next.set("page", String(merged.page));

      const qs = next.toString();
      router.replace(qs ? `/equipment?${qs}` : "/equipment", { scroll: false });
    },
    [
      search,
      category,
      rentalType,
      availability,
      minPrice,
      maxPrice,
      sort,
      page,
      router,
    ]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
    syncUrl({ search: searchInput, page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setCategory("All");
    setRentalType("All");
    setAvailability("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("recent");
    setPage(1);
    router.replace("/equipment", { scroll: false });
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      {/* Header Band */}
      <section className="bd-hero-bg border-b border-[var(--line)] py-12">
        <div className="bd-container space-y-6">
          <div className="space-y-2 max-w-2xl">
            <p className="bd-eyebrow">Live Marketplace Catalog</p>
            <h1 className="bd-heading text-3xl md:text-4xl">
              Browse All Approved Equipment
            </h1>
            <p className="text-sm sm:text-base text-[var(--body)]">
              Search by equipment title or city, filter by category, rental
              period, price range, and real-time availability.
            </p>
          </div>

          {/* Search + Filters Card */}
          <div className="bd-card p-5 space-y-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search equipment name, brand, or location (e.g. Sony, Dhaka)..."
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>
              <button type="submit" className="bd-btn-blue text-sm px-6">
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bd-btn-outline text-sm"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--muted)] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategory(val);
                    setPage(1);
                    syncUrl({ category: val, page: 1 });
                  }}
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {EQUIPMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--muted)] mb-1">
                  Rental Type
                </label>
                <select
                  value={rentalType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRentalType(val);
                    setPage(1);
                    syncUrl({ rentalType: val, page: 1 });
                  }}
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--muted)] mb-1">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAvailability(val);
                    setPage(1);
                    syncUrl({ availability: val, page: 1 });
                  }}
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="available">Available Only</option>
                  <option value="unavailable">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--muted)] mb-1">
                  Min Price (৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMinPrice(val);
                    setPage(1);
                    syncUrl({ minPrice: val, page: 1 });
                  }}
                  placeholder="0"
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--muted)] mb-1">
                  Max Price (৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMaxPrice(val);
                    setPage(1);
                    syncUrl({ maxPrice: val, page: 1 });
                  }}
                  placeholder="50000"
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[var(--muted)] mb-1">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSort(val);
                    setPage(1);
                    syncUrl({ sort: val, page: 1 });
                  }}
                  className="w-full rounded-[9px] border border-[var(--card-line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--ink)] focus:border-[var(--purple)] focus:outline-none"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12">
        <div className="bd-container space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--body)]">
              <SlidersHorizontal size={16} className="text-[var(--purple)]" />
              Showing <span className="font-bold text-[var(--ink-strong)]">{items.length}</span>{" "}
              of{" "}
              <span className="font-bold text-[var(--ink-strong)]">
                {pagination.total}
              </span>{" "}
              approved items
            </p>
            <p className="text-xs font-mono text-[var(--muted)]">
              Page {pagination.page} of {pagination.totalPages}
            </p>
          </div>

          {error && (
            <div className="bd-card p-6 text-center text-sm text-[#B3261E] bg-[#FDECEA]">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bd-card h-[380px] animate-pulse bg-[var(--bg-band)]"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bd-card p-12 text-center space-y-4">
              <h2 className="bd-heading text-2xl">No matching equipment found</h2>
              <p className="text-sm text-[var(--body)] max-w-md mx-auto">
                Try adjusting your search keywords, clearing price limits, or
                browsing all categories.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="bd-btn-primary text-sm"
              >
                <RotateCcw size={15} />
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => {
                  const next = Math.max(1, pagination.page - 1);
                  setPage(next);
                  syncUrl({ page: next });
                }}
                className="bd-btn-outline px-3 py-2 text-xs disabled:opacity-45"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const active = pageNum === pagination.page;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setPage(pageNum);
                      syncUrl({ page: pageNum });
                    }}
                    className={`h-9 min-w-9 rounded-[9px] px-3 text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? "bg-[var(--purple-2)] text-white"
                        : "border border-[var(--card-line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--purple)]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => {
                  const next = Math.min(
                    pagination.totalPages,
                    pagination.page + 1
                  );
                  setPage(next);
                  syncUrl({ page: next });
                }}
                className="bd-btn-outline px-3 py-2 text-xs disabled:opacity-45"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
