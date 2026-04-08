"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400"
        >
          Classified Market
        </Link>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="/listings">
            Listings
          </Link>
          <Link
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            href="/create-listing"
          >
            Post Listing
          </Link>

          {user ? (
            <>
              <Link className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="/dashboard">
                Dashboard
              </Link>
              <Link className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="/favorites">
                Favorites
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Hi, {user.name}
              </span>
            </>
          ) : (
            <>
              <Link className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="/login">
                Login
              </Link>
              <Link className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="/register">
                Register
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg bg-white dark:bg-gray-900"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col gap-3">
            <Link href="/listings" onClick={() => setOpen(false)}>
              Listings
            </Link>
            <Link href="/create-listing" onClick={() => setOpen(false)}>
              Post Listing
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/favorites" onClick={() => setOpen(false)}>
                  Favorites
                </Link>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Hi, {user.name}
                </span>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}