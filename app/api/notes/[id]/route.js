import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";
import User from "@/lib/models/User";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid note ID" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const note = await Notes.findOne({ _id: id, user: user._id });
        if (!note) {
            return NextResponse.json(
                { error: "Note not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
// For the PUT route, update the ownership check:
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const { id } = await params;
        const user = await User.findOne({ clerkId: userId });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
        }

        const { title, description, tag } = await req.json();

        // Find note and verify ownership
        let note = await Notes.findOne({ 
            _id: id,
            user: user._id  // Compare with user._id directly
        });

        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        // Update the note (no need for separate ownership check since we queried with user._id)
        note = await Notes.findByIdAndUpdate(
            id,
            { $set: { title, description, tag } },
            { new: true }
        );

        return NextResponse.json(note);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// For the DELETE route, update the ownership check similarly:
export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const user = await User.findOne({ clerkId: userId });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find and delete note in one operation, checking ownership
        const note = await Notes.findOneAndDelete({ 
            _id: id,
            user: user._id
        });

        if (!note) {
            return NextResponse.json({ error: "Note not found or not authorized" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}