export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ================= GET ALL LISTINGS =================
export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return Response.json({
      success: true,
      data: listings,
    });

  } catch (error) {
    console.error("GET ERROR:", error);

    return Response.json(
      { success: false, message: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// ================= CREATE LISTING =================
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description,
        images: data.images, // ✅ MULTIPLE IMAGES FIXED
        userId: session.user.id,
      },
    });

    return Response.json({
      success: true,
      data: listing,
    });

  } catch (error) {
    console.error("POST ERROR:", error);

    return Response.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}