import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// GET - Get employee orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only employees can access their own orders
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {
      employeeId: session.user.id,
    };

    if (status) {
      where.status = status as OrderStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { student: { name: { contains: search } } },
        { service: { title: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format orders for the frontend
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      service: order.service,
      student: order.student,
      totalPrice: order.totalPrice,
      employeeProfit: order.employeeProfit,
      deadline: order.deadline?.toISOString().split("T")[0] || null,
      createdAt: order.createdAt.toISOString().split("T")[0],
      updatedAt: order.updatedAt.toISOString().split("T")[0],
      priority: order.priority,
      subjectName: order.subjectName,
      orderType: order.orderType,
      description: order.description,
      revisionCount: order.revisionCount,
      grade: order.grade,
      gradeType: order.gradeType,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
