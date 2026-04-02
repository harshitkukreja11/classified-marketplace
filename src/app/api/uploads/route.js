import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();
    const { file } = body;

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "marketplace",
      resource_type: "image",
    });

    return Response.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return Response.json(
      {
        error: "Upload failed",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}