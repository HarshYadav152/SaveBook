import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";
import mongoose from "mongoose";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id: noteId } = await params;
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

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

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
