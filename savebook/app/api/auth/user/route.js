import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/utils/JWT';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    const token = request.cookies.get('authToken')?.value;
    
    console.log('=== User Auth Check ===');
    console.log('Token exists:', !!token);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const tokenInfo = verifyJwtToken(token);
    console.log('Token info:', tokenInfo);
    
    if (!tokenInfo.success) {
      console.log('Token verification failed:', tokenInfo.error);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // FIX: Use tokenInfo.userId instead of tokenInfo.data._id
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
    console.error('User auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}