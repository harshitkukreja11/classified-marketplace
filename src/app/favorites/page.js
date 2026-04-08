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
        <div className="section-wrap">
          <div className="card-ui p-6 text-center text-gray-500 dark:text-gray-400">
            Loading favorites...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="section-wrap">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              My Favorites
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Save listings you like and view them anytime.
            </p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? "item" : "items"}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="card-ui p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-2xl">
              ❤️
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No favorite listings yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Browse listings and save the ones you like here.
            </p>

            <Link href="/listings" className="btn-primary inline-block mt-5">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const listing = favorite.listing;

              return (
                <div
                  key={favorite.id}
                  className="card-ui overflow-hidden group hover:-translate-y-1 duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        listing.images?.[0]?.imageUrl ||
                        "https://via.placeholder.com/400x250"
                      }
                      alt={listing.title}
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 shadow">
                      AED {listing.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {listing.title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {listing.city}, {listing.country}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {listing.category?.name || "Uncategorized"}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {listing.condition}
                      </span>
                    </div>

                    <Link
                      href={`/listings/${listing.id}`}
                      className="mt-4 inline-block w-full text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-medium transition"
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