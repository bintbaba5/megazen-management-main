import { prisma } from "@/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const { id, password } = await req.json();

    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Hash the new password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword, // Only update password if a new password is provided
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while updating the profile." },
      { status: 500 }
    );
  }
}
