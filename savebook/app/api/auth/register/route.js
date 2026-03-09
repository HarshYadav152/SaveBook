import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db/mongodb";

export async function POST(request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // ✅ Input validation
    if (
      !username ||
      !email ||
      !password ||
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    // ✅ Prevent username or email enumeration
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 400 }
      );
    }

    // ✅ Create user
    await User.create({
      username,
      email,
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
