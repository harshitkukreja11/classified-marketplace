import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: authUser.id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        listing: {
          include: {
            category: true,
            images: true,
            user: true,
          },
        },
      },
    });

    return Response.json(favorites);
  } catch (error) {
    console.error("GET /api/favorites error:", error);
    return Response.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}