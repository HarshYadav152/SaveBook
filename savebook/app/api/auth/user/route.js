import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyJwtToken } from "@/lib/utils/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Connect to database
        await dbConnect();

        // Get token from authorization header
        const authtoken = request.cookies.get("authToken");
        console.log("authtoken from cookies : ",authtoken)
        // Verify token
        const decoded = verifyJwtToken(authtoken.value);
        console.log("decoded user : ",decoded)
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
        }

        // Find user by ID but exclude the password
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return user data
        return NextResponse.json({ 
            success: true, 
            user: {
                username:user.username
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}