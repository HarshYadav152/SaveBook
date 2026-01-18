import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";
import { NextResponse } from 'next/server';

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
        phone: user.phone,        // newly added field
        email: user.email,        // newly added field
        gender: user.gender,      // newly added field
        dob: user.dob,            // newly added field
        bio: user.bio,
        location: user.location
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}