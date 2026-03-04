"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Student } from "./StudentTable";
import { Loader2, Plus, Minus, Calculator } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { toast } from "sonner";

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  discount: number;
  employeeProfit: number;
  paymentType: string | null;
  paymentInstallments: number[] | null;
  service: {
    id: string;
    title: string;
  };
  employee: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  paymentRecords: Array<{
    id: string;
    amount: number;
    paymentDate: string;
  }>;
};

interface StudentOrdersPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess?: () => void;
}

export function StudentOrdersPaymentDialog({
  open,
  onOpenChange,
  student,
  onSuccess,
}: StudentOrdersPaymentDialogProps) {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "partial" | "installments">("full");
  const [paidAmount, setPaidAmount] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (open && student) {
      fetchStudentOrders();
      setSelectedOrders(new Set());
      setPaidAmount("");
      setInstallmentAmount("");
      setPaymentType("full");
    }
  }, [open, student]);

  const fetchStudentOrders = async () => {
    if (!student) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/students/${student.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student orders");
      }
      const data = await response.json();
      
      // Orders already include paymentRecords from API
      const ordersData = data.orders || [];
      setOrders(ordersData);
      
      // Select all unpaid orders by default
      const unpaidOrders = ordersData
        .filter((order: OrderDetail) => {
          const total = order.totalPrice - (order.discount || 0);
          const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
          return paid < total;
        })
        .map((order: OrderDetail) => order.id);
      setSelectedOrders(new Set(unpaidOrders));
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل طلبات الطالب");
      console.error("Error fetching student orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const selectAll = () => {
    const unpaidOrders = orders
      .filter((order) => {
        const total = order.totalPrice - (order.discount || 0);
        const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
        return paid < total;
      })
      .map((order) => order.id);
    setSelectedOrders(new Set(unpaidOrders));
  };

  const deselectAll = () => {
    setSelectedOrders(new Set());
  };

  // Calculate totals for selected orders
  const selectedOrdersData = orders.filter((order) => selectedOrders.has(order.id));
  
  const calculateTotals = () => {
    let totalPrice = 0;
    let totalDiscount = 0;
    let totalPaid = 0;
    let totalEmployeeProfit = 0;

    selectedOrdersData.forEach((order) => {
      totalPrice += order.totalPrice;
      totalDiscount += order.discount || 0;
      const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
      totalPaid += paid;
      totalEmployeeProfit += order.employeeProfit || 0;
    });

    const totalAfterDiscount = totalPrice - totalDiscount;
    const remaining = totalAfterDiscount - totalPaid;

    return {
      totalPrice,
      totalDiscount,
      totalPaid,
      totalAfterDiscount,
      remaining,
      totalEmployeeProfit,
    };
  };

  const totals = calculateTotals();

  // Calculate installments
  const calculateInstallments = (): number[] => {
    if (!installmentAmount || parseFloat(installmentAmount) <= 0) return [];
    
    const initialPayment = parseFloat(paidAmount) || 0;
    const remaining = totals.remaining - initialPayment;
    if (remaining <= 0) return [];

    const installmentAmt = parseFloat(installmentAmount);
    const numberOfInstallments = Math.ceil(remaining / installmentAmt);
    const installments: number[] = [];
    let currentRemaining = remaining;

    for (let i = 0; i < numberOfInstallments; i++) {
      if (currentRemaining <= 0) break;
      const amountToAdd = Math.min(installmentAmt, currentRemaining);
      installments.push(Math.round(amountToAdd * 100) / 100);
      currentRemaining -= amountToAdd;
    }

    return installments;
  };

  const installments = calculateInstallments();

  const handleSubmit = async () => {
    if (selectedOrders.size === 0) {
      toast.error("يرجى اختيار طلب واحد على الأقل");
      return;
    }

    if (paymentType === "full") {
      // Pay full amount for all selected orders
      await handleFullPayment();
    } else if (paymentType === "partial") {
      // Pay partial amount
      if (!paidAmount || parseFloat(paidAmount) <= 0) {
        toast.error("يرجى إدخال المبلغ المدفوع");
        return;
      }
      await handlePartialPayment();
    } else if (paymentType === "installments") {
      // Set up installments
      if (!paidAmount || parseFloat(paidAmount) <= 0) {
        toast.error("يرجى إدخال المبلغ المدفوع");
        return;
      }
      if (!installmentAmount || parseFloat(installmentAmount) <= 0) {
        toast.error("يرجى إدخال قيمة القسط");
        return;
      }
      await handleInstallmentPayment();
    }
  };

  const handleFullPayment = async () => {
    setIsSubmitting(true);
    try {
      // Pay remaining amount for each selected order
      for (const order of selectedOrdersData) {
        const total = order.totalPrice - (order.discount || 0);
        const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
        const remaining = total - paid;

        if (remaining > 0) {
          // Create payment record
          await fetch("/api/admin/finance/payment-records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              amount: remaining,
              paymentType: "cash",
              paymentDate: paymentDate,
              notes: `دفع كامل للطلبات المحددة - ${student?.name}`,
            }),
          });

          // Update order as paid
          await fetch(`/api/admin/orders/${order.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isPaid: true,
              paymentType: "cash",
            }),
          });
        }
      }

      toast.success("تم تسجيل الدفع الكامل بنجاح");
      onOpenChange(false);
      onSuccess?.();
      fetchStudentOrders();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartialPayment = async () => {
    setIsSubmitting(true);
    try {
      const amountToPay = parseFloat(paidAmount);
      let remainingAmount = amountToPay;

      // Distribute payment across selected orders
      for (const order of selectedOrdersData) {
        if (remainingAmount <= 0) break;

        const total = order.totalPrice - (order.discount || 0);
        const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
        const orderRemaining = total - paid;

        if (orderRemaining > 0) {
          const paymentForThisOrder = Math.min(remainingAmount, orderRemaining);

          // Create payment record
          await fetch("/api/admin/finance/payment-records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              amount: paymentForThisOrder,
              paymentType: "cash",
              paymentDate: paymentDate,
              notes: `دفع جزئي للطلبات المحددة - ${student?.name}`,
            }),
          });

          // Update order payment status if fully paid
          if (paymentForThisOrder >= orderRemaining) {
            await fetch(`/api/admin/orders/${order.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                isPaid: true,
                paymentType: "cash",
              }),
            });
          }

          remainingAmount -= paymentForThisOrder;
        }
      }

      toast.success("تم تسجيل الدفع الجزئي بنجاح");
      onOpenChange(false);
      onSuccess?.();
      fetchStudentOrders();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstallmentPayment = async () => {
    setIsSubmitting(true);
    try {
      const initialPayment = parseFloat(paidAmount);
      let remainingAmount = initialPayment;

      // First, apply initial payment
      for (const order of selectedOrdersData) {
        if (remainingAmount <= 0) break;

        const total = order.totalPrice - (order.discount || 0);
        const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
        const orderRemaining = total - paid;

        if (orderRemaining > 0) {
          const paymentForThisOrder = Math.min(remainingAmount, orderRemaining);

          // Create payment record
          await fetch("/api/admin/finance/payment-records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.id,
              amount: paymentForThisOrder,
              paymentType: "installment",
              paymentDate: paymentDate,
              notes: `دفعة أولى للطلبات المحددة - ${student?.name}`,
            }),
          });

          remainingAmount -= paymentForThisOrder;
        }
      }

      // Update orders with installments
      // Distribute installments proportionally across orders
      // First, calculate how much of the initial payment goes to each order
      let remainingInitialPayment = initialPayment;
      const orderInitialPayments: Record<string, number> = {};
      
      for (const order of selectedOrdersData) {
        if (remainingInitialPayment <= 0) break;
        const total = order.totalPrice - (order.discount || 0);
        const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
        const orderRemaining = total - paid;
        
        if (orderRemaining > 0) {
          const paymentForThisOrder = Math.min(remainingInitialPayment, orderRemaining);
          orderInitialPayments[order.id] = paymentForThisOrder;
          remainingInitialPayment -= paymentForThisOrder;
        }
      }

      // Now calculate remaining after initial payment for each order
      const totalRemainingAfterPayment = totals.remaining - initialPayment;
      
      for (const order of selectedOrdersData) {
        const total = order.totalPrice - (order.discount || 0);
        const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
        const initialPaymentForOrder = orderInitialPayments[order.id] || 0;
        const orderRemaining = total - paid - initialPaymentForOrder;

        if (orderRemaining > 0 && totalRemainingAfterPayment > 0) {
          // Calculate installments for this order proportionally
          const orderProportion = orderRemaining / totalRemainingAfterPayment;
          const orderInstallments = installments.map((inst) => Math.round(inst * orderProportion * 100) / 100).filter(inst => inst > 0);

          if (orderInstallments.length > 0) {
            await fetch(`/api/admin/orders/${order.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentType: "installments",
                paymentInstallments: orderInstallments,
              }),
            });
          }
        }
      }

      toast.success("تم تسجيل الدفع بالأقساط بنجاح");
      onOpenChange(false);
      onSuccess?.();
      fetchStudentOrders();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إدارة طلبات ودفعات {student.name}</DialogTitle>
          <DialogDescription>
            عرض جميع الطلبات وإدارة الدفعات الموحدة
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ملخص الطلبات المحددة</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAll}>
                      تحديد الكل
                    </Button>
                    <Button variant="outline" size="sm" onClick={deselectAll}>
                      إلغاء التحديد
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">عدد الخدمات</p>
                    <p className="text-2xl font-bold">{selectedOrders.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">المجموع الكلي</p>
                    <p className="text-2xl font-bold">{formatCurrency(totals.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">المدفوع</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">المتبقي</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.remaining)}</p>
                  </div>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      الخصم: {formatCurrency(totals.totalDiscount)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      بعد الخصم: {formatCurrency(totals.totalAfterDiscount)}
                    </p>
                  </div>
                )}
                {totals.totalEmployeeProfit > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      إجمالي ربح الموظفين: {formatCurrency(totals.totalEmployeeProfit)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card>
              <CardHeader>
                <CardTitle>الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {orders.map((order) => {
                    const total = order.totalPrice - (order.discount || 0);
                    const paid = (order.paymentRecords || []).reduce((sum: number, pr: any) => sum + pr.amount, 0);
                    const remaining = total - paid;
                    const isSelected = selectedOrders.has(order.id);
                    const isFullyPaid = remaining <= 0;

                    return (
                      <div
                        key={order.id}
                        className={`flex items-center gap-4 p-4 border rounded-lg ${
                          isSelected ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300" : ""
                        } ${isFullyPaid ? "opacity-60" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOrderSelection(order.id)}
                          disabled={isFullyPaid}
                          className="w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{order.orderNumber}</p>
                            <StatusBadge status={order.status} />
                            {isFullyPaid && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                مدفوع بالكامل
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {order.service.title}
                          </p>
                          {order.employee && (
                            <p className="text-xs text-gray-500 mt-1">
                              الموظف: {order.employee.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">السعر</p>
                          <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
                          {order.discount > 0 && (
                            <>
                              <p className="text-xs text-gray-500">خصم: {formatCurrency(order.discount)}</p>
                              <p className="text-xs text-gray-500">
                                بعد الخصم: {formatCurrency(total)}
                              </p>
                            </>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            مدفوع: {formatCurrency(paid)}
                          </p>
                          <p className={`text-sm font-semibold mt-1 ${remaining > 0 ? "text-red-600" : "text-green-600"}`}>
                            متبقي: {formatCurrency(remaining)}
                          </p>
                          {order.employeeProfit > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              ربح الموظف: {formatCurrency(order.employeeProfit)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            {selectedOrders.size > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>نظام الدفع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>نوع الدفع</Label>
                    <Select value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">دفع كامل</SelectItem>
                        <SelectItem value="partial">دفع جزئي</SelectItem>
                        <SelectItem value="installments">دفع بالأقساط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentType === "partial" && (
                    <div>
                      <Label>المبلغ المدفوع</Label>
                      <Input
                        type="number"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        max={totals.remaining}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        المتبقي بعد الدفع: {formatCurrency(totals.remaining - (parseFloat(paidAmount) || 0))}
                      </p>
                    </div>
                  )}

                  {paymentType === "installments" && (
                    <>
                      <div>
                        <Label>المبلغ المدفوع (دفعة أولى)</Label>
                        <Input
                          type="number"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          max={totals.remaining}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          المتبقي بعد الدفعة الأولى: {formatCurrency(totals.remaining - (parseFloat(paidAmount) || 0))}
                        </p>
                      </div>
                      <div>
                        <Label>قيمة القسط الواحد</Label>
                        <Input
                          type="number"
                          value={installmentAmount}
                          onChange={(e) => setInstallmentAmount(e.target.value)}
                          placeholder="100.00"
                          min="0"
                        />
                        {installments.length > 0 && (
                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                            <p className="text-sm font-semibold mb-2">الأقساط المولدة:</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {installments.map((amount, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                >
                                  قسط {index + 1}: {formatCurrency(amount)}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              عدد الأقساط: {installments.length} | المجموع: {formatCurrency(installments.reduce((a, b) => a + b, 0))}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <Label>تاريخ الدفع</Label>
                    <Input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          جاري المعالجة...
                        </>
                      ) : (
                        "تسجيل الدفع"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
