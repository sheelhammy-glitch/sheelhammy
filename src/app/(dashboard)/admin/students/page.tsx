"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Student, getStudentColumns } from "./_components/StudentTable";
import { StudentForm } from "./_components/StudentForm";
import { StudentOrdersDialog } from "./_components/StudentOrdersDialog";
import { StudentViewDialog } from "./_components/StudentViewDialog";
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewOrdersDialogOpen, setIsViewOrdersDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/students");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "حدث خطأ أثناء تحميل الطلاب";
      toast.error(errorMessage);
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleViewOrders = (student: Student) => {
    setSelectedStudent(student);
    setIsViewOrdersDialogOpen(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(`/api/admin/students/${studentToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete student");
      }

      toast.success("تم حذف الطالب بنجاح");
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حذف الطالب");
    }
  };

  const handleSuccess = () => {
    fetchStudents();
  };

  const columns = getStudentColumns(handleEdit, handleViewOrders, handleView, handleDelete);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="إدارة الطلاب"
          description="إدارة بيانات الطلاب ومتابعة طلباتهم"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الطلاب"
        description="إدارة بيانات الطلاب ومتابعة طلباتهم"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            طالب جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={students}
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
            column: "academicLevel",
            title: "المستوى الدراسي",
            options: ACADEMIC_LEVELS.map((level) => ({
              label: level.label,
              value: level.value,
            })),
          },
        ]}
      />

      <StudentForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      <StudentForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        student={selectedStudent}
        onSuccess={handleSuccess}
      />

      <StudentOrdersDialog
        open={isViewOrdersDialogOpen}
        onOpenChange={setIsViewOrdersDialogOpen}
        student={selectedStudent}
      />

      <StudentViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        student={selectedStudent}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا الطالب؟ لا يمكن حذف طالب لديه طلبات موجودة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToDelete(null)}>
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
