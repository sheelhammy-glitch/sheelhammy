import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, AlertCircle, BookOpen, FileText, Award, RefreshCw } from "lucide-react";
import { OrderDetail } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";

interface OrderInfoCardProps {
  order: OrderDetail;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          معلومات الطلب
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.priority && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                الأولوية
              </p>
              <Badge variant={order.priority === "urgent" ? "destructive" : "default"}>
                {order.priority === "urgent" ? "عاجل" : "عادي"}
              </Badge>
            </div>
          )}
          
          {order.subjectName && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                اسم المادة
              </p>
              <p className="font-semibold">{order.subjectName}</p>
            </div>
          )}

          {order.orderType && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                نوع الطلب
              </p>
              <p className="font-semibold">{order.orderType}</p>
            </div>
          )}

          {order.description && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">الوصف</p>
              <p className="text-sm whitespace-pre-wrap">{order.description}</p>
            </div>
          )}

          {order.grade && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Award className="h-4 w-4" />
                العلامة
              </p>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{order.grade}</p>
                {order.gradeType && (
                  <Badge variant="outline">
                    {order.gradeType === "BTEC" ? "BTEC" : "عادي"}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {order.revisionCount !== undefined && order.revisionCount > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                عدد التعديلات
              </p>
              <p className="font-semibold">{order.revisionCount}</p>
            </div>
          )}

          {order.paymentType && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">نوع الدفع</p>
              <Badge variant="outline">
                {order.paymentType === "installments" ? "أقساط" : "كاش"}
              </Badge>
            </div>
          )}

          {order.discount && order.discount > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">الخصم</p>
              <p className="font-semibold text-red-600">-{order.discount.toFixed(2)} د.أ</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
