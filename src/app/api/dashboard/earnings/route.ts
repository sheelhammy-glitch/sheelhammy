import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// GET - Get employee earnings stats and transfers
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only employees can access their earnings
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = session.user.id;

    // Calculate total earnings from completed orders
    const totalEarningsResult = await prisma.order.aggregate({
      where: {
        employeeId: userId,
        status: OrderStatus.COMPLETED,
      },
      _sum: {
        employeeProfit: true,
      },
      _count: {
        id: true,
      },
    });

    const totalEarnings = totalEarningsResult._sum.employeeProfit || 0;
    const completedOrders = totalEarningsResult._count.id || 0;

    // Calculate transferred earnings (from Transfer table)
    const transferredResult = await prisma.transfer.aggregate({
      where: {
        employeeId: userId,
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    const transferredEarnings = transferredResult._sum.amount || 0;

    // Pending earnings = total earnings - transferred earnings
    const pendingEarnings = totalEarnings - transferredEarnings;

    // Get transfers list for this employee
    const transfers = await prisma.transfer.findMany({
      where: {
        employeeId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format transfers
    const formattedTransfers = transfers.map((transfer) => ({
      id: transfer.id,
      amount: transfer.amount,
      status: transfer.status,
      receiptImage: transfer.receiptImage,
      createdAt: transfer.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({
      stats: {
        totalEarnings,
        pendingEarnings,
        transferredEarnings,
        completedOrders,
      },
      transfers: formattedTransfers,
    });
  } catch (error: any) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}
