"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = {
  id: string;
  code: string;
  label: string;
  enabled: boolean;
};

export function PaymentMethodsList() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/payment-methods");
      if (!response.ok) throw new Error("Failed to fetch payment methods");
      const data = await response.json();
      setMethods(data);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تحميل طرق الدفع");
      console.error("Error fetching payment methods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const toggleMethod = async (methodId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/payment-methods/${methodId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      setMethods((prev) =>
        prev.map((m) => (m.id === methodId ? { ...m, enabled } : m))
      );
      toast.success("تم تحديث طريقة الدفع بنجاح");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            طرق الدفع
          </CardTitle>
          <CardDescription>
            تفعيل أو إلغاء تفعيل طرق الدفع المتاحة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">جاري التحميل...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          طرق الدفع
        </CardTitle>
        <CardDescription>
          تفعيل أو إلغاء تفعيل طرق الدفع المتاحة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <Label htmlFor={method.id} className="cursor-pointer flex-1">
                {method.label}
              </Label>
              <Switch
                id={method.id}
                checked={method.enabled}
                dir="ltr"
                onCheckedChange={(checked) => toggleMethod(method.id, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
