import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";
import mongoose from "mongoose";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

/**
 * GET /api/notes/trash
 * Retrieve all soft-deleted notes for the current user
 * Notes are recoverable for 30 days after deletion
 */
export async function GET(request) {
  await dbConnect();

  try {
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

    // Get deleted notes within 30-day recovery window
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const trash = await Notes.find({
      user: new mongoose.Types.ObjectId(decoded.userId),
      isDeleted: true,
      deletedAt: { $gte: thirtyDaysAgo }, // Only show notes deleted within last 30 days
    })
      .sort({ deletedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: trash,
      message: `${trash.length} deleted notes available for recovery (expires in 30 days)`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

