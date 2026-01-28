// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma"; // Ensure correct import for prisma

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    // Validate the input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 400 }
      );
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong during sign-up." },
      { status: 500 }
    );
  }
}
