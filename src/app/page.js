import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";

async function getListings() {
  const res = await fetch("http://localhost:3000/api/listings", {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const listings = await getListings();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="bg-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Buy and Sell Anything</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Properties, cars, furniture, electronics, services, and more.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Latest Listings</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}