import { auth } from "@/auth";
// import  getServerSession  from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();

  if (session) {
    // Optionally, clear additional tokens if using JWT or third-party providers.
    return NextResponse.redirect(new URL("/login", req.url), {
      headers: {
        "Set-Cookie": `next-auth.session-token=; Path=/; HttpOnly; Max-Age=0;`,
      },
    });
  }

  return NextResponse.redirect(new URL("/login", req.url));
}
