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

/**
 * PUT /api/notes/trash/restore/:id
 * Restore a soft-deleted note from trash
 * This undeletes the note and makes it visible again
 */
export async function PUT(request) {
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

    // Get note ID from URL
    const url = new URL(request.url);
    const noteId = url.pathname.split("/").pop();

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    // Find soft-deleted note
    const note = await Notes.findOne({
      _id: noteId,
      user: decoded.userId,
      isDeleted: true,
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found in trash or recovery period expired" },
        { status: 404 }
      );
    }

    // Restore note
    note.isDeleted = false;
    note.deletedAt = null;
    await note.save();

    return NextResponse.json({
      success: true,
      data: note,
      message: "Note restored successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notes/trash/:id
 * Permanently delete a soft-deleted note (skip recovery period)
 * Use with caution: This is permanent and cannot be undone
 */
export async function DELETE(request) {
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

    // Get note ID from URL
    const url = new URL(request.url);
    const noteId = url.pathname.split("/").pop();

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    // Find and permanently delete note
    const note = await Notes.findOne({
      _id: noteId,
      user: decoded.userId,
      isDeleted: true,
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found in trash" },
        { status: 404 }
      );
    }

    // Permanently delete the note
    await Notes.findByIdAndDelete(noteId);

    return NextResponse.json({
      success: true,
      message: "Note permanently deleted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
