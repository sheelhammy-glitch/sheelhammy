import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get employee notifications
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only employees can access their notifications
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
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
      take: limit ? parseInt(limit) : undefined,
    });

    // Format notifications for frontend
    const formattedNotifications = notifications.map((notification) => {
      // Determine notification type based on message content
      let type = "info";
      if (notification.message.includes("إسناد") || notification.message.includes("طلب جديد")) {
        type = "assignment";
      } else if (notification.message.includes("تعديل") || notification.message.includes("مراجعة")) {
        type = "revision";
      } else if (notification.message.includes("تحويل") || notification.message.includes("مبلغ")) {
        type = "transfer";
      }

      return {
        id: notification.id,
        message: notification.message,
        type,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
        orderId: notification.order?.id || null,
        orderNumber: notification.order?.orderNumber || null,
      };
    });

    return NextResponse.json(formattedNotifications);
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all notifications as read for this user
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({ message: "All notifications marked as read" });
    }

    if (notificationId) {
      // Mark specific notification as read
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification || notification.userId !== session.user.id) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      return NextResponse.json({ message: "Notification marked as read" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}
