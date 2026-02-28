import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get single expense
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ expenseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expenseId } = await params;

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Format date to YYYY-MM-DD for frontend
    const formattedExpense = {
      ...expense,
      date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : null,
    };

    return NextResponse.json(formattedExpense);
  } catch (error: any) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

// PATCH - Update expense
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ expenseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expenseId } = await params;
    const body = await request.json();

    const { title, amount, category, date, description, properties } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category || null;
    if (date !== undefined) updateData.date = new Date(date);
    if (description !== undefined) updateData.description = description || null;
    if (properties !== undefined) updateData.properties = properties || null;

    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: updateData,
    });

    return NextResponse.json(expense);
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ expenseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expenseId } = await params;

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete expense" },
      { status: 500 }
    );
  }
}
