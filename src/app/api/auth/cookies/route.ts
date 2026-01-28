import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const userToken = req.cookies.get("authjs.csrf-token")?.value;
  return new Response(JSON.stringify({ userToken }), { status: 200 });
}
