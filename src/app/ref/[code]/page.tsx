"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { PageHero } from "@/components/common/page-hero";

export default function ReferrerPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code as string;
  const [isLoading, setIsLoading] = useState(true);
  const [referrer, setReferrer] = useState<{
    name: string;
    code: string;
  } | null>(null);

  useEffect(() => {
    if (code) {
      verifyReferrer();
    }
  }, [code]);

  const verifyReferrer = async () => {
    try {
      const response = await fetch(`/api/referrer/${code}`);
      if (!response.ok) {
        throw new Error("Invalid referrer code");
      }
      const data = await response.json();
      setReferrer(data);
      
      // Save referrer code in localStorage
      localStorage.setItem("referrerCode", code);
      localStorage.setItem("referrerId", data.id);
      
      toast.success(`مرحباً بك من خلال ${data.name}`);
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("كود المندوب غير صحيح");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من كود المندوب...</p>
        </div>
      </main>
    );
  }

  if (!referrer) {
    return null;
  }

  return (
    <main>
      <PageHero
        title={`مرحباً بك من خلال ${referrer.name}`}
        description="سيتم توجيهك إلى الصفحة الرئيسية..."
        badge="رابط المندوب"
        badgeIcon="solar:user-id-bold"
      />
      <section dir="rtl" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Icon
            icon="solar:check-circle-bold"
            className="w-16 h-16 mx-auto text-green-600 mb-4"
          />
          <p className="text-lg text-gray-600">
            تم حفظ رابط المندوب بنجاح. سيتم ربط طلباتك بهذا المندوب.
          </p>
        </div>
      </section>
    </main>
  );
}
