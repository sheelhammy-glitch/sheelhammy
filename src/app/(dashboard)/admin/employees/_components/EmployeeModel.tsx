"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Employee } from "./EmployeeTable";
import { toast } from "sonner";

interface EmployeeModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSuccess: () => void;
}

export function EmployeeModel({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeModelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleActive = async () => {
    if (!employee) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/employees/${employee.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !employee.isActive,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success(
        employee.isActive
          ? "تم تعطيل الموظف بنجاح"
          : "تم تفعيل الموظف بنجاح"
      );
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  if (!employee) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={employee.isActive ? "تعطيل الموظف" : "تفعيل الموظف"}
      description={
        employee.isActive
          ? `هل أنت متأكد من تعطيل حساب الموظف ${employee.name}؟`
          : `هل تريد تفعيل حساب الموظف ${employee.name}؟`
      }
      confirmLabel={employee.isActive ? "تعطيل" : "تفعيل"}
      onConfirm={handleToggleActive}
      variant={employee.isActive ? "destructive" : "default"}
    />
  );
}
