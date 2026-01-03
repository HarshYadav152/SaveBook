import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Notes from '@/lib/models/Notes';
import { verifyJwtToken } from '@/lib/utils/JWT';

// Helper function to validate note input
function validateNoteInput(title, description, tag) {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  } else if (title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  } else if (title.trim().length > 100) {
    errors.push("Title must not exceed 100 characters");
  }
  
  if (!description || description.trim().length === 0) {
    errors.push("Description is required");
  } else if (description.trim().length < 5) {
    errors.push("Description must be at least 5 characters long");
  } else if (description.trim().length > 2000) {
    errors.push("Description must not exceed 2000 characters");
  }
  
  if (tag && tag.trim().length > 50) {
    errors.push("Tag must not exceed 50 characters");
  }
  
  return errors;
}

export async function GET(request) {
  await dbConnect();
  
  try {
    // Check if auth token exists
    const token = request.cookies.get('authToken');
    if (!token || !token.value) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Verify token and get user ID
    const { userId } = verifyJwtToken(token.value);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
    
    const notes = await Notes.find({ user: userId });
    return NextResponse.json(notes);
    
  } catch (error) {
    console.error("Error fetching notes:", error);
    
    // Handle JWT verification errors specifically
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: "Invalid or expired authentication token" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  
  try {
    // Check if auth token exists
    const token = request.cookies.get('authToken');
    if (!token || !token.value) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Verify token and get user ID
    const { userId } = verifyJwtToken(token.value);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const { title, description, tag } = body;
    
    // Validate input
    const validationErrors = validateNoteInput(title, description, tag);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }
    
    // Sanitize input by trimming whitespace
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    const sanitizedTag = tag ? tag.trim() : '';
    
    // Create note
    const note = await Notes.create({
      title: sanitizedTitle,
      description: sanitizedDescription,
      tag: sanitizedTag,
      user: userId
    });
    
    return NextResponse.json(note, { status: 201 });
    
  } catch (error) {
    console.error("Error creating note:", error);
    
    // Handle JWT verification errors specifically
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: "Invalid or expired authentication token" },
        { status: 401 }
      );
    }
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Database validation failed", details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}