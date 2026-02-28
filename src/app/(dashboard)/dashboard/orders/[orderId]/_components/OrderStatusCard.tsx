import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { FileText } from "lucide-react";
import { OrderDetail } from "@/types/dashboard";

interface OrderStatusCardProps {
  order: OrderDetail;
}

export function OrderStatusCard({ order }: OrderStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          حالة الطلب
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatusBadge status={order.status} />
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">الخدمة</p>
            <p className="font-semibold">{order.service.title}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">الطالب</p>
            <p className="font-semibold">{order.student.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">ربحي من هذا الطلب</p>
            <p className="font-semibold text-green-600">{formatCurrency(order.employeeProfit)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
