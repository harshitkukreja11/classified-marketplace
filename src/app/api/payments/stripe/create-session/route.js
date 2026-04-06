import { stripe } from "@/lib/stripe";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const authUser = await getUserFromCookie();

    if (!authUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const listingData = body.listingData;

    if (!listingData) {
      return Response.json(
        { error: "Listing data is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/create-listing?payment=cancelled`,
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: "Listing Publish Fee",
              description: `Publish listing: ${listingData.title || "Marketplace Listing"}`,
            },
            unit_amount: 10000, // 100 AED in fils
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(authUser.id),
        listingData: JSON.stringify(listingData),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe create session error:", error);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}