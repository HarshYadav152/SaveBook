import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Connect to database
        await dbConnect();

        // Get token from cookies
        const authToken = request.cookies.get('authToken');
        const tokenValue = authToken?.value;

    await dbConnect();
    
    // Use tokenInfo.userId instead of tokenInfo.data._id
    const user = await User.findById(tokenInfo.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
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