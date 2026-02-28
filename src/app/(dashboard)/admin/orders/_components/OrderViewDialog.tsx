"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Order } from "./OrderTable";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PAYMENT_TYPES, ORDER_PRIORITIES, GRADE_TYPES, BTEC_GRADES } from "@/lib/countries";

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  employeeProfit: number;
  isPaid: boolean;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  clientFiles: string | null;
  workFiles: string | null;
  revisionNotes: string | null;
  paymentType: string | null;
  paymentInstallments: string | number[] | null;
  discount: number;
  priority: string;
  grade: string | null;
  gradeType: string | null;
  subjectName: string | null;
  orderType: string | null;
  description: string | null;
  revisionCount: number;
  student: {
    id: string;
    name: string;
    whatsapp: string | null;
    email: string | null;
  };
  service: {
    id: string;
    title: string;
    description: string;
  };
  employee: {
    id: string;
    name: string;
    email: string;
  } | null;
};

interface OrderViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function OrderViewDialog({
  open,
  onOpenChange,
  order,
}: OrderViewDialogProps) {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && order) {
      fetchOrderDetail();
    } else {
      setOrderDetail(null);
    }
  }, [open, order]);

  const fetchOrderDetail = async () => {
    if (!order) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const data = await response.json();

      // Parse JSON fields
      let installments: number[] = [];
      if (data.paymentInstallments) {
        if (typeof data.paymentInstallments === 'string') {
          try {
            installments = JSON.parse(data.paymentInstallments);
          } catch {
            installments = [];
          }
        } else if (Array.isArray(data.paymentInstallments)) {
          installments = data.paymentInstallments;
        }
      }

      const parsedData = {
        ...data,
        clientFiles: data.clientFiles ? JSON.parse(data.clientFiles) : [],
        workFiles: data.workFiles ? JSON.parse(data.workFiles) : [],
        paymentInstallments: installments,
      };

      setOrderDetail(parsedData);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>تفاصيل الطلب {order.orderNumber}</DialogTitle>
          <DialogDescription>
            عرض جميع المعلومات المتعلقة بالطلب
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : orderDetail ? (
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">رقم الطلب</p>
                    <p className="font-semibold">{orderDetail.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الحالة</p>
                    <StatusBadge status={orderDetail.status} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">تاريخ الإنشاء</p>
                    <p className="font-semibold">{formatDateTime(orderDetail.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">آخر تحديث</p>
                    <p className="font-semibold">{formatDateTime(orderDetail.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">موعد التسليم</p>
                    <p className="font-semibold">
                      {orderDetail.deadline ? formatDate(orderDetail.deadline) : "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">حالة الدفع</p>
                    <StatusBadge status={orderDetail.isPaid ? "PAID" : "PENDING"} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الطالب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">الاسم</p>
                  <p className="font-semibold">{orderDetail.student.name}</p>
                </div>
                {orderDetail.student.email && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني</p>
                    <p className="font-semibold">{orderDetail.student.email}</p>
                  </div>
                )}
                {orderDetail.student.whatsapp && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">واتساب</p>
                    <p className="font-semibold">{orderDetail.student.whatsapp}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الخدمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">اسم الخدمة</p>
                  <p className="font-semibold">{orderDetail.service.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">الوصف</p>
                  <p className="font-semibold">{orderDetail.service.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Employee Info */}
            {orderDetail.employee && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الموظف</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الاسم</p>
                    <p className="font-semibold">{orderDetail.employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني</p>
                    <p className="font-semibold">{orderDetail.employee.email}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Info */}
            <Card>
              <CardHeader>
                <CardTitle>المعلومات المالية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">السعر الكلي</p>
                  <p className="font-semibold text-lg">{formatCurrency(orderDetail.totalPrice)}</p>
                </div>
                {orderDetail.discount > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الخصم</p>
                    <p className="font-semibold text-lg text-red-600">
                      -{formatCurrency(orderDetail.discount)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">السعر بعد الخصم</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(orderDetail.totalPrice - (orderDetail.discount || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ربح الموظف</p>
                  <p className="font-semibold text-lg text-green-600">
                    {formatCurrency(orderDetail.employeeProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">نوع الدفع</p>
                  <p className="font-semibold">
                    {orderDetail.paymentType 
                      ? PAYMENT_TYPES.find(t => t.value === orderDetail.paymentType)?.label || orderDetail.paymentType
                      : "غير محدد"}
                  </p>
                </div>
                {orderDetail.paymentType === "installments" && 
                 Array.isArray(orderDetail.paymentInstallments) && 
                 orderDetail.paymentInstallments.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">الأقساط</p>
                    <div className="space-y-1">
                      {orderDetail.paymentInstallments.map((amount, index) => (
                        <p key={index} className="font-semibold">
                          قسط {index + 1}: {formatCurrency(amount)}
                        </p>
                      ))}
                      <p className="font-semibold text-sm text-gray-500">
                        المجموع: {formatCurrency(
                          orderDetail.paymentInstallments.reduce((a: number, b: number) => a + b, 0)
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {orderDetail.priority && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">أولوية الطلب</p>
                      <p className={`font-semibold ${orderDetail.priority === "urgent" ? "text-red-600" : ""}`}>
                        {ORDER_PRIORITIES.find(p => p.value === orderDetail.priority)?.label || orderDetail.priority}
                      </p>
                    </div>
                  )}
                  {orderDetail.subjectName && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">اسم المادة</p>
                      <p className="font-semibold">{orderDetail.subjectName}</p>
                    </div>
                  )}
                  {orderDetail.orderType && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">نوع الطلب</p>
                      <p className="font-semibold">{orderDetail.orderType}</p>
                    </div>
                  )}
                  {orderDetail.gradeType && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">نوع العلامة</p>
                      <p className="font-semibold">
                        {GRADE_TYPES.find(t => t.value === orderDetail.gradeType)?.label || orderDetail.gradeType}
                      </p>
                    </div>
                  )}
                  {orderDetail.grade && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">العلامة</p>
                      <p className="font-semibold">
                        {orderDetail.gradeType === "BTEC" 
                          ? BTEC_GRADES.find(g => g.value === orderDetail.grade)?.label || orderDetail.grade
                          : orderDetail.grade}
                      </p>
                    </div>
                  )}
                  {orderDetail.revisionCount !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">عدد التعديلات</p>
                      <p className="font-semibold">{orderDetail.revisionCount}</p>
                    </div>
                  )}
                </div>
                {orderDetail.description && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">وصف الطلب</p>
                    <p className="font-semibold whitespace-pre-wrap">{orderDetail.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client Files */}
            {orderDetail.clientFiles && Array.isArray(orderDetail.clientFiles) && orderDetail.clientFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>ملفات العميل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {orderDetail.clientFiles.map((file: { name: string; url: string }, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.name}</span>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 ml-2" />
                            تحميل
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Files */}
            {orderDetail.workFiles && Array.isArray(orderDetail.workFiles) && orderDetail.workFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>ملفات العمل المقدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {orderDetail.workFiles.map((file: { name: string; url: string }, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.name}</span>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 ml-2" />
                            تحميل
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Revision Notes */}
            {orderDetail.revisionNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>ملاحظات التعديل</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{orderDetail.revisionNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            فشل تحميل تفاصيل الطلب
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
