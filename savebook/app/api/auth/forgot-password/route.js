import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb.js";
import User from "@/lib/models/User.js";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/lib/utils/sendOTP.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 to prevent email enumeration
      return NextResponse.json(
        { message: "If the account exists, an OTP will be sent." },
        { status: 200 }
      );
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Set OTP to expire in 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();

    await sendOTP(user.email, otp);

    return NextResponse.json(
      { message: "An OTP has been sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Server error occurred" },
      { status: 500 }
    );
  }
}
