"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  author: string | null;
  publishedAt: string | null;
  views: number;
  category: string | null;
  tags: string[] | null;
};

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategory
        ? `/api/blog?category=${encodeURIComponent(selectedCategory)}`
        : "/api/blog";

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.details || "Failed to fetch posts"
        );
      }

      const data = await response.json();
      const postsArray = data.posts || (Array.isArray(data) ? data : []);
      setPosts(postsArray);

      const uniqueCategories = Array.from(
        new Set(postsArray.map((p: BlogPost) => p.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasCategories = categories.length > 0;

  const skeletonCards = useMemo(() => [1, 2, 3, 4, 5, 6], []);

  if (isLoading) {
    return (
      <section dir="rtl" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:w-7xl w-full">
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <div className="h-10 w-20 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-xl animate-pulse" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {skeletonCards.map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="h-56 bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-5" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-6" />
                  <div className="flex justify-between">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className="h-9 w-28 bg-gray-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:w-7xl w-full">

        {/* Empty */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-5">
              <Icon
                icon="solar:document-text-bold"
                className="w-10 h-10 text-gray-400"
              />
            </div>
            <p className="text-gray-700 text-lg font-semibold">
              لا توجد مقالات متاحة
            </p>
            <p className="text-gray-500 mt-2">
              جرّب تغيير التصنيف أو عُد لاحقًا.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
              >
                {/* Top image */}
                <div className="relative w-full h-60 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/70 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <Icon
                          icon="solar:atom-bold"
                          className="w-9 h-9 text-gray-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                  {/* Category badge */}
                  {post.category && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 border border-white/20 backdrop-blur">
                        <Icon
                          icon="solar:bookmark-bold"
                          className="w-4 h-4"
                        />
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Views badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-white/15 border border-white/20 backdrop-blur">
                      <Icon icon="solar:eye-bold" className="w-4 h-4" />
                      {post.views}
                    </span>
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-4 right-4 left-4">
                    <h3 className="text-white text-xl font-extrabold leading-snug line-clamp-2 drop-shadow">
                      {post.title}
                    </h3>
                    {post.publishedAt && (
                      <div className="mt-2 flex items-center gap-2 text-white/85 text-sm">
                        <Icon icon="solar:calendar-bold" className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-7 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {!!post.tags?.length && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="rounded-full text-xs border-gray-200 dark:border-gray-700"
                        >
                          {t}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta + CTA */}
                  <div className="mt-6 flex items-center justify-between gap-3 pt-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {post.author ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon icon="solar:user-bold" className="w-4 h-4" />
                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {post.author}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon icon="solar:shield-check-bold" className="w-4 h-4" />
                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                            فريق شيل همي
                          </span>
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
                      اقرأ المقال
                      <Icon
                        icon="solar:arrow-left-bold"
                        className="w-4 h-4"
                      />
                    </span>
                  </div>
                </div>

                {/* Bottom hover accent line */}
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}