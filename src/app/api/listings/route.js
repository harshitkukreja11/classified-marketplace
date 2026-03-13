import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const listings = await prisma.listing.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return Response.json(listings);

  } catch (error) {

    console.error(error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch listings" }),
      { status: 500 }
    );
  }
}


export async function POST(req) {

  try {

    const data = await req.json();

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description,
        images: data.images,
      },
    });

    return Response.json(listing);

  } catch (error) {

    console.error(error);

    return new Response(
      JSON.stringify({ error: "Failed to create listing" }),
      { status: 500 }
    );
  }

}