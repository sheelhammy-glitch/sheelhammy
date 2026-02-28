"use client";

import React, { useState, useEffect } from "react";
import { PageHero } from "@/components/common/page-hero";
import { BlogList } from "./_components/blog-list";

export default function BlogPage() {
  return (
    <main>
      <PageHero
        title="المدونة"
        description="اكتشف آخر المقالات والنصائح والأخبار"
        badge="المدونة"
        chips={[{ label: "المدونة", icon: "solar:document-text-bold" }, { label: "المقالات", icon: "solar:document-text-bold" }, { label: "النصائح", icon: "solar:document-text-bold" }, { label: "الأخبار", icon: "solar:document-text-bold" }]}
        badgeIcon="solar:document-text-bold"
      />
      <BlogList />
    </main>
    
  );
}
