
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        await dbConnect();

        const note = await Notes.findById(id);

        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        if (!note.isPublic) {
            return NextResponse.json({ error: "Note is private" }, { status: 403 });
        }

        return NextResponse.json(note);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
