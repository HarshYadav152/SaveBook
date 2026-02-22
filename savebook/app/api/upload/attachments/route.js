import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for PDFs

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
    const files = formData.getAll("attachment");

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File "${file.name}" exceeds 10 MB limit`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "savebook/attachments",
            resource_type: "raw",
            format: file.name.split('.').pop(),
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              name: file.name,
              type: file.type,
              size: file.size,
            });
          }
        ).end(buffer);
      });
    });

    const attachments = await Promise.all(uploadPromises);

    return NextResponse.json({ attachments });
  } catch (error) {
    console.error("Attachment upload error:", error);
    return NextResponse.json(
      { error: error.message || "Attachment upload failed" },
      { status: 500 }
    );
  }
}
