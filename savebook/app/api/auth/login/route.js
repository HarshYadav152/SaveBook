import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { generateAuthToken } from "@/lib/utils/jwtAuth";   // ensure lowercase filename
import { generateRecoveryCodes } from "@/lib/utils/recoveryCodes";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();
    

    const { username, password } = await request.json();
    if (
  !username ||
  !password ||
  typeof username !== "string" ||
  typeof password !== "string"
) {
  return NextResponse.json(
    { success: false, message: "Invalid username or password" },
    { status: 400 }
  );
}

    // Find user
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid Username! Try Again!" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate token and set cookie
    const { authToken } = await generateAuthToken(user._id.toString());

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
            location: user.location,
          },
          //  only present on first login
          recoveryCodes,
        },
        message: "Login successful"
      },
      { status: 200 }
    );
    
    // Set cookie only on success
    response.cookies.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
