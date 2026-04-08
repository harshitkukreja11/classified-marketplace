"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

function StatCard({ label, value, color }) {
  return (
    <div className="card-ui p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-2 text-center">
      <div className="text-sm font-semibold text-gray-900 dark:text-white">
        {value || 0}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

function StatusBadge({ listing }) {
  const isPublished = listing.isActive;
  const paymentStatus = listing.paymentStatus;

  if (isPublished) {
    return (
      <span className="inline-flex rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
        Published
      </span>
    );
  }

  if (paymentStatus === "paid") {
    return (
      <span className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
        Paid
      </span>
    );
  }

  if (paymentStatus === "processing") {
    return (
      <span className="inline-flex rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400">
        Payment Processing
      </span>
    );
  }

  if (paymentStatus === "expired") {
    return (
      <span className="inline-flex rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
        Payment Expired
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
      Draft
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyListings() {
      try {
        const res = await fetch("/api/my-listings", {
          cache: "no-store",
        });

        const text = await res.text();
        let data = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          console.error("Failed /api/my-listings:", data);
          setListings([]);
          return;
        }

        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMyListings();
  }, [router]);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this listing?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        setListings((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting");
    }
  }

  const stats = useMemo(() => {
    const total = listings.length;
    const published = listings.filter((item) => item.isActive).length;
    const drafts = listings.filter((item) => !item.isActive).length;
    const totalViews = listings.reduce((sum, item) => sum + (item.views || 0), 0);

    return {
      total,
      published,
      drafts,
      totalViews,
    };
  }, [listings]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="section-wrap">
          <div className="card-ui p-6 text-center text-gray-500 dark:text-gray-400">
            Loading your dashboard...
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              My Listings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your listings, views, and engagement in one place.
            </p>
          </div>

          <Link href="/create-listing" className="btn-primary text-center">
            + Add Listing
          </Link>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Listings" value={stats.total} color="text-gray-900 dark:text-white" />
          <StatCard label="Published" value={stats.published} color="text-green-600 dark:text-green-400" />
          <StatCard label="Drafts" value={stats.drafts} color="text-yellow-600 dark:text-yellow-400" />
          <StatCard label="Total Views" value={stats.totalViews} color="text-blue-600 dark:text-blue-400" />
        </div>

        {/* Empty State */}
        {listings.length === 0 ? (
          <div className="card-ui p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-2xl">
              📦
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No listings found
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start by creating your first listing and grow your marketplace presence.
            </p>

            <Link href="/create-listing" className="btn-primary inline-block mt-5">
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="card-ui p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5"
              >
                {/* Left side */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <img
                    src={
                      listing.images?.[0]?.imageUrl ||
                      "https://via.placeholder.com/120x90"
                    }
                    alt={listing.title}
                    className="w-full sm:w-36 h-24 sm:h-28 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                          {listing.title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {listing.city}, {listing.country}
                        </p>
                      </div>

                      <StatusBadge listing={listing} />
                    </div>

                    <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-2">
                      AED {listing.price}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {listing.category?.name || "Uncategorized"} • {listing.condition}
                    </p>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                      <SmallStat label="Views" value={listing.views} />
                      <SmallStat label="Contacts" value={listing.contactClicks} />
                      <SmallStat label="Calls" value={listing.phoneClicks} />
                      <SmallStat label="WhatsApp" value={listing.whatsappClicks} />
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-wrap xl:flex-col gap-2 xl:min-w-[140px]">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="btn-secondary text-center"
                  >
                    View
                  </Link>

                  <Link
                    href={`/listings/edit/${listing.id}`}
                    className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white transition text-center"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(listing.id)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}