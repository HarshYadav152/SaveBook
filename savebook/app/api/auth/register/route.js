import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db/mongodb';

export async function POST(request) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 400 }
      );
    }

    // Create user
    await User.create({
      username,
      password
    });

    // Set cookie and return response
    const response = NextResponse.json({
      success: true
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}