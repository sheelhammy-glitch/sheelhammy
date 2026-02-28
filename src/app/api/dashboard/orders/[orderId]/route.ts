import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// GET - Get single order (employee only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only employees can access their own orders
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            whatsapp: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify the order belongs to this employee
    if (order.employeeId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse JSON fields
    const clientFiles = order.clientFiles
      ? (JSON.parse(order.clientFiles) as Array<{ name: string; url: string }>)
      : [];
    const workFiles = order.workFiles
      ? (JSON.parse(order.workFiles) as Array<{ name: string; url: string }>)
      : [];

    // Format order for frontend
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      service: order.service,
      student: order.student,
      totalPrice: order.totalPrice,
      employeeProfit: order.employeeProfit,
      deadline: order.deadline?.toISOString() || null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      clientFiles,
      workFiles,
      revisionNotes: order.revisionNotes,
      priority: order.priority,
      subjectName: order.subjectName,
      orderType: order.orderType,
      description: order.description,
      revisionCount: order.revisionCount,
      grade: order.grade,
      gradeType: order.gradeType,
      paymentType: order.paymentType,
      paymentInstallments: order.paymentInstallments,
      discount: order.discount,
    };

    return NextResponse.json(formattedOrder);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH - Update order (employee actions: start work, deliver)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only employees can update their own orders
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderId } = await params;
    const body = await request.json();

    const { status, workFiles } = body;

    // Verify the order belongs to this employee
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { employeeId: true, status: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.employeeId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {};

    // Employee can only update status to IN_PROGRESS or DELIVERED
    if (status) {
      if (status === "IN_PROGRESS" && existingOrder.status === "ASSIGNED") {
        updateData.status = OrderStatus.IN_PROGRESS;
      } else if (status === "DELIVERED" && (existingOrder.status === "IN_PROGRESS" || existingOrder.status === "REVISION")) {
        updateData.status = OrderStatus.DELIVERED;
      } else {
        return NextResponse.json(
          { error: "Invalid status transition" },
          { status: 400 }
        );
      }
    }

    // Update work files
    if (workFiles !== undefined) {
      updateData.workFiles = workFiles ? JSON.stringify(workFiles) : null;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            whatsapp: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    // Parse JSON fields for response
    const clientFiles = order.clientFiles
      ? (JSON.parse(order.clientFiles) as Array<{ name: string; url: string }>)
      : [];
    const workFilesParsed = order.workFiles
      ? (JSON.parse(order.workFiles) as Array<{ name: string; url: string }>)
      : [];

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      service: order.service,
      student: order.student,
      totalPrice: order.totalPrice,
      employeeProfit: order.employeeProfit,
      deadline: order.deadline?.toISOString() || null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      clientFiles,
      workFiles: workFilesParsed,
      revisionNotes: order.revisionNotes,
      priority: order.priority,
      subjectName: order.subjectName,
      orderType: order.orderType,
      description: order.description,
      revisionCount: order.revisionCount,
      grade: order.grade,
      gradeType: order.gradeType,
      paymentType: order.paymentType,
      paymentInstallments: order.paymentInstallments,
      discount: order.discount,
    };

    return NextResponse.json(formattedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
