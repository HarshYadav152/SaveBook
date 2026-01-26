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

    // Find user and include password field
    const user = await User.findOne({ username }).select("+password");

    // Compare password securely
    const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate auth token
    const { authToken } = await generateAuthToken(user._id.toString());

    // FIRST LOGIN: generate recovery codes
    let recoveryCodes = null;
    if (!user.recoveryCodes || user.recoveryCodes.length === 0) {
      const generated = generateRecoveryCodes(8);

      user.recoveryCodes = generated.hashedCodes;
      await user.save();

      // Plain codes only sent once
      recoveryCodes = generated.plainCodes;
    }

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
          // only present on first login
          recoveryCodes,
        },
        message: "Login successful",
      },
      { status: 200 }
    );

    response.cookies.set("authToken", authToken, {
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