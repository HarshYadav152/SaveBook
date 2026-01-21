import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

// Import modular utilities
import { validateAudioFile } from "@/lib/utils/audioValidation";
import { storeAudioFile } from "@/lib/utils/audioStorage";

/**
 * POST /api/upload/audio
 * 
 * Handles audio file uploads with validation and secure storage.
 * 
 * Request:
 * - FormData with "audio" field containing audio file
 * 
 * Response:
 * - { audioUrl: "path/to/audio", duration: 45 }
 */
export async function POST(request) {
  try {
    // ==========================================
    // 1. AUTHENTICATION
    // ==========================================
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded = await verifyJwtToken(token.value);
    if (!decoded || !decoded.success) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // ==========================================
    // 2. PARSE FORMDATA
    // ==========================================
    let formData;
    try {
      formData = await request.formData();
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid FormData" },
        { status: 400 }
      );
    }

    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // ==========================================
    // 3. VALIDATE FILE
    // ==========================================
    const validation = await validateAudioFile(audioFile);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // ==========================================
    // 4. STORE FILE
    // ==========================================
    let storageResult;
    try {
      storageResult = await storeAudioFile({
        file: audioFile,
        userId: userId,
        fileName: audioFile.name,
      });
    } catch (err) {
      console.error("Storage error:", err);
      return NextResponse.json(
        { error: "Failed to store audio file" },
        { status: 500 }
      );
    }

    // ==========================================
    // 5. RETURN RESPONSE
    // ==========================================
    return NextResponse.json(
      {
        audioUrl: storageResult.url,
        duration: storageResult.duration || null,
        fileName: audioFile.name,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
