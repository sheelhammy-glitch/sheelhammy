import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// GET - Get employee dashboard stats
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only employees can access their stats
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = session.user.id;

    // Count in-progress orders (IN_PROGRESS, REVISION)
    const inProgressOrders = await prisma.order.count({
      where: {
        employeeId: userId,
        status: {
          in: [OrderStatus.IN_PROGRESS, OrderStatus.REVISION],
        },
      },
    });

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

    // Calculate transferred earnings
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

    return NextResponse.json({
      inProgressOrders,
      pendingEarnings,
      totalEarnings,
      completedOrders,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
