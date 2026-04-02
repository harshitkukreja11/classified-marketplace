import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ favorited: false, loggedIn: false });
    }

    const { id } = await params;
    const listingId = Number(id);

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: authUser.id,
          listingId,
        },
      },
    });

    return Response.json({
      favorited: !!favorite,
      loggedIn: true,
    });
  } catch (error) {
    console.error("GET /api/favorites/status/[id] error:", error);
    return Response.json(
      { error: "Failed to fetch favorite status" },
      { status: 500 }
    );
  }
}