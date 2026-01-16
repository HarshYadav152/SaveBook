import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/mongodb.js";
import User from "@/lib/models/User.js";

export async function POST(req) {
  await dbConnect();

  const { username, password, recoveryCode } = await req.json();

  //Validate input
  if (!username || !password || !recoveryCode) {
    return NextResponse.json(
      { message: "Username, password and recovery code are required" },
      { status: 400 }
    );
  }

  // Find user by username
  const user = await User.findOne({ username }).select(
    "+password +recoveryCodes"
  );

  if (!user) {
    // generic message
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  // Verify recovery code 
  let matchedIndex = -1;

  for (let i = 0; i < user.recoveryCodes.length; i++) {
    const rc = user.recoveryCodes[i];

    if (!rc.used) {
      const isMatch = await bcrypt.compare(recoveryCode, rc.code);
      if (isMatch) {
        matchedIndex = i;
        break;
      }
    }
  }

  if (matchedIndex === -1) {
    return NextResponse.json(
      { message: "Invalid or already used recovery code" },
      { status: 400 }
    );
  }

  //Mark recovery code as used
  user.recoveryCodes[matchedIndex].used = true;

  // Update password
  user.password = password;

  await user.save();

  return NextResponse.json({
    message: "Password reset successful. Please login.",
  });
}
