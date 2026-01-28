import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: {
        name: "asc", 
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const { name, email, password, selectedRole } = await req.json();

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: {
          connect: {
            id: selectedRole,
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, email, password, selectedRole } = await req.json();

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
        name,
        email,
        password: hashedPassword, // Only update password if a new password is provided
        role: {
          connect: {
            id: selectedRole,
          },
        },
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
