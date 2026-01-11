import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { verifyJwtToken } from "@/lib/utils/jwt";

export async function GET(request) {
  await dbConnect();

  try {
    const token = request.cookies.get("authToken")?.value;
    if(!token){
      return NextResponse.json({error:"Token not provided"},{status:401})
    }
    const decoded = await verifyJwtToken(token);
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

export async function POST(request) {
  try {
    await dbConnect();

    // Auth
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }
    const decoded = await verifyJwtToken(token);
    if (!decoded.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body
    const body = await request.json();
    const { title, description, tag} = body;


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
      tag: tag.trim(),
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}