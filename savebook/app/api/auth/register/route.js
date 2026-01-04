import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db/mongodb';

// Helper function to validate registration input
function validateRegistrationInput(username, password) {
  const errors = [];
  
  // Username validation
  if (!username || username.trim().length === 0) {
    errors.push("Username is required");
  } else {
    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }
    
    if (trimmedUsername.length > 30) {
      errors.push("Username must not exceed 30 characters");
    }
    
    // Check for valid characters (alphanumeric, underscore, hyphen)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      errors.push("Username can only contain letters, numbers, underscores, and hyphens");
    }
  }
  
  // Password validation
  if (!password || password.length === 0) {
    errors.push("Password is required");
  } else {
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    
    if (password.length > 128) {
      errors.push("Password must not exceed 128 characters");
    }
    
    // Check for password strength (at least one letter and one number)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasLetter || !hasNumber) {
      errors.push("Password must contain at least one letter and one number");
    }
  }
  
  return errors;
}

export async function POST(request) {
  await dbConnect();
  
  try {
    // Parse request body
    const body = await request.json();
    const { username, password } = body;
    
    // Validate input
    const validationErrors = validateRegistrationInput(username, password);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }
    
    // Sanitize username (trim and convert to lowercase)
    const sanitizedUsername = username.trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ username: sanitizedUsername });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 409 } // 409 Conflict is more appropriate than 400
      );
    }
    
    // Create user (password will be hashed by the model's pre-save hook)
    await User.create({
      username: sanitizedUsername,
      password: password // Don't trim password - whitespace might be intentional
    });
    
    return NextResponse.json(
      { 
        success: true,
        message: "User registered successfully"
      },
      { status: 201 } // 201 Created is more appropriate than 200
    );
    
  } catch (error) {
    console.error("Error during registration:", error);
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    // Handle MongoDB duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 409 }
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
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}