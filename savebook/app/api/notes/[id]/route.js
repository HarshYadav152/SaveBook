import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongodb';
import Notes from '@/lib/models/Notes';
import { verifyJwtToken } from '@/lib/utils/JWT';

// Get a specific note by ID
export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get('authToken');
    const { userId } = await verifyJwtToken(token.value)

    const note = await Notes.findOne({ _id: id, user: userId });

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

// Update a note by ID
export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get('authToken');
    const { userId } = await verifyJwtToken(token.value)

    const { title, description, tag } = await request.json();

    // Create updated note object
    const updatedNote = {};
    if (title) updatedNote.title = title;
    if (description) updatedNote.description = description;
    if (tag) updatedNote.tag = tag;

    // Find note and verify ownership
    let note = await Notes.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Verify user owns this note
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    // Update the note
    note = await Notes.findByIdAndUpdate(
      id,
      { $set: updatedNote },
      { new: true }
    );

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
    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const token = request.cookies.get('authToken');
    const { userId } = await verifyJwtToken(token.value)

    // Find note and verify ownership
    let note = await Notes.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Verify user owns this note
    if (note.user.toString() !== userId) {
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