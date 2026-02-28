import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Upload } from "lucide-react";
import { OrderStatus } from "@prisma/client";
import { OrderDetail } from "@/types/dashboard";

interface OrderActionsCardProps {
  order: OrderDetail;
  onStartWork: () => void;
  onDeliver: () => void;
  isLoading?: boolean;
}

export function OrderActionsCard({
  order,
  onStartWork,
  onDeliver,
  isLoading = false,
}: OrderActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الإجراءات</CardTitle>
        <CardDescription>
          إدارة الطلب وتحديث حالته
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.status === "ASSIGNED" && (
          <Button onClick={onStartWork} className="w-full" disabled={isLoading}>
            <Clock className="ml-2 h-4 w-4" />
            بدء التنفيذ
          </Button>
        )}
        {(order.status === "IN_PROGRESS" || order.status === "REVISION") && (
          <Button
            onClick={onDeliver}
            className="w-full"
            disabled={isLoading}
          >
            <Upload className="ml-2 h-4 w-4" />
            رفع العمل (Deliver)
          </Button>
        )}
        {order.status === "DELIVERED" && (
          <p className="text-center text-gray-500 py-2">
            تم رفع العمل. في انتظار المراجعة من الأدمن
          </p>
        )}
        {order.status === "COMPLETED" && (
          <p className="text-center text-green-600 font-semibold py-2">
            ✓ تم إكمال الطلب بنجاح
          </p>
        )}
      </CardContent>
    </Card>
  );
}
