import Navbar from "@/components/Navbar";
import FavoriteButton from "@/components/FavoriteButton";


async function getListing(id) {
  const res = await fetch(`http://localhost:3000/api/listings/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ListingDetailPage({ params }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold">Listing not found</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={
                listing.images?.[0]?.imageUrl ||
                "https://via.placeholder.com/600x400"
              }
              alt={listing.title}
              className="w-full h-96 object-cover rounded-xl"
            />

            <div className="grid grid-cols-3 gap-3 mt-4">
              {listing.images?.map((img) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt={listing.title}
                  className="w-full h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <p className="text-blue-600 text-2xl font-semibold mt-2">
              AED {listing.price}
            </p>
            <div className="mt-4">
  <FavoriteButton listingId={listing.id} />
</div>

            <p className="mt-4 text-gray-700">{listing.description}</p>

            <div className="mt-6 space-y-2">
              <p>
                <strong>Condition:</strong> {listing.condition}
              </p>
              <p>
                <strong>Category:</strong> {listing.category?.name}
              </p>
              <p>
                <strong>Location:</strong> {listing.city}, {listing.country}
              </p>
              <p>
                <strong>Status:</strong> {listing.status}
              </p>
              <p>
                <strong>Views:</strong> {listing.views}
              </p>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold mb-3">Seller Contact</h2>
              <p>
                <strong>Email:</strong> {listing.sellerEmail}
              </p>
              <p>
                <strong>Phone:</strong> {listing.contactNumber}
              </p>
              <p>
                <strong>WhatsApp:</strong> {listing.whatsappNumber || "-"}
              </p>
              <p>
                <strong>Business:</strong> {listing.businessName || "-"}
              </p>
              <p>
                <strong>Address:</strong> {listing.address || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}