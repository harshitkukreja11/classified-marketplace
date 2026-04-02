import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listings = await prisma.listing.findMany({
      where: {
        userId: authUser.id,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        category: true,
        images: true,
      },
    });

    return Response.json(listings);
  } catch (error) {
    console.error("GET /api/my-listings error:", error);
    return Response.json(
      { error: "Failed to fetch my listings" },
      { status: 500 }
    );
  }
}