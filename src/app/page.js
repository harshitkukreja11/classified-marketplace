import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";


export const dynamic = "force-dynamic";
export default async function Home() {

  const listings = await prisma.listing.findMany({
    orderBy: { id: "desc" }
  });

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