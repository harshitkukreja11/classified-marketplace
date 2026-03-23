import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json([], { status: 401 });
  }

  const listings = await prisma.listing.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { id: "desc" },
  });

  return Response.json(listings);
}