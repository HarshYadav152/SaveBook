import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db/mongodb";

export async function POST(request) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    // ✅ Input validation
    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    // ✅ Prevent username enumeration
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Unable to create account" },
        { status: 400 }
      );
    }

    // ✅ Create user
    await User.create({
      username,
      password
    });

    return NextResponse.json(
      { success: true, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
