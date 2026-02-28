"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Briefcase, AlertTriangle, DollarSign, CheckCircle2, Eye } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  message: string;
  type: "assignment" | "revision" | "transfer" | "info";
  isRead: boolean;
  createdAt: string;
  orderId: string | null;
  orderNumber: string | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dashboard/notifications");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تحميل الإشعارات");
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    setIsMarkingRead(true);
    try {
      const response = await fetch("/api/dashboard/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      toast.success("تم تحديد الإشعار كمقروء");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تحديث الإشعار");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingRead(true);
    try {
      const response = await fetch("/api/dashboard/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to mark all notifications as read");
      }

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("تم تحديد جميع الإشعارات كمقروءة");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تحديث الإشعارات");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "revision":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "transfer":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const readNotifications = notifications.filter((n) => n.isRead).length;

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="الإشعارات"
          description="جاري تحميل الإشعارات..."
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <PageHeader
          title="الإشعارات"
          description="متابعة جميع الإشعارات والتنبيهات"
        />
        {unreadNotifications > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingRead}
            variant="outline"
          >
            <CheckCircle2 className="h-4 w-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  إجمالي الإشعارات
                </p>
                <p className="mt-2 text-2xl font-bold">{totalNotifications}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  غير مقروء
                </p>
                <p className="mt-2 text-2xl font-bold text-yellow-600">
                  {unreadNotifications}
                </p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  مقروء
                </p>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {readNotifications}
                </p>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الإشعارات</CardTitle>
          <CardDescription>
            جميع الإشعارات المرسلة إليك
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                    !notification.isRead
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            !notification.isRead
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-xs text-gray-500">
                            {formatDateTime(notification.createdAt)}
                          </p>
                          {notification.orderId && notification.orderNumber && (
                            <>
                              <span className="text-gray-400">•</span>
                              <Link
                                href={`/dashboard/orders/${notification.orderId}`}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                الطلب #{notification.orderNumber}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <Badge variant="default" className="bg-blue-500">
                            جديد
                          </Badge>
                        )}
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={isMarkingRead}
                            className="h-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
