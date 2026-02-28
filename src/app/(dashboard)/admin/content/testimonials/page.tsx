"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Testimonial, getTestimonialColumns } from "./_components/TestimonialTable";
import { TestimonialForm } from "./_components/TestimonialForm";
import { TestimonialModel } from "./_components/TestimonialModel";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";

type Student = {
  id: string;
  name: string;
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/testimonials");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch testimonials");
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "حدث خطأ أثناء تحميل آراء العملاء";
      toast.error(errorMessage);
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/admin/students");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    fetchStudents();
  }, []);

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchTestimonials();
  };

  const columns = getTestimonialColumns(handleEdit, handleDelete);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="آراء العملاء"
          description="إدارة آراء وتقييمات العملاء"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="آراء العملاء"
        description="إدارة آراء وتقييمات العملاء"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            رأي جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={testimonials}
        searchKey="clientName"
        searchPlaceholder="البحث باسم العميل..."
      />

      <TestimonialForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        students={students}
        onSuccess={handleSuccess}
      />

      <TestimonialForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        testimonial={selectedTestimonial}
        students={students}
        onSuccess={handleSuccess}
      />

      <TestimonialModel
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        testimonial={selectedTestimonial}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
