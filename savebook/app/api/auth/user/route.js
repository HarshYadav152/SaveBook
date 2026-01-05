import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyJwtToken } from "@/lib/utils/JWT";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get token from cookies
    const authToken = request.cookies.get("authToken");
    
    // Check if token exists
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { 
          success: false,
          error: "Authentication required" 
        }, 
        { status: 401 }
      );
    }
    
    // Verify token
    let decoded;
    try {
      decoded = verifyJwtToken(authToken.value);
    } catch (jwtError) {
      // Handle JWT-specific errors
      if (jwtError.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { 
            success: false,
            error: "Invalid authentication token" 
          }, 
          { status: 401 }
        );
      }
      if (jwtError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { 
            success: false,
            error: "Authentication token expired. Please login again." 
          }, 
          { status: 401 }
        );
      }
      throw jwtError; // Re-throw if not JWT error
    }
    
    // Verify decoded token has userId
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid authentication token" 
        }, 
        { status: 401 }
      );
    }
    
    // Find user by ID but exclude the password
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: "User not found" 
        }, 
        { status: 404 }
      );
    }
    
    // Return user data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          createdAt: user.date
        }
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error fetching user:", error);
    
    // Never expose internal error details
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch user data" 
      }, 
      { status: 500 }
    );
  }
}