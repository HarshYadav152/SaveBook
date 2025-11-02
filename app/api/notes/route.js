import dbConnect from "@/lib/db/mongodb";
import Notes from "@/lib/models/Notes";
import User from "@/lib/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const user = await User.find({ clerkId: userId })
        
        
        const notes = await Notes.find({ user: user[0]._id});
        return NextResponse.json(notes);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, tag } = await req.json();

        const user = await User.find({ clerkId: userId })

        const note = await Notes.create({
            title,
            description,
            tag,
            user: user[0]._id
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}