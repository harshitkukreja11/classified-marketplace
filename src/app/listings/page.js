import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import ListingFilters from "@/components/ListingFilters";
import { prisma } from "@/lib/prisma";

async function getListings(resolvedSearchParams) {
  const search = resolvedSearchParams?.search || "";
  const categoryId = resolvedSearchParams?.categoryId || "";
  const minPrice = resolvedSearchParams?.minPrice || "";
  const maxPrice = resolvedSearchParams?.maxPrice || "";
  const condition = resolvedSearchParams?.condition || "";

  const where = {
    isActive: true,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { country: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(condition ? { condition } : {}),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      },
    }),
  };

  return prisma.listing.findMany({
    where,
    orderBy: { id: "desc" },
    include: {
      user: true,
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function ListingsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const [listings, categories] = await Promise.all([
    getListings(resolvedSearchParams),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">All Listings</h1>

        <ListingFilters categories={categories || []} />

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            No listings found for the selected filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}