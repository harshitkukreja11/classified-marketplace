"use client";

import { useState, useEffect } from "react";
import ListingCard from "@/components/ListingCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(delay);
  }, [query, min, max, sort]);

  const fetchListings = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/listings?q=${query}&min=${min}&max=${max}&sort=${sort}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await res.json();

      // ✅ IMPORTANT FIX
      setListings(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error(error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Marketplace
      </h1>

      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search listings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      {/* 🎯 Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <input
          type="number"
          placeholder="Min Price"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

      </div>

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading listings...</p>
      )}

      {/* ❌ Empty State */}
      {!loading && listings.length === 0 && (
        <p className="text-center text-gray-500">
          No listings found
        </p>
      )}

      {/* ✅ Listings */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.isArray(listings) &&
          listings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
      </div>

    </div>
  );
}