import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const listingId = Number(body.listingId);

    if (!Number.isInteger(listingId)) {
      return Response.json(
        { error: "Invalid listing id" },
        { status: 400 }
      );
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: authUser.id,
          listingId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_listingId: {
            userId: authUser.id,
            listingId,
          },
        },
      });

      return Response.json({
        message: "Removed from favorites",
        favorited: false,
      });
    }

    await prisma.favorite.create({
      data: {
        userId: authUser.id,
        listingId,
      },
    });

    return Response.json({
      message: "Added to favorites",
      favorited: true,
    });
  } catch (error) {
    console.error("POST /api/favorites/toggle error:", error);
    return Response.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}