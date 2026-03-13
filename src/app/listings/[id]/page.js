import { listings } from "@/data/listings";

export default async function ListingDetail({ params }) {

  const { id } = await params;

  const item = listings.find(
    (l) => l.id === parseInt(id)
  );

  if (!item) {
    return <p>Listing not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">

      <img
        src={item.image}
        className="w-full h-96 object-cover rounded"
      />

      <h1 className="text-3xl font-bold mt-6">
        {item.title}
      </h1>

      <p className="text-gray-600 mt-2">
        Location: {item.location}
      </p>

      <p className="text-blue-600 text-2xl font-bold mt-4">
        AED {item.price}
      </p>

      <div className="mt-6 space-x-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Call Seller
        </button>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          WhatsApp
        </button>
      </div>

    </div>
  );
}