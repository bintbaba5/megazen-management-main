// pages/api/roles/route.ts or app/api/roles/route.ts (depending on your directory structure)

import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

// Function to get Roles
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        name: "asc", 
      },
    });
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// Function to create a new Role
export async function POST(request: Request) {
  try {
    const { name, description } = await request.json(); // Parse the body of the POST request

    if (!name) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 }
      );
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}

// Function to update an existing Role
export async function PUT(request: Request) {
  try {
    const { id, name, description } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "Role id and name are required" },
        { status: 400 }
      );
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

// Function to delete a Role
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Role id is required" },
        { status: 400 }
      );
    }

    const deletedRole = await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json(deletedRole, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}
