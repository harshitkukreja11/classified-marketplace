export const runtime = "nodejs";

import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    console.log("File received:", file?.name);

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "classified-listings",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(buffer);
    });

    return Response.json({
      url: uploadResult.secure_url,
    });

  } catch (error) {
    console.error("Upload error:", error);

    return Response.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}