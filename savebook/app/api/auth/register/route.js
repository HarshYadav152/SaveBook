import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db/mongodb';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { username, password } = await request.json();
    
    // Check if user exists
    let user = await User.findOne({ username });
   if (user) {
  const suggestions = [
    `${username}_01`,
    `${username}_${Math.floor(Math.random() * 100)}`,
    `${username}_notes`,
    `${username}_saveBook`,
    `${username}_${Date.now() % 1000}`
  ];

  return NextResponse.json(
    {
      success: false,
      message: "This username is already taken",
      suggestions
    },
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
      success: true,
      message: "User registered successfully"
    });
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}