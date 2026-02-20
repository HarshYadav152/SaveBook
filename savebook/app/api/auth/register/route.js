import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db/mongodb";

export async function POST(request) {
  try {
    await dbConnect();

    const { username, password, email, education, course, phoneNumber, subjectsOfInterest, name } = await request.json();

    // ✅ Input validation
    if (
      !username ||
      !password ||
      !email ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof email !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Username, password (min 6 chars), and email are required." },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    // ✅ Prevent username/email enumeration
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username or Email already exists" },
        { status: 400 }
      );
    }

    // Split name into firstName and lastName if provided
    let firstName = '';
    let lastName = '';
    if (name) {
      const parts = name.trim().split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    // ✅ Create user
    await User.create({
      username,
      password,
      email,
      education,
      course,
      phoneNumber,
      subjectsOfInterest: Array.isArray(subjectsOfInterest) ? subjectsOfInterest : [],
      firstName,
      lastName
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
