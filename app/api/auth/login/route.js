import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateAuthToken } from '@/lib/utils/JWT';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, password } = await request.json();

    // Find user
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate token
    const {authToken} = await generateAuthToken(user._id);
    
    // Create response
    const response = NextResponse.json(
      { 
        success: true,
        data: {
          user: {
            username:user.username
          },
          authToken
        },
        message: "Login successful" 
      },
      { status: 200 }
    );
    
    // Set cookie
    response.cookies.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: error.statusCode || 500 }
    );
  }
}