import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb.js";
import User from "@/lib/models/User.js";

export async function POST(req) {
  await dbConnect();

  const { username } = await req.json();

  if (!username) {
    return NextResponse.json(
      { message: "Username is required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ username });

  // 🔐 Generic response (security best practice)
  // Username exists or not — response same
  if (!user) {
    return NextResponse.json(
      {
        message:
          "If the user exists, you can reset the password using your recovery code.",
      },
      { status: 200 }
    );
  }




  return NextResponse.json(
    {
      message:
        "Please reset your password using your username and one of your recovery codes.",
    },
    { status: 200 }
  );
}
