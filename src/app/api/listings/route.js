export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

// ✅ GET ALL LISTINGS
export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { id: "desc" },
    });

    return Response.json({
      success: true,
      data: listings, // ✅ ALWAYS ARRAY
    });

  } catch (error) {
    console.error("GET ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch listings",
      },
      { status: 500 }
    );
  }
}

// ✅ CREATE LISTING
export async function POST(req) {
  try {
    const data = await req.json();

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description || "",
        images: Array.isArray(data.images) ? data.images : [],
      },
    });

    return Response.json({
      success: true,
      data: listing,
    });

  } catch (error) {
    console.error("POST ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create listing",
      },
      { status: 500 }
    );
  }
}