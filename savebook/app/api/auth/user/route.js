import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
<<<<<<< HEAD
import { verifyJwtToken } from "@/lib/utils/jwtAuth";
=======
import { verifyJwtToken } from "@/lib/utils/jwtAuth";   // ensure lowercase filename
>>>>>>> 8a479bb (Used jwtAuth instead of jwt and removed the file middleware.js)
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();

    // Get token from cookies
    const authToken = request.cookies.get("authToken");
    const tokenValue = authToken?.value;

    if (!tokenValue) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const tokenInfo = await verifyJwtToken(tokenValue);

    if (!tokenInfo || !tokenInfo.success) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Find user by ID but exclude the password
    const user = await User.findById(tokenInfo.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        profileImage: user.profileImage,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        location: user.location
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}