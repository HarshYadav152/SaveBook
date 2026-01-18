import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { verifyJwtToken } from "@/lib/utils/jwtAuth";

export async function GET(request) {
  await dbConnect();

  try {
    const token = request.cookies.get("authToken");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded = await verifyJwtToken(token.value);

    if (!decoded || !decoded.success) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notes = await Notes.find({
      user: new mongoose.Types.ObjectId(decoded.userId),
    }).lean();

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    // Auth
    const token = request.cookies.get("authToken");
    if (!token) {
      return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }

    const decoded = await verifyJwtToken(token.value);
    if (!decoded.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body
    const body = await request.json();
    const { title, description, tag, images } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Ensure user exists
    const user = await User.findById(decoded.userId).select("_id");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create note
    const note = await Notes.create({
      user: new mongoose.Types.ObjectId(decoded.userId),
      title: title.trim(),
      description: description.trim(),
      tag: tag?.trim() || "General",
      images: Array.isArray(images) ? images : [],
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}