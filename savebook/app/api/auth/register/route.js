import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db/mongodb";

export async function POST(request) {
  await dbConnect();

  try {
    const { username, password } = await request.json();

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Password strength check
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (user) {
      return NextResponse.json(
        { success: false, message: "User with this username already exists" },
        { status: 400 }
      );
    }

    // Try creating user
    try {
      await User.create({ username, password });

      return NextResponse.json(
        { success: true, message: "Account created successfully" },
        { status: 201 }
      );
    } catch (err) {
      // Handle duplicate key error explicitly
      if (err.code === 11000) {
        return NextResponse.json(
          { success: false, message: "Username already taken" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: err.message || "Failed to create user" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}