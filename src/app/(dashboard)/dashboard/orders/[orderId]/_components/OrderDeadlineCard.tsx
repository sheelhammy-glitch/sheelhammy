import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";
import { OrderDetail } from "@/types/dashboard";

interface OrderDeadlineCardProps {
  order: OrderDetail;
}

export function OrderDeadlineCard({ order }: OrderDeadlineCardProps) {
  if (!order.deadline) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            الموعد النهائي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">لم يتم تحديد موعد نهائي</p>
        </CardContent>
      </Card>
    );
  }

  const deadlineDate = new Date(order.deadline);
  const now = new Date();
  const isOverdue = deadlineDate < now;
  const hoursRemaining = Math.max(
    0,
    Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          الموعد النهائي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">التاريخ</p>
            <p className="font-semibold">{formatDate(order.deadline)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">الوقت المتبقي</p>
            {isOverdue ? (
              <p className="font-semibold text-red-600">متأخر!</p>
            ) : (
              <p className="font-semibold text-orange-600">
                {hoursRemaining > 24
                  ? `${Math.floor(hoursRemaining / 24)} يوم و ${hoursRemaining % 24} ساعة`
                  : `${hoursRemaining} ساعة`}
              </p>
            )}
          </div>
          {isOverdue && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>تنبيه</AlertTitle>
              <AlertDescription>
                هذا الطلب متأخر عن الموعد النهائي
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
