import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    // Connect to database
    await dbConnect();

    // Get token from cookies
    const authtoken = request.cookies.get("authToken");
    if (!authtoken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyJwtToken(authtoken.value);
    if (!decoded || !decoded.success) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Get user ID from token
    const userId = new mongoose.Types.ObjectId(decoded.userId);

    // Get updated user data from request
    const {
      profileImage,
      firstName,
      lastName,
      bio,
      location,
      phone,
      email,
      gender,
      dob
    } = await request.json();

    // Update user with validation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(profileImage !== undefined && { profileImage }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(gender !== undefined && { gender }),
        ...(dob !== undefined && { dob })
      },
      {
        new: true,
        select: "-password",
        runValidators: true // enforce schema validation
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return success response with updated user data
    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: {
          username: updatedUser.username,
          profileImage: updatedUser.profileImage,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          bio: updatedUser.bio,
          location: updatedUser.location,
          phone: updatedUser.phone,
          email: updatedUser.email,
          gender: updatedUser.gender,
          dob: updatedUser.dob
        }
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors explicitly
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}