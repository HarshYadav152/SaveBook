import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Notes from '@/lib/models/Notes';
import { verifyJwtToken } from '@/lib/utils/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    // Check for NextAuth session first (GitHub OAuth)
    const session = await getServerSession(authOptions);
    let userId = null;

    if (session?.user?.id) {
      // GitHub OAuth user
      userId = session.user.id;
    } else {
      // JWT token user (username/password)
      const token = request.cookies.get('authToken');
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const decoded = await verifyJwtToken(token.value);
      if (!decoded.success) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      userId = decoded.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.MONGODB_URI) {
      await dbConnect();
      const notes = await Notes.find({ user: userId });
      // Ensure we always return an array
      return NextResponse.json(Array.isArray(notes) ? notes : []);
    } else {
      // Offline mode: return empty array
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Notes GET error:', error);
    // Always return an empty array on error to prevent crashes
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const { title, description, tag } = await request.json();
    
    // Check for NextAuth session first (GitHub OAuth)
    const session = await getServerSession(authOptions);
    let userId = null;

    if (session?.user?.id) {
      // GitHub OAuth user
      userId = session.user.id;
    } else {
      // JWT token user (username/password)
      const token = request.cookies.get('authToken');
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const decoded = await verifyJwtToken(token.value);
      if (!decoded.success) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      userId = decoded.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await Notes.create({
      title,
      description,
      tag,
      user: userId
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Notes POST error:', error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}