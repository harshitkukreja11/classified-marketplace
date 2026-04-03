"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Listings</h1>

          <Link
            href="/create-listing"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Listing
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            No listings found.
          </div>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white shadow rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      listing.images?.[0]?.imageUrl ||
                      "https://via.placeholder.com/120x90"
                    }
                    alt={listing.title}
                    className="w-28 h-20 object-cover rounded border"
                  />

                <div>
  <h2 className="text-xl font-semibold">{listing.title}</h2>
  <p className="text-gray-600">
    {listing.city}, {listing.country}
  </p>
  <p className="text-blue-600 font-bold">AED {listing.price}</p>
  <p className="text-sm text-gray-500">
    {listing.category?.name} • {listing.condition}
  </p>

  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
    <div className="bg-gray-100 px-3 py-2 rounded">
      <strong>{listing.views}</strong>
      <div>Views</div>
    </div>

    <div className="bg-gray-100 px-3 py-2 rounded">
      <strong>{listing.contactClicks}</strong>
      <div>Contacts</div>
    </div>

    <div className="bg-gray-100 px-3 py-2 rounded">
      <strong>{listing.phoneClicks}</strong>
      <div>Calls</div>
    </div>

    <div className="bg-gray-100 px-3 py-2 rounded">
      <strong>{listing.whatsappClicks}</strong>
      <div>WhatsApp</div>
    </div>
  </div>
</div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="px-4 py-2 border rounded"
                  >
                    View
                  </Link>

                  <Link
                    href={`/listings/edit/${listing.id}`}
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(listing.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
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