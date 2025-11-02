import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db/mongodb';
import { clerkClient, getAuth } from '@clerk/nextjs/server';

export async function POST(request) {
    await dbConnect();

    try {
        const { userId } = getAuth(request);


        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user already exists in our database
        let existingUser = await User.findOne({ clerkId: userId });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Initialize the JS Backend SDK
        const client = await clerkClient()

        // Get the user's full Backend User object
        const user = await client.users.getUser(userId)
        console.log("user details from clerk : ",user)
        // Create user with Clerk data
        const newUser = await User.create({
            username: user.username ||user.emailAddresses[0]?.emailAddress?.split('@')[0],
            clerkId: userId,
        });

        return NextResponse.json({
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}