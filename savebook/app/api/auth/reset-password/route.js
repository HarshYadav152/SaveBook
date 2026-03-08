import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/mongodb.js";
import User from "@/lib/models/User.js";

export async function POST(req) {
  try {
    await dbConnect();

    const { identifier, password, otp, recoveryCode, method } = await req.json();

    // Validate generic inputs
    if (!identifier || !password || !method) {
      return NextResponse.json(
        { message: "Identifier (username/email), password, and method are required" },
        { status: 400 }
      );
    }

    if (method === "otp" && !otp) {
      return NextResponse.json(
        { message: "OTP is required for OTP reset method" },
        { status: 400 }
      );
    }

    if (method === "recoveryCode" && !recoveryCode) {
      return NextResponse.json(
        { message: "Recovery code is required for Recovery Code reset method" },
        { status: 400 }
      );
    }

    // Find user by identifier (can be email or username)
    // Searching by $or allows us to use one identifier input loosely, but typical patterns:
    // Email is typically for OTP, Username/Email for Recovery Codes
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password +resetPasswordOtp +resetPasswordOtpExpires +recoveryCodes");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    if (method === "otp") {
      // Check if OTP exists and is not expired
      if (
        !user.resetPasswordOtp ||
        !user.resetPasswordOtpExpires ||
        user.resetPasswordOtpExpires < new Date()
      ) {
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

      // Clear OTP fields upon success
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;

    } else if (method === "recoveryCode") {
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

      // Mark recovery code as used
      user.recoveryCodes[matchedIndex].used = true;
    } else {
      return NextResponse.json(
        { message: "Invalid reset method" },
        { status: 400 }
      );
    }

    // Update password

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
