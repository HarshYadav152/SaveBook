import { NextResponse } from "next/server";

export async function GET() {
  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`,
    scope: "read:user user:email",
    state: "github_oauth_state", 
  };

  const qs = new URLSearchParams(options);
  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}