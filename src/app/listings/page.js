import ListingCard from "@/components/ListingCard";

async function getListings() {
  const res = await fetch("http://localhost:3000/api/listings", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Home() {

  const listings = await getListings();

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Latest Listings
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {listings.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}

      </div>

    </div>
  );
}