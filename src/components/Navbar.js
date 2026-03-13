import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link href="/" className="font-bold text-xl">
        Classified
      </Link>

      <div className="space-x-6">
        <Link href="/listings">Browse</Link>
        <Link href="/post-listing">Post Listing</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}