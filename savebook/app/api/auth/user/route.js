import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyJwtToken } from "@/lib/utils/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Check for NextAuth session first
        const session = await getServerSession(authOptions);
        
        if (session) {
            // User is authenticated via NextAuth (GitHub)
            return NextResponse.json({
                success: true,
                user: {
                    id: session.user.id,
                    username: session.user.username || session.user.name,
                    email: session.user.email,
                    profileImage: session.user.image,
                    firstName: session.user.name?.split(' ')[0] || '',
                    lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
                    bio: '',
                    location: '',
                    isGithubUser: session.user.isGithubUser
                }
            }, { status: 200 });
        }
        
        if (process.env.MONGODB_URI) {
            // Connect to database
            await dbConnect();
        }

        // Get token from authorization header for traditional auth
        const authtoken = request.cookies.get("authToken");
        
        if (!authtoken) {
            return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
        }
        
        console.log("authtoken from cookies : ",authtoken)
        // Verify token
        const decoded = verifyJwtToken(authtoken.value);
        console.log("decoded user : ",decoded)
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
        }

        if (process.env.MONGODB_URI) {
            // Find user by ID but exclude the password
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            // Return user data
            return NextResponse.json({
                success: true,
                user: {
                    username: user.username,
                    profileImage: user.profileImage,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    bio: user.bio,
                    location: user.location
                }
            }, { status: 200 });
        } else {
            // Offline mode: return mock user
            return NextResponse.json({
                success: true,
                user: {
                    username: 'offline-user',
                    profileImage: null,
                    firstName: 'Offline',
                    lastName: 'User',
                    bio: 'Running in offline mode',
                    location: 'Local'
                }
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
