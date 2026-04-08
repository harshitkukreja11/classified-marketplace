import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

export default function ListingCard({ listing }) {
  const image =
    listing.images?.[0]?.imageUrl || "https://via.placeholder.com/400x250";

  return (
    <div className="card-ui overflow-hidden group transition-all duration-300 hover:-translate-y-1">
      
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={listing.title}
          className="w-full h-48 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton listingId={listing.id} />
        </div>

        {/* Price Badge (Top Left) */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 shadow">
          AED {listing.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold line-clamp-1 text-gray-900 dark:text-white">
          {listing.title}
        </h3>

        {/* Location */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {listing.city}, {listing.country}
        </p>

        {/* Category + Condition */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            {listing.category?.name}
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
            {listing.condition}
          </span>
        </div>

        {/* Button */}
        <Link
          href={`/listings/${listing.id}`}
          className="mt-4 inline-block w-full text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-medium transition-all duration-200 hover:shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}