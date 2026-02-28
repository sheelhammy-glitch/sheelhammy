import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all notifications
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isRead = searchParams.get("isRead");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (isRead !== null) where.isRead = isRead === "true";
    if (userId) where.userId = userId;

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get employee names for notifications
    const notificationsWithEmployeeNames = await Promise.all(
      notifications.map(async (notification) => {
        const employee = await prisma.user.findUnique({
          where: { id: notification.userId },
          select: { name: true },
        });

        return {
          id: notification.id,
          userId: notification.userId,
          employeeName: employee?.name || "غير معروف",
          message: notification.message,
          orderNumber: notification.order?.orderNumber || null,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        };
      })
    );

    return NextResponse.json(notificationsWithEmployeeNames);
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Create new notification
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, orderId, message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // If userId is "all", send to all employees
    if (userId === "all") {
      const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        select: { id: true },
      });

      const notifications = await Promise.all(
        employees.map((employee) =>
          prisma.notification.create({
            data: {
              userId: employee.id,
              orderId: orderId || null,
              message,
            },
          })
        )
      );

      return NextResponse.json(notifications, { status: 201 });
    }

    // Send to specific user
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        orderId: orderId || null,
        message,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create notification" },
      { status: 500 }
    );
  }
}

