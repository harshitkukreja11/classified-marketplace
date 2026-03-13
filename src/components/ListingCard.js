import Link from "next/link";

export default function ListingCard({ item }) {

  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : "/placeholder.png";

  return (
    <div className="border rounded-lg shadow hover:shadow-lg">

      <img
        src={imageUrl}
        alt={item.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="font-bold text-lg">{item.title}</h2>

        <p className="text-gray-600">{item.location}</p>

        <p className="text-blue-600 font-bold mt-2">
          AED {item.price}
        </p>

        <Link
          href={`/listings/${item.id}`}
          className="block mt-3 bg-blue-600 text-white text-center p-2 rounded"
        >
          View Details
        </Link>
      </div>

    </div>
  );
}