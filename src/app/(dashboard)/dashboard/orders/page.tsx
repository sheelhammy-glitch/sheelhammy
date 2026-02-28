"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { DashboardOrder } from "@/types/dashboard";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";

export default function OrdersPage() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/dashboard/orders");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ أثناء تحميل الطلبات");
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns: ColumnDef<DashboardOrder>[] = [
    {
      accessorKey: "orderNumber",
      header: "رقم الطلب",
    },
    {
      accessorKey: "service.title",
      header: "الخدمة",
      cell: ({ row }) => row.original.service.title,
    },
    {
      accessorKey: "student.name",
      header: "الطالب",
      cell: ({ row }) => row.original.student.name,
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "employeeProfit",
      header: "ربحي",
      cell: ({ row }) => formatCurrency(row.original.employeeProfit),
    },
    {
      accessorKey: "deadline",
      header: "الموعد النهائي",
      cell: ({ row }) => row.original.deadline ? formatDate(row.original.deadline) : "-",
    },
    {
      accessorKey: "priority",
      header: "الأولوية",
      cell: ({ row }) => {
        const priority = row.original.priority;
        if (!priority) return "-";
        return (
          <span className={priority === "urgent" ? "text-red-600 font-semibold" : ""}>
            {priority === "urgent" ? "عاجل" : "عادي"}
          </span>
        );
      },
    },
    {
      accessorKey: "subjectName",
      header: "المادة",
      cell: ({ row }) => row.original.subjectName || "-",
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/orders/${order.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => {
        if (activeTab === "new") return order.status === "ASSIGNED";
        if (activeTab === "in_progress") return order.status === "IN_PROGRESS";
        if (activeTab === "revision") return order.status === "REVISION";
        if (activeTab === "completed") return order.status === "COMPLETED" || order.status === "DELIVERED";
        return true;
      });

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="طلباتي"
          description="متابعة وإدارة جميع طلباتك"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="طلباتي"
        description="متابعة وإدارة جميع طلباتك"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="new">جديد</TabsTrigger>
          <TabsTrigger value="in_progress">قيد التنفيذ</TabsTrigger>
          <TabsTrigger value="revision">تعديل</TabsTrigger>
          <TabsTrigger value="completed">مكتمل</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد طلبات في هذا التصنيف
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredOrders}
              searchKey="orderNumber"
              searchPlaceholder="البحث برقم الطلب..."
              filterOptions={[
                {
                  column: "status",
                  title: "حالة الطلب",
                  options: [
                    { label: "جديد", value: "ASSIGNED" },
                    { label: "قيد التنفيذ", value: "IN_PROGRESS" },
                    { label: "تم التسليم", value: "DELIVERED" },
                    { label: "تعديل", value: "REVISION" },
                    { label: "مكتمل", value: "COMPLETED" },
                  ],
                },
              ]}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
