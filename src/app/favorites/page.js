"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites", {
          cache: "no-store",
        });

        let data = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (res.ok) {
          setFavorites(Array.isArray(data) ? data : []);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Favorites fetch error:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-10">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            No favorite listings yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const listing = favorite.listing;

              return (
                <div
                  key={favorite.id}
                  className="border rounded-xl overflow-hidden shadow bg-white"
                >
                  <img
                    src={
                      listing.images?.[0]?.imageUrl ||
                      "https://via.placeholder.com/400x250"
                    }
                    alt={listing.title}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <p className="text-gray-600">
                      {listing.city}, {listing.country}
                    </p>
                    <p className="text-blue-600 font-bold mt-2">
                      AED {listing.price}
                    </p>
                    <p className="text-sm mt-2">{listing.category?.name}</p>
                    <p className="text-sm text-gray-500">
                      {listing.condition}
                    </p>

                    <Link
                      href={`/listings/${listing.id}`}
                      className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}