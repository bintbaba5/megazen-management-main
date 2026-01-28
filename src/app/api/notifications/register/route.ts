import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user?.id;
  console.log(userId);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    if (token) {
      return NextResponse.json(
        { error: "Notification doesn't exist" },
        { status: 400 }
      );
    }
    if (user.notificationToken === token) {
      return NextResponse.json(
        { error: "Notification already registered" },
        { status: 400 }
      );
    }
    const existingNotification = await prisma.user.findFirst({
      where: {
        id: userId,
        notificationToken: token,
      },
    });
    if (existingNotification) {
      return NextResponse.json(
        { error: "Notification already registered" },
        { status: 400 }
      );
    }
    const notification = await prisma.user.update({
      where: { id: userId },
      data: { notificationToken: token },
    });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register notification", details: error },
      { status: 500 }
    );
  }
}
