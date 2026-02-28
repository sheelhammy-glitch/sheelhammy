"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";
import { BlogPost, getBlogColumns } from "./_components/BlogTable";
import Link from "next/link";
import { BlogModel } from "./_components/BlogModel";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/blog");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch blog posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "حدث خطأ أثناء تحميل المقالات";
      toast.error(errorMessage);
      console.error("Error fetching blog posts:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchPosts();
  };

  const columns = getBlogColumns(handleDelete);

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="المدونة"
          description="إدارة مقالات المدونة"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="المدونة"
        description="إدارة مقالات المدونة"
        actions={
          <Link href="/admin/content/blog/new">
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              مقال جديد
            </Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={posts}
        searchKey="title"
        searchPlaceholder="البحث بالعنوان..."
        filterOptions={[
          {
            column: "isPublished",
            title: "الحالة",
            options: [
              { label: "منشور", value: "true" },
              { label: "مسودة", value: "false" },
            ],
          },
          {
            column: "category",
            title: "الفئة",
            options: Array.from(
              new Set(posts.map((p) => p.category).filter(Boolean))
            ).map((cat) => ({
              label: cat as string,
              value: cat as string,
            })),
          },
        ]}
      />

      <BlogModel
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        post={selectedPost}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
