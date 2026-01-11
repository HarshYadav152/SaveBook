import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";
import User from "@/lib/models/User";
import { verifyJwtToken } from "@/lib/utils/jwt";
import mongoose from "mongoose";

export async function GET(request) {
  await dbConnect();

  try {
    const cookie = request.headers.get("cookie");
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const match = cookie.match(/authToken=([^;]+)/);
    if (!match) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyJwtToken(match[1]);
    if (!decoded.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notes = await Notes.find({
      user: new mongoose.Types.ObjectId(decoded.userId),
    }).lean();

    return NextResponse.json(notes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}