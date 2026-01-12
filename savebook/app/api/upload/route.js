import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyJwtToken } from '@/lib/utils/jwtAuth';

// Configure Cloudinary (you'll need to add these to your .env.local)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request) {
  try {
    // Verify authentication
    const authtoken = request.cookies.get("authToken");
    
    if (!authtoken) {
      return NextResponse.json({ success: false, message: "Unauthorized - No token provided" }, { status: 401 });
    }

    const decoded = verifyJwtToken(authtoken.value);
    
    if (!decoded || !decoded.success) {
      return NextResponse.json({ success: false, message: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // For now, we'll handle form data (for image upload)
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ success: false, message: "No image file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Check file size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ success: false, message: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    // For now, if Cloudinary is not configured, we'll return a data URL
    // In production, you should configure Cloudinary or use a different storage solution
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // Convert to base64 data URL
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${fileType};base64,${base64}`;
      
      return NextResponse.json({ 
        success: true, 
        imageUrl: dataUrl,
        message: "Image uploaded successfully (as data URL since Cloudinary is not configured)"
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: 'savebook/profile_images',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });

  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}