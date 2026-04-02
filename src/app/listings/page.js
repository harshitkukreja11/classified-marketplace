import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import ListingFilters from "@/components/ListingFilters";

async function getListings(resolvedSearchParams) {
  const params = new URLSearchParams();

  if (resolvedSearchParams?.search) {
    params.set("search", resolvedSearchParams.search);
  }
  if (resolvedSearchParams?.categoryId) {
    params.set("categoryId", resolvedSearchParams.categoryId);
  }
  if (resolvedSearchParams?.minPrice) {
    params.set("minPrice", resolvedSearchParams.minPrice);
  }
  if (resolvedSearchParams?.maxPrice) {
    params.set("maxPrice", resolvedSearchParams.maxPrice);
  }
  if (resolvedSearchParams?.condition) {
    params.set("condition", resolvedSearchParams.condition);
  }

  const url = params.toString()
    ? `http://localhost:3000/api/listings?${params.toString()}`
    : "http://localhost:3000/api/listings";

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

async function getCategories() {
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
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