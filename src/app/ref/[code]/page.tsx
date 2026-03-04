"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function ReferrerPage() {
  const params = useParams();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const code = params?.code as string;
    if (!code) {
      router.push("/contact-us");
      return;
    }

    // Validate referrer code
    const validateCode = async () => {
      try {
        const response = await fetch(`/api/referrer/${code}`);
        if (response.ok) {
          setIsValid(true);
          // Redirect to contact-us with referrer code
          router.push(`/contact-us?ref=${code}`);
        } else {
          setIsValid(false);
          // Invalid code, redirect to contact-us without code
          setTimeout(() => {
            router.push("/contact-us");
          }, 2000);
        }
      } catch (error) {
        console.error("Error validating referrer code:", error);
        setIsValid(false);
        setTimeout(() => {
          router.push("/contact-us");
        }, 2000);
      } finally {
        setIsValidating(false);
      }
    };

    validateCode();
  }, [params, router]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من الرابط...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:close-circle-bold" className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">رابط غير صحيح</h1>
          <p className="text-gray-600 mb-4">الرابط الذي تحاول الوصول إليه غير صحيح أو منتهي الصلاحية.</p>
          <p className="text-sm text-gray-500">سيتم توجيهك إلى صفحة التواصل...</p>
        </div>
      </div>
    );
  }

  return null;
}
