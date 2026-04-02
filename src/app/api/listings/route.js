import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const condition = searchParams.get("condition") || "";

    const where = {
      isActive: true,
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                city: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                country: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
      ...(categoryId ? { categoryId: Number(categoryId) } : {}),
      ...(condition ? { condition } : {}),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice ? { gte: Number(minPrice) } : {}),
          ...(maxPrice ? { lte: Number(maxPrice) } : {}),
        },
      }),
    };

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { id: "desc" },
      include: {
        user: true,
        category: true,
        images: true,
      },
    });

    return Response.json(listings);
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return Response.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const categoryId = Number(body.categoryId);

    if (!Number.isInteger(categoryId)) {
      return Response.json(
        { error: "Please select a valid category" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
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
        user: {
          connect: { id: authUser.id },
        },
        category: {
          connect: { id: categoryId },
        },
        images: {
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

    return Response.json(listing, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return Response.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}