import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

// GET: Retrieve all expenses
export async function GET() {
  try {
    const expenses = await prisma.expenses.findMany({
      orderBy: {
        title: "asc", 
      },
    });
    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching expenses." },
      { status: 500 }
    );
  }
}

// POST: Add a new expense
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request payload
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { title,description, amount, date } = body;

    // Validate required fields
    if (!title|| !description || !amount || !date) {
      return NextResponse.json(
        { error: "title, description, amount, and date are required." },
        { status: 400 }
      );
    }

    // Create a new expense in the database
    const expense = await prisma.expenses.create({
      data: {
        title,
        description,
        amount: parseFloat(amount),
        date: new Date(date), 
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("Error adding new expense:", error);
    return NextResponse.json(
      { error: "Something went wrong while adding the expense." },
      { status: 500 }
    );
  }
}
