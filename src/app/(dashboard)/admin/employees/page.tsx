"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Employee, getEmployeeColumns } from "./_components/EmployeeTable";
import { EmployeeForm } from "./_components/EmployeeForm";
import { EmployeeModel } from "./_components/EmployeeModel";
import { EmployeeViewDialog } from "./_components/EmployeeViewDialog";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";
import { ARAB_COUNTRIES, ACADEMIC_LEVELS } from "@/lib/countries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/employees");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "حدث خطأ أثناء تحميل الموظفين";
      toast.error(errorMessage);
      console.error("Error fetching employees:", error);
      // Set empty array on error to prevent UI crash
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleToggleActive = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeactivateDialogOpen(true);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await fetch(`/api/admin/employees/${employeeToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete employee");
      }

      toast.success("تم حذف الموظف بنجاح");
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حذف الموظف");
    }
  };

  const handleSuccess = () => {
    fetchEmployees();
  };

  const columns = getEmployeeColumns(handleEdit, handleToggleActive, handleView, handleDelete);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="إدارة الموظفين"
          description="إضافة وتعطيل الموظفين وإدارة نسب الأرباح"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الموظفين"
        description="إضافة وتعطيل الموظفين وإدارة نسب الأرباح"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            موظف جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={employees}
        searchKey="name"
        searchPlaceholder="البحث بالاسم أو رقم الهاتف..."
        filterOptions={[
          {
            column: "country",
            title: "الدولة",
            options: ARAB_COUNTRIES.map((country) => ({
              label: country.name,
              value: country.name,
            })),
          },
          {
            column: "academicLevels",
            title: "المستويات الأكاديمية",
            options: ACADEMIC_LEVELS.map((level) => ({
              label: level.label,
              value: level.value,
            })),
          },
          {
            column: "specialization",
            title: "التخصص",
            options: [
              { label: "كتابة أبحاث", value: "كتابة أبحاث" },
              { label: "ترجمة", value: "ترجمة" },
              { label: "تحرير", value: "تحرير" },
              { label: "برمجة", value: "برمجة" },
              { label: "تصميم", value: "تصميم" },
            ],
          },
        ]}
      />

      <EmployeeForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      <EmployeeForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        employee={selectedEmployee}
        onSuccess={handleSuccess}
      />

      <EmployeeModel
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
        employee={selectedEmployee}
        onSuccess={handleSuccess}
      />

      <EmployeeViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        employee={selectedEmployee}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا الموظف؟ سيتم تعطيل الحساب بدلاً من الحذف الكامل إذا كان لديه طلبات نشطة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
