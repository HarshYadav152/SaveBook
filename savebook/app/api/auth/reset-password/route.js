import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/mongodb.js";
import User from "@/lib/models/User.js";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password, otp } = await req.json();

    //Validate input
    if (!email || !password || !otp) {
      return NextResponse.json(
        { message: "Email, password and OTP are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email }).select(
      "+password +resetPasswordOtp +resetPasswordOtpExpires"
    );

    if (!user) {
      // generic message
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Check if OTP exists and is not expired
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires || user.resetPasswordOtpExpires < new Date()) {
      return NextResponse.json(
        { message: "OTP has expired or is invalid. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Update password
    user.password = password;

    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;

    await user.save();

    return NextResponse.json({
      message: "Password reset successful. Please login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
