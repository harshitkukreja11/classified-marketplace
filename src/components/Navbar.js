"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Classified Market
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/listings">Listings</Link>
        <Link href="/create-listing">Post Listing</Link>

        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/favorites">Favorites</Link>
            <span className="text-sm">Hi, {user.name}</span>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}