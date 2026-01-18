/**
 * Audio Storage Handler
 * 
 * Modular storage interface that can be swapped for different providers:
 * - Local filesystem
 * - AWS S3
 * - Google Cloud Storage
 * - Cloudinary
 * - etc.
 * 
 * This file exports the handler that delegates to the configured provider.
 */

import { generateUniqueFileName } from "./audioValidation";

/**
 * Store audio file using configured provider
 * 
 * @param {Object} params - Storage parameters
 * @param {File} params.file - Audio file
 * @param {string} params.userId - User ID (for organization)
 * @param {string} params.fileName - Original file name
 * 
 * @returns {Promise<{url: string, duration: number|null}>}
 *   - url: Publicly accessible URL to the audio file
 *   - duration: Audio duration in seconds (if available)
 */
export async function storeAudioFile({ file, userId, fileName }) {
  // Get storage provider from environment
  const provider = process.env.AUDIO_STORAGE_PROVIDER || "local";

  // Select storage implementation
  let handler;
  switch (provider) {
    case "s3":
      handler = storeToS3;
      break;
    case "cloudinary":
      handler = storeToCloudinary;
      break;
    case "gcs": // Google Cloud Storage
      handler = storeToGCS;
      break;
    case "local":
    default:
      handler = storeToLocal;
  }

  // Delegate to provider
  return handler({ file, userId, fileName });
}

/**
 * Store to Local Filesystem
 * 
 * Saves file to public folder with user directory structure.
 * In production, use a proper CDN or cloud storage.
 */
async function storeToLocal({ file, userId, fileName }) {
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");

    const buffer = await file.arrayBuffer();
    const uniqueName = generateUniqueFileName(fileName, userId);
    
    // Directory structure: public/uploads/audio/{userId}/{fileName}
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "audio",
      userId
    );

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, new Uint8Array(buffer));

    // Return relative URL (public path)
    const url = `/uploads/audio/${userId}/${uniqueName}`;

    return {
      url,
      duration: null, // Extract from validation if available
    };
  } catch (error) {
    throw new Error(`Local storage failed: ${error.message}`);
  }
}

/**
 * Store to AWS S3
 * 
 * Requires:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_REGION
 * - AUDIO_S3_BUCKET
 */
async function storeToS3({ file, userId, fileName }) {
  try {
    const AWS = await import("@aws-sdk/client-s3");
    const { PutObjectCommand } = AWS;

    const s3Client = new AWS.S3Client({
      region: process.env.AWS_REGION,
    });

    const uniqueName = generateUniqueFileName(fileName, userId);
    const key = `audio/${userId}/${uniqueName}`;
    const buffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.AUDIO_S3_BUCKET,
      Key: key,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);

    const url = `https://${process.env.AUDIO_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      url,
      duration: null,
    };
  } catch (error) {
    throw new Error(`S3 storage failed: ${error.message}`);
  }
}

/**
 * Store to Cloudinary
 * 
 * Requires:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */
async function storeToCloudinary({ file, userId, fileName }) {
  try {
    const cloudinary = await import("cloudinary");
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const buffer = await file.arrayBuffer();
    const uniqueName = generateUniqueFileName(fileName, userId);

    // Upload as raw file
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: "video", // Cloudinary uses "video" for audio too
          folder: `savebook/audio/${userId}`,
          public_id: uniqueName.replace(/\.[^.]+$/, ""), // Remove extension
          format: "webm",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(new Uint8Array(buffer));
    });

    return {
      url: result.secure_url,
      duration: result.duration || null,
    };
  } catch (error) {
    throw new Error(`Cloudinary storage failed: ${error.message}`);
  }
}

/**
 * Store to Google Cloud Storage
 * 
 * Requires:
 * - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)
 * - AUDIO_GCS_BUCKET
 */
async function storeToGCS({ file, userId, fileName }) {
  try {
    const { Storage } = await import("@google-cloud/storage");
    const storage = new Storage();
    const bucket = storage.bucket(process.env.AUDIO_GCS_BUCKET);

    const uniqueName = generateUniqueFileName(fileName, userId);
    const gcsFile = bucket.file(`audio/${userId}/${uniqueName}`);

    const buffer = await file.arrayBuffer();

    await gcsFile.save(new Uint8Array(buffer), {
      metadata: {
        contentType: file.type,
      },
      public: true,
    });

    const url = `https://storage.googleapis.com/${process.env.AUDIO_GCS_BUCKET}/audio/${userId}/${uniqueName}`;

    return {
      url,
      duration: null,
    };
  } catch (error) {
    throw new Error(`GCS storage failed: ${error.message}`);
  }
}
