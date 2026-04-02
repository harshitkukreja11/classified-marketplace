import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        category: true,
        images: true,
      },
    });

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    return Response.json(listing);
  } catch (error) {
    console.error("GET /api/listings/[id] error:", error);
    return Response.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const listingId = Number(id);
    const body = await req.json();
    const categoryId = Number(body.categoryId);

    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { images: true },
    });

    if (!existingListing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.userId !== authUser.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!Number.isInteger(categoryId)) {
      return Response.json(
        { error: "Please select a valid category" },
        { status: 400 }
      );
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        condition: body.condition,
        businessName: body.businessName || null,
        sellerEmail: body.sellerEmail,
        contactNumber: body.contactNumber,
        whatsappNumber: body.whatsappNumber || null,
        address: body.address || null,
        location: body.location,
        city: body.city,
        country: body.country,
        category: {
          connect: { id: categoryId },
        },
        images: {
          deleteMany: {},
          create: (body.images || []).map((img, index) => ({
            imageUrl: img,
            sortOrder: index,
          })),
        },
      },
      include: {
        user: true,
        category: true,
        images: true,
      },
    });

    return Response.json(updatedListing);
  } catch (error) {
    console.error("PUT /api/listings/[id] error:", error);
    return Response.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const listingId = Number(id);

    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.userId !== authUser.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    return Response.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/listings/[id] error:", error);
    return Response.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}