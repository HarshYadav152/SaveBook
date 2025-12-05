import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create a response
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
    
    // Clear the auth token cookie
    response.cookies.set("authToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/"
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Logout failed" },
      { status: 500 }
    );
  }
}