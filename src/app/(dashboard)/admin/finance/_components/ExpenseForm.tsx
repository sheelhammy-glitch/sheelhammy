"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense } from "./ExpenseTable";
import { toast } from "sonner";

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
  onSuccess: () => void;
}

const expenseCategories = [
  "إعلانات",
  "تقنية",
  "رواتب",
  "إيجار",
  "أخرى",
];

export function ExpenseForm({
  open,
  onOpenChange,
  expense,
  onSuccess,
}: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [properties, setProperties] = useState<Array<{ key: string; value: string }>>([]);
  const [newProperty, setNewProperty] = useState({ key: "", value: "" });
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const fetchExpenseData = async () => {
    if (!expense?.id) return;

    setIsLoadingData(true);
    try {
      const response = await fetch(`/api/admin/expenses/${expense.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch expense details");
      }
      const data = await response.json();
      
      // Handle date conversion - API now returns date in YYYY-MM-DD format
      let dateValue = new Date().toISOString().split("T")[0]; // Default to today
      if (data.date) {
        if (typeof data.date === "string") {
          // If it's already in YYYY-MM-DD format, use it directly
          if (data.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            dateValue = data.date;
          } else if (data.date.includes("T")) {
            // ISO format: "2024-01-15T00:00:00.000Z"
            dateValue = data.date.split("T")[0];
          } else {
            // Try to parse as date
            const parsedDate = new Date(data.date);
            if (!isNaN(parsedDate.getTime())) {
              dateValue = parsedDate.toISOString().split("T")[0];
            }
          }
        } else {
          // Date object or other format
          const parsedDate = new Date(data.date);
          if (!isNaN(parsedDate.getTime())) {
            dateValue = parsedDate.toISOString().split("T")[0];
          }
        }
      }
      
      setFormData({
        title: data.title || "",
        amount: data.amount?.toString() || "",
        category: data.category || "",
        date: dateValue,
        description: data.description || "",
      });

      if (data.properties && typeof data.properties === 'object' && data.properties !== null) {
        const props = Object.entries(data.properties).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setProperties(props);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching expense detail:", error);
      toast.error("فشل تحميل بيانات المصروف");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (open && expense) {
      fetchExpenseData();
    } else if (open && !expense) {
      // Reset form for new expense
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setProperties([]);
      setNewProperty({ key: "", value: "" });
    }
  }, [open, expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = expense
        ? `/api/admin/expenses/${expense.id}`
        : "/api/admin/expenses";
      const method = expense ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          amount: formData.amount,
          category: formData.category || null,
          date: formData.date,
          description: formData.description || null,
          properties: properties.length > 0
            ? properties.reduce((acc, prop) => {
                if (prop.key && prop.value) {
                  acc[prop.key] = prop.value;
                }
                return acc;
              }, {} as Record<string, string>)
            : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success(
        expense ? "تم تحديث المصروف بنجاح" : "تم إضافة المصروف بنجاح"
      );
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {expense ? "تعديل المصروف" : "إضافة مصروف"}
          </DialogTitle>
          <DialogDescription>
            {expense ? "تعديل بيانات المصروف" : "تسجيل مصروف جديد"}
          </DialogDescription>
        </DialogHeader>
        {isLoadingData ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="space-y-4 py-4 overflow-y-auto flex-1">
            <div>
              <Label>اسم المصروف</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="مثال: إعلانات فيسبوك"
                required
              />
            </div>
            <div>
              <Label>المبلغ</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label>الفئة</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>التاريخ</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>الوصف (اختياري)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="وصف المصروف..."
                rows={3}
              />
            </div>
            <div>
              <Label>خصائص إضافية (اختياري)</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={newProperty.key}
                    onChange={(e) =>
                      setNewProperty({ ...newProperty, key: e.target.value })
                    }
                    placeholder="اسم الخاصية"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newProperty.value}
                      onChange={(e) =>
                        setNewProperty({ ...newProperty, value: e.target.value })
                      }
                      placeholder="القيمة"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newProperty.key && newProperty.value) {
                          e.preventDefault();
                          setProperties([...properties, newProperty]);
                          setNewProperty({ key: "", value: "" });
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newProperty.key && newProperty.value) {
                          setProperties([...properties, newProperty]);
                          setNewProperty({ key: "", value: "" });
                        }
                      }}
                      disabled={!newProperty.key || !newProperty.value}
                    >
                      إضافة
                    </Button>
                  </div>
                </div>
                {properties.length > 0 && (
                  <div className="space-y-2">
                    {properties.map((prop, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <span className="flex-1 text-sm">
                          <strong>{prop.key}:</strong> {prop.value}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setProperties(properties.filter((_, i) => i !== index));
                          }}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
            <DialogFooter className="flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading || isLoadingData}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingData}>
                {isLoading ? "جاري الحفظ..." : expense ? "حفظ" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
