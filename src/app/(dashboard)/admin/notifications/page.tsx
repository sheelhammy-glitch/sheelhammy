"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";
import { Notification, getNotificationColumns } from "./_components/NotificationTable";
import { NotificationForm } from "./_components/NotificationForm";

type Employee = {
  id: string;
  name: string;
};

type Order = {
  id: string;
  orderNumber: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تحميل الإشعارات");
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/admin/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data.map((emp: any) => ({ id: emp.id, name: emp.name })));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.map((order: any) => ({ id: order.id, orderNumber: order.orderNumber })));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchEmployees();
    fetchOrders();
  }, []);

  const handleSuccess = () => {
    fetchNotifications();
  };

  const columns = getNotificationColumns();

  // Calculate stats
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const readNotifications = notifications.filter((n) => n.isRead).length;

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="الإشعارات"
          description="إرسال ومتابعة الإشعارات للموظفين"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الإشعارات"
        description="إرسال ومتابعة الإشعارات للموظفين"
        actions={
          <Button onClick={() => setIsSendDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إرسال إشعار
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                إجمالي الإشعارات
              </p>
              <p className="mt-2 text-2xl font-bold">{totalNotifications}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                غير مقروء
              </p>
              <p className="mt-2 text-2xl font-bold">{unreadNotifications}</p>
            </div>
            <Bell className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                مقروء
              </p>
              <p className="mt-2 text-2xl font-bold">{readNotifications}</p>
            </div>
            <Bell className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        searchKey="employeeName"
        searchPlaceholder="البحث باسم الموظف..."
        filterOptions={[
          {
            column: "isRead",
            title: "الحالة",
            options: [
              { label: "مقروء", value: "true" },
              { label: "غير مقروء", value: "false" },
            ],
          },
        ]}
      />

      <NotificationForm
        open={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
        employees={employees}
        orders={orders}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
