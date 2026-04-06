import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  console.log("Webhook hit");
  console.log("Signature present:", !!signature);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Stripe event type:", event.type);
  } catch (error) {
    console.error("Webhook signature error:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Session metadata:", session.metadata);

      const userId = Number(session.metadata?.userId);
      const listingData = JSON.parse(session.metadata?.listingData || "{}");

      console.log("Parsed userId:", userId);
      console.log("Parsed listingData:", listingData);

      const listing = await prisma.listing.create({
        data: {
          title: listingData.title,
          description: listingData.description,
          price: Number(listingData.price),
          condition: listingData.condition,
          businessName: listingData.businessName || null,
          sellerEmail: listingData.sellerEmail,
          contactNumber: listingData.contactNumber,
          whatsappNumber: listingData.whatsappNumber || null,
          address: listingData.address || null,
          location: listingData.location,
          city: listingData.city,
          country: listingData.country,
          isActive: true,
          user: {
            connect: { id: userId },
          },
          category: {
            connect: { id: Number(listingData.categoryId) },
          },
          images: {
            create: (listingData.images || []).map((img, index) => ({
              imageUrl: img,
              sortOrder: index,
            })),
          },
          payments: {
            create: {
              amount: 100,
              currency: "AED",
              status: "PAID",
              provider: "STRIPE",
            },
          },
        },
      });

      console.log("Listing created:", listing.id);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}