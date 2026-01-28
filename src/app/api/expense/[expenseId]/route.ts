import { NextResponse } from "next/server";
import { prisma } from "@/prisma"; // Assuming Prisma is properly configured

// PUT: Update an expense
export async function PUT(req: Request) {
  try {
    const id = parseInt(req.url.split("/").pop() || "", 10); // Extract ID from URL

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid Expense ID format." },
        { status: 400 }
      );
    }

    const expenseData = await req.json(); // Get data from the request body

    // Validate expense data
    const { title, description, amount, date } = expenseData;
    if (!title || !description || !amount || !date) {
      return NextResponse.json(
        { error: "Title, Description, Amount, and Date are required." },
        { status: 400 }
      );
    }

    const updatedExpense = await prisma.expenses.update({
      where: { expenseId: id },
      data: {
        title,
        description,
        amount,
        date: new Date(date), // Ensure date is saved as a Date object
      },
    });

    return NextResponse.json({ expense: updatedExpense });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// DELETE: Delete an expense
export async function DELETE(req: Request) {
  try {
    const id = parseInt(req.url.split("/").pop() || "", 10); // Extract ID from URL

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid Expense ID format." },
        { status: 400 }
      );
    }

    const expense = await prisma.expenses.findUnique({
      where: { expenseId: id },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found." },
        { status: 404 }
      );
    }

    // Delete the expense
    await prisma.expenses.delete({
      where: { expenseId: id },
    });

    return NextResponse.json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
