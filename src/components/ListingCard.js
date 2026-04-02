import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

export default function ListingCard({ listing }) {
  const image =
    listing.images?.[0]?.imageUrl || "https://via.placeholder.com/400x250";

  return (
    <div className="border rounded-xl overflow-hidden shadow bg-white">
      <img
        src={image}
        alt={listing.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold">{listing.title}</h3>
        <p className="text-gray-600">
          {listing.city}, {listing.country}
        </p>
        <p className="text-blue-600 font-bold mt-2">AED {listing.price}</p>
        <p className="text-sm mt-2">{listing.category?.name}</p>
        <p className="text-sm text-gray-500">{listing.condition}</p>

        <div className="mt-4 flex items-center gap-3">
          <Link
            href={`/listings/${listing.id}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            View Details
          </Link>

          <FavoriteButton listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}