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
import { Testimonial } from "./TestimonialTable";
import { toast } from "sonner";

type Student = {
  id: string;
  name: string;
};

interface TestimonialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
  students?: Student[];
  onSuccess: () => void;
}

export function TestimonialForm({
  open,
  onOpenChange,
  testimonial,
  students = [],
  onSuccess,
}: TestimonialFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    clientName: "",
    content: "",
    rating: 5,
    avatar: "",
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        studentId: "",
        clientName: testimonial.clientName,
        content: testimonial.content,
        rating: testimonial.rating,
        avatar: testimonial.avatar || "",
      });
    } else {
      setFormData({
        studentId: "",
        clientName: "",
        content: "",
        rating: 5,
        avatar: "",
      });
    }
  }, [testimonial, open]);

  const handleStudentChange = (studentId: string) => {
    const selectedStudent = students.find((s) => s.id === studentId);
    if (selectedStudent) {
      setFormData({
        ...formData,
        studentId,
        clientName: selectedStudent.name,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = testimonial
        ? `/api/admin/testimonials/${testimonial.id}`
        : "/api/admin/testimonials";
      const method = testimonial ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: formData.clientName,
          content: formData.content,
          rating: formData.rating,
          avatar: formData.avatar || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success(
        testimonial
          ? "تم تحديث الرأي بنجاح"
          : "تم إضافة الرأي بنجاح"
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "تعديل الرأي" : "إضافة رأي عميل"}
          </DialogTitle>
          <DialogDescription>
            {testimonial
              ? `تعديل رأي العميل ${testimonial.clientName}`
              : "إضافة رأي جديد من عميل"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {!testimonial ? (
              <div>
                <Label>الطالب</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={handleStudentChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الطالب" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
           
            <div>
              <Label>المحتوى</Label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="رأي العميل..."
                rows={4}
                required
              />
            </div>
            <div>
              <Label>عدد النجوم</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseInt(e.target.value) || 5,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>رابط صورة العميل (اختياري)</Label>
              <Input
                type="url"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : testimonial ? "حفظ" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
