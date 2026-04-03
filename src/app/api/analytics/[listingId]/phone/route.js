import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const { listingId } = await params;
    const id = Number(listingId);

    if (!Number.isInteger(id)) {
      return Response.json({ error: "Invalid listing id" }, { status: 400 });
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    await prisma.listing.update({
      where: { id },
      data: {
        phoneClicks: {
          increment: 1,
        },
        contactClicks: {
          increment: 1,
        },
      },
    });

    await prisma.listingAnalytics.create({
      data: {
        listingId: id,
        eventType: "PHONE_CLICK",
        ipAddress,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("POST /api/analytics/[listingId]/phone error:", error);
    return Response.json(
      { error: "Failed to track phone click" },
      { status: 500 }
    );
  }
}