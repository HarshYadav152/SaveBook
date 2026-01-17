import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    //Auth
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token.value);
    if (!decoded.success) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    //FormData
    const formData = await request.formData();
    const files = formData.getAll("image");

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "savebook/notes",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}
