import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongodb';
import Notes from '@/lib/models/Notes';
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

// Get a specific note by ID
export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = await params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get('authToken');

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

    const note = await Notes.findOne({ _id: id, user: decoded.userId });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


// Delete a note by ID
export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const { id } = await params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get('authToken');

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

    // Find note and verify ownership
    let note = await Notes.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Verify user owns this note
    if (note.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    // Delete the note
    await Notes.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token.value);
    if (!decoded.success) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { title, description, tag, images, audio, attachments } = await request.json();

    const updatedNote = {};
    if (title) updatedNote.title = title;
    if (description) updatedNote.description = description;
    if (tag) updatedNote.tag = tag;
    if (Array.isArray(images)) updatedNote.images = images;
    if (audio !== undefined) updatedNote.audio = audio && audio.url ? { url: audio.url, duration: audio.duration || 0 } : null;
    if (Array.isArray(attachments)) updatedNote.attachments = attachments;

    const note = await Notes.findById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.user.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const updated = await Notes.findByIdAndUpdate(
      id,
      { $set: updatedNote },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
