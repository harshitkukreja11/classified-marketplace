"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ListingFilters({ categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategoryId(searchParams.get("categoryId") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setCondition(searchParams.get("condition") || "");
  }, [searchParams]);

  function applyFilters(e) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");

    if (categoryId) params.set("categoryId", categoryId);
    else params.delete("categoryId");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (condition) params.set("condition", condition);
    else params.delete("condition");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function clearFilters() {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setCondition("");
    router.push(pathname);
  }

  return (
    <form
      onSubmit={applyFilters}
      className="bg-white rounded-xl shadow p-4 mb-6 grid md:grid-cols-5 gap-4"
    >
      <input
        type="text"
        placeholder="Search title, city, country..."
        className="border p-3 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-3 rounded"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price"
        className="border p-3 rounded"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max Price"
        className="border p-3 rounded"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <select
        className="border p-3 rounded"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">All Conditions</option>
        <option value="New">New</option>
        <option value="Used">Used</option>
      </select>

      <div className="md:col-span-5 flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="border px-5 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </form>
  );
}