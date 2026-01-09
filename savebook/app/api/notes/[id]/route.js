import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongodb';
import Notes from '@/lib/models/Notes';
import { verifyJwtToken } from '@/lib/utils/JWT';

// Helper function to validate note input for updates
function validateNoteUpdate(title, description, tag) {
  const errors = [];
  
  // Only validate if fields are provided (partial updates allowed)
  if (title !== undefined) {
    if (title.trim().length === 0) {
      errors.push("Title cannot be empty");
    } else if (title.trim().length < 3) {
      errors.push("Title must be at least 3 characters long");
    } else if (title.trim().length > 100) {
      errors.push("Title must not exceed 100 characters");
    }
  }
  
  if (description !== undefined) {
    if (description.trim().length === 0) {
      errors.push("Description cannot be empty");
    } else if (description.trim().length < 5) {
      errors.push("Description must be at least 5 characters long");
    } else if (description.trim().length > 2000) {
      errors.push("Description must not exceed 2000 characters");
    }
  }
  
  if (tag !== undefined && tag.trim().length > 50) {
    errors.push("Tag must not exceed 50 characters");
  }
  
  return errors;
}

// Get a specific note by ID
export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const { id } = await params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID format" },
        { status: 400 }
      );
    }
    
    // Check authentication
    const token = request.cookies.get('authToken');
    if (!token || !token.value) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Verify token
    let userId;
    try {
      const decoded = verifyJwtToken(token.value);
      userId = decoded.userId;
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError' || jwtError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: "Invalid or expired authentication token" },
          { status: 401 }
        );
      }
      throw jwtError;
    }
    
    // Find note by ID and verify ownership
    const note = await Notes.findOne({ _id: id, user: userId });
    
    if (!note) {
      return NextResponse.json(
        { error: "Note not found or you don't have permission to access it" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(note);
    
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

// Update a note by ID
export async function PUT(request, { params }) {
  await dbConnect();
  
  try {
    const { id } = await params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid note ID format" },
        { status: 400 }
      );
    }
    
    // Check authentication
    const token = request.cookies.get('authToken');
    if (!token || !token.value) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Verify token
    let userId;
    try {
      const decoded = verifyJwtToken(token.value);
      userId = decoded.userId;
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError' || jwtError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: "Invalid or expired authentication token" },
          { status: 401 }
        );
      }
      throw jwtError;
    }
    
    // Parse request body
    const body = await request.json();
    const { title, description, tag } = body;
    
    // Validate at least one field is provided
    if (title === undefined && description === undefined && tag === undefined) {
      return NextResponse.json(
        { error: "At least one field (title, description, or tag) must be provided for update" },
        { status: 400 }
      );
    }
    
    // Validate input
    const validationErrors = validateNoteUpdate(title, description, tag);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }
    
    // Find note and verify ownership
    const note = await Notes.findById(id);
    
    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    // Verify user owns this note
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to update this note" },
        { status: 403 } // 403 Forbidden is more appropriate than 401
      );
    }
    
    // Create updated note object with sanitized input
    const updatedNote = {};
    if (title !== undefined) updatedNote.title = title.trim();
    if (description !== undefined) updatedNote.description = description.trim();
    if (tag !== undefined) updatedNote.tag = tag.trim();
    
    // Update the note
    const updated = await Notes.findByIdAndUpdate(
      id,
      { $set: updatedNote },
      { new: true }
    );
    
    return NextResponse.json(updated);
    
  } catch (error) {
    console.error("Error updating note:", error);
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update note" },
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
        { error: "Invalid note ID format" },
        { status: 400 }
      );
    }
    
    // Check authentication
    const token = request.cookies.get('authToken');
    if (!token || !token.value) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Verify token
    let userId;
    try {
      const decoded = verifyJwtToken(token.value);
      userId = decoded.userId;
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError' || jwtError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: "Invalid or expired authentication token" },
          { status: 401 }
        );
      }
      throw jwtError;
    }
    
    // Find note and verify ownership
    const note = await Notes.findById(id);
    
    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    // Verify user owns this note
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to delete this note" },
        { status: 403 } // 403 Forbidden is more appropriate than 401
      );
    }
    
    // Delete the note
    await Notes.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Note deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}