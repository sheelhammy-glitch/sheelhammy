import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// GET - Get employee orders with deadlines
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only employees can access their deadlines
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = session.user.id;

    // Get orders with deadlines, excluding completed and cancelled
    const orders = await prisma.order.findMany({
      where: {
        employeeId: userId,
        deadline: { not: null },
        status: {
          notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        },
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    // Format orders for frontend
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      service: order.service.title,
      studentName: order.student.name,
      status: order.status,
      employeeProfit: order.employeeProfit,
      deadline: order.deadline?.toISOString() || null,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error("Error fetching deadlines:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch deadlines" },
      { status: 500 }
    );
  }
}
