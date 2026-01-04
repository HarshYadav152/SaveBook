import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateAuthToken } from '@/lib/utils/JWT';
import { NextResponse } from 'next/server';

// Helper function to validate login input
function validateLoginInput(username, password) {
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push("Username is required");
  }
  
  if (!password || password.length === 0) {
    errors.push("Password is required");
  }
  
  return errors;
}

export async function POST(request) {
  try {
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    const { username, password } = body;
    
    // Validate input
    const validationErrors = validateLoginInput(username, password);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: validationErrors 
        },
        { status: 400 }
      );
    }
    
    // Sanitize username (trim and lowercase to match registration)
    const sanitizedUsername = username.trim().toLowerCase();
    
    // Find user
    const user = await User.findOne({ username: sanitizedUsername }).select("+password");
    
    // Always check password even if user not found (prevents timing attacks)
    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await user.comparePassword(password);
    }
    
    // Return same error for both invalid username and invalid password
    // This prevents username enumeration attacks
    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid username or password" 
        },
        { status: 401 }
      );
    }
    
    // Generate token
    const { authToken } = await generateAuthToken(user._id);
    
    // Create response (don't include token in body for security)
    const response = NextResponse.json(
      {
        success: true,
        user: {
          username: user.username
        },
        message: "Login successful"
      },
      { status: 200 }
    );
    
    // Set httpOnly cookie (most secure way to store auth token)
    response.cookies.set('authToken', authToken, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error("Login error:", error);
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request body" 
        },
        { status: 400 }
      );
    }
    
    // Never expose internal error details to users
    return NextResponse.json(
      { 
        success: false, 
        error: "Login failed. Please try again." 
      },
      { status: 500 }
    );
  }
}