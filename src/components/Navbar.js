"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      
      {/* Logo */}
      <Link href="/" className="font-bold text-xl">
        Classified
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        <Link href="/listings">Browse</Link>

        {/* 🔒 Only logged-in users */}
        {session && (
          <Link href="/create">Post Listing</Link>
        )}

        <Link href="/dashboard">Dashboard</Link>

        {/* 👤 Auth Section */}
        {session ? (
          <div className="flex items-center gap-4">

            <span className="text-sm">
              {session.user.email}
            </span>

            <button
              onClick={() => signOut()}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>

          </div>
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