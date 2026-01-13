import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User"; // Adjust this path if your User model is in lib/models
import jwt from "jsonwebtoken";

// Helper to get User ID from the token (Modify based on your specific auth logic)
const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        if (!token) return null;
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        return decodedToken.id;
    } catch (error) {
        return null;
    }
};

export async function POST(request) {
    try {
        // 1. Get current User ID
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get Resource ID from body
        const { resourceId } = await request.json();
        if (!resourceId) {
            return NextResponse.json({ error: "Resource ID required" }, { status: 400 });
        }

        // 3. Find User
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 4. Toggle Logic
        const isBookmarked = user.bookmarks.includes(resourceId);
        let action;

        if (isBookmarked) {
            // Remove
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== resourceId);
            action = "removed";
        } else {
            // Add
            user.bookmarks.push(resourceId);
            action = "added";
        }

        await user.save();

        return NextResponse.json({ 
            message: "Success", 
            action, 
            bookmarks: user.bookmarks 
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}