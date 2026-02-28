import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all payment records
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentRecords = await prisma.paymentRecord.findMany({
      include: {
        order: {
          include: {
            student: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(paymentRecords);
  } catch (error: any) {
    console.error("Error fetching payment records:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment records" },
      { status: 500 }
    );
  }
}

// POST - Create new payment record
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, amount, paymentType, paidBy, paymentDate, notes } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Order ID and amount are required" },
        { status: 400 }
      );
    }

    // Create payment record
    const paymentRecord = await prisma.paymentRecord.create({
      data: {
        orderId,
        amount: parseFloat(amount),
        paymentType: paymentType || "cash",
        paidBy: paidBy || null,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        notes: notes || null,
      },
      include: {
        order: true,
      },
    });

    return NextResponse.json(paymentRecord, { status: 201 });
  } catch (error: any) {
    console.error("Error creating payment record:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment record" },
      { status: 500 }
    );
  }
}
