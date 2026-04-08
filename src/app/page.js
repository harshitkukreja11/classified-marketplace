import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getListings() {
  return prisma.listing.findMany({
    where: { isActive: true },
    orderBy: { id: "desc" },
    include: {
      category: true,
      user: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    take: 6,
  });
}

export default async function HomePage() {
  const listings = await getListings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <section className="section-wrap">
        <div className="card-ui p-8 sm:p-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Buy and Sell Anything
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-blue-100">
            Discover properties, cars, furniture, electronics, and much more in one modern marketplace.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/listings" className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold">
              Browse Listings
            </Link>
            <Link
              href="/create-listing"
              className="border border-white/40 px-5 py-3 rounded-xl font-semibold"
            >
              Post Your Listing
            </Link>
          </div>
        </div>
      </section>

      <section className="section-wrap pt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Latest Listings</h2>
          <Link href="/listings" className="text-blue-600 dark:text-blue-400 font-medium">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}