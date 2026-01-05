import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Notes from '@/lib/models/Notes';
import { verifyJwtToken } from '@/lib/utils/JWT';

export async function GET(request) {
  await dbConnect();

  try {
    const token = request.cookies.get('authToken');
    const { userId } = verifyJwtToken(token.value)

    const notes = await Notes.find({ user: userId });
    return NextResponse.json(notes);
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

    const { title, description, tag, encryptedKey, contentIv, titleIv, keyIv } = await request.json();
    const token = request.cookies.get('authToken');

    const { userId } = verifyJwtToken(token.value)
    const note = await Notes.create({
      title,
      description,
      tag,
      user: userId,
      encryptedKey,
      contentIv,
      titleIv,
      keyIv
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