import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Notes from '@/lib/models/Notes';
import { verifyJwtToken } from '@/lib/utils/JWT';

export async function GET(request) {
  if (process.env.MONGODB_URI) {
    await dbConnect();
  }

  try {
    if (process.env.MONGODB_URI) {
      const token = request.cookies.get('authToken');
      const {userId} = verifyJwtToken(token.value)

      const notes = await Notes.find({ user: userId });
      return NextResponse.json(notes);
    } else {
      // Offline mode: return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {

    const { title, description, tag } = await request.json();
    const token = request.cookies.get('authToken');

    const {userId} = verifyJwtToken(token.value)
    const note = await Notes.create({
      title,
      description,
      tag,
      user: userId
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