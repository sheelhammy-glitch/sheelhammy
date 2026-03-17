"use client";

import React, { useState, useEffect } from "react";
import { PageHero } from "@/components/common/page-hero";
import { BlogList } from "./_components/blog-list";
import AnimatedContent from "@/components/animated-content";

export default function BlogPage() {
  return (
    <main>
      <AnimatedContent distance={22} duration={0.7}>
        <PageHero
          title="المدونة"
          description="اكتشف آخر المقالات والنصائح والأخبار"
          badge="المدونة"
          chips={[{ label: "المدونة", icon: "solar:document-text-bold" }, { label: "المقالات", icon: "solar:document-text-bold" }, { label: "النصائح", icon: "solar:document-text-bold" }, { label: "الأخبار", icon: "solar:document-text-bold" }]}
          badgeIcon="solar:document-text-bold"
        />
      </AnimatedContent>
      <AnimatedContent distance={18} duration={0.65} delay={0.06}>
        <BlogList />
      </AnimatedContent>
    </main>

  );
}
