import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateAuthToken } from "@/lib/utils/JWT";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, password } = await request.json();

    // Find user
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate token - pass userId as string
    const { authToken } = await generateAuthToken(user._id.toString());

    // Create response
    const response = NextResponse.json(
      { 
        success: true,
        data: {
          user: {
            username: user.username,
            profileImage: user.profileImage,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            location: user.location
          }
        },
        message: "Login successful" 
      },
      { status: 200 }
    );
    
    // Set cookie with 'lax' sameSite for better compatibility
    response.cookies.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    console.log('Cookie set successfully');
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}