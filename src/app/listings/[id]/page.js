import { prisma } from "@/lib/prisma";
import ImageGallery from "@/components/ImageGallery";

export default async function ListingDetails({ params }) {

  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!listing) {
    return <div className="p-10 text-center">Listing not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* IMAGE GALLERY */}
      <ImageGallery images={listing.images} />

      {/* DETAILS */}
      <div className="mt-6">

        <h1 className="text-3xl font-bold">
          {listing.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {listing.location}
        </p>

        <p className="text-blue-600 text-2xl font-bold mt-3">
          AED {listing.price}
        </p>

        <p className="mt-4 text-gray-700">
          {listing.description}
        </p>

        <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded">
          Contact Seller
        </button>

      </div>

    </div>
  );
}