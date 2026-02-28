import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all transfers
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transfers = await prisma.transfer.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format transfers for frontend
    const formattedTransfers = transfers.map((transfer) => ({
      id: transfer.id,
      employeeId: transfer.employeeId,
      employeeName: transfer.employee.name,
      amount: transfer.amount,
      status: transfer.status,
      receiptImage: transfer.receiptImage,
      createdAt: transfer.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json(formattedTransfers);
  } catch (error: any) {
    console.error("Error fetching transfers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch transfers" },
      { status: 500 }
    );
  }
}

// POST - Create new transfer
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { employeeId, amount, receiptImage, status } = body;

    if (!employeeId || !amount) {
      return NextResponse.json(
        { error: "Employee ID and amount are required" },
        { status: 400 }
      );
    }

    const transfer = await prisma.transfer.create({
      data: {
        employeeId,
        amount: parseFloat(amount),
        receiptImage: receiptImage || null,
        status: status || "COMPLETED",
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(transfer, { status: 201 });
  } catch (error: any) {
    console.error("Error creating transfer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create transfer" },
      { status: 500 }
    );
  }
}
