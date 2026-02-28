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
      return NextResponse.json({ success: false, message: "Unauthorized - No token provided" }, { status: 401 });
    }

    // Verify token
    const decoded = await verifyJwtToken(authtoken.value);

    if (!decoded || !decoded.success) {
      return NextResponse.json({ success: false, message: "Unauthorized - Invalid token" }, { status: 401 });
    }


    // Get user ID from token
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    // Get updated user data from request
    const { profileImage, firstName, lastName, bio, location, email, education, course, phoneNumber, subjectsOfInterest } = await request.json();

    // Check if email is being updated and if it's already taken
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(profileImage !== undefined && { profileImage }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(email !== undefined && { email }),
        ...(education !== undefined && { education }),
        ...(course !== undefined && { course }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(subjectsOfInterest !== undefined && { subjectsOfInterest })
      },
      { new: true, select: "-password" } // Return updated user without password
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Return success response with updated user data
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.bio,
        location: updatedUser.location,
        education: updatedUser.education,
        course: updatedUser.course,
        phoneNumber: updatedUser.phoneNumber,
        subjectsOfInterest: updatedUser.subjectsOfInterest
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}