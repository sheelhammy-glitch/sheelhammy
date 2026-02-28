"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FileUploader } from "@/components/common/FileUploader";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { ArrowRight } from "lucide-react";

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    isPublished: false,
    publishedAt: "",
    tags: "",
    category: "",
    seoTitle: "",
    seoDescription: "",
  });

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
    // Auto-generate slug if slug is empty or matches the old title
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(title) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse tags string to array
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : null;

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          image: formData.image || null,
          author: formData.author || null,
          isPublished: formData.isPublished,
          publishedAt: formData.publishedAt || null,
          tags: tagsArray,
          category: formData.category || null,
          seoTitle: formData.seoTitle || null,
          seoDescription: formData.seoDescription || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "حدث خطأ");
      }

      toast.success("تم إضافة المقال بنجاح");
      router.push("/admin/content/blog");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="مقال جديد"
        description="إضافة مقال جديد للمدونة"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div>
            <Label>العنوان *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="عنوان المقال"
              required
            />
          </div>
          <div>
            <Label>الرابط (Slug) *</Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="عنوان-المقال"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              رابط المقال في الموقع (مثال: /blog/عنوان-المقال)
            </p>
          </div>
          <div>
            <Label>الملخص</Label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="ملخص قصير للمقال..."
              rows={3}
            />
          </div>
          <div>
            <Label>المحتوى *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) =>
                setFormData({ ...formData, content })
              }
              placeholder="ابدأ كتابة محتوى المقال..."
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>صورة المقال</Label>
            <FileUploader
              value={formData.image || undefined}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  image: typeof url === "string" ? url : url?.[0] || "",
                })
              }
              accept="image/*"
              multiple={false}
              maxSize={5}
              label="رفع صورة المقال"
              description="يمكنك رفع صورة للمقال (حد أقصى 5 ميجابايت)"
              disabled={isLoading}
              type="image"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>الكاتب</Label>
              <Input
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="اسم الكاتب"
              />
            </div>
            <div>
              <Label>الفئة</Label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="فئة المقال"
              />
            </div>
          </div>
          <div>
            <Label>الوسوم (مفصولة بفواصل)</Label>
            <Input
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="وسم1, وسم2, وسم3"
            />
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  isPublished: checked as boolean,
                })
              }
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              نشر المقال
            </Label>
          </div>
          {formData.isPublished && (
            <div>
              <Label>تاريخ النشر</Label>
              <Input
                type="date"
                value={formData.publishedAt}
                onChange={(e) =>
                  setFormData({ ...formData, publishedAt: e.target.value })
                }
              />
            </div>
          )}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">إعدادات SEO</h3>
            <div className="space-y-4">
              <div>
                <Label>عنوان SEO</Label>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seoTitle: e.target.value })
                  }
                  placeholder="عنوان SEO (اختياري)"
                />
              </div>
              <div>
                <Label>وصف SEO</Label>
                <Textarea
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seoDescription: e.target.value,
                    })
                  }
                  placeholder="وصف SEO (اختياري)"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/content/blog")}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "إضافة المقال"}
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
