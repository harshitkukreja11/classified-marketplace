"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ listingId }) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/favorites/status/${listingId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (res.ok) {
          setFavorited(!!data.favorited);
          setLoggedIn(!!data.loggedIn);
        }
      } catch (error) {
        console.error("Favorite status error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [listingId]);

  async function handleToggle() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    try {
      setToggling(true);

      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        setFavorited(!!data.favorited);
      } else {
        alert(data.error || "Failed to update favorites");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setToggling(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading || toggling}
      className={`px-4 py-2 rounded border ${
        favorited
          ? "bg-red-500 text-white border-red-500"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >
      {loading ? "..." : favorited ? "♥ Saved" : "♡ Save"}
    </button>
  );
}