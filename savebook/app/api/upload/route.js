import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request) {
  try {
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token.value);
    if (!decoded.success) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image"); 

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Profile image must be less than 5 MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "savebook/profile", 
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      ).end(buffer);
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Profile upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
