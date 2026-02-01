import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { generateAuthToken } from "@/lib/utils/jwtAuth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=NoCode`);
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const githubUser = await userResponse.json();

    await dbConnect();

    let user = await User.findOne({ username: githubUser.login.toLowerCase() });

    if (!user) {
      user = await User.create({
        username: githubUser.login.toLowerCase(),
        password: Math.random().toString(36).slice(-10),
        profileImage: githubUser.avatar_url,
        firstName: githubUser.name || githubUser.login,
      });
    }

    const { authToken } = await generateAuthToken(user._id.toString());

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/notes`);
    
    response.cookies.set("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=OAuthFailed`);
  }
}