import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessionUser = await getUserFromCookie();

    if (!sessionUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return Response.json(user);
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return Response.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}