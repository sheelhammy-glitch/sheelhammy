import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main dir="rtl" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#0056D2]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#0056D2]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0056D2]/3 rounded-full blur-3xl" />
      </div>

      {/* Decorative icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Icon 
          icon="solar:file-search-bold" 
          className="absolute top-32 right-32 w-24 h-24 text-[#0056D2]/10 rotate-12" 
        />
        <Icon 
          icon="solar:document-remove-bold" 
          className="absolute bottom-32 left-32 w-20 h-20 text-[#0056D2]/10 -rotate-12" 
        />
        <Icon 
          icon="solar:question-circle-bold" 
          className="absolute top-1/4 left-1/4 w-16 h-16 text-[#0056D2]/10 rotate-45" 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl sm:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#0056D2] via-[#3B82F6] to-[#60A5FA] leading-none">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#0056D2]/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#0056D2] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#0056D2]/30">
              <Icon icon="solar:file-remove-bold" className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          الصفحة غير موجودة
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة إلى الصفحة الرئيسية أو استكشاف خدماتنا الأكاديمية.
        </p>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-gray-200 text-sm text-gray-700 shadow-sm">
            <Icon icon="solar:home-2-bold" className="w-5 h-5 text-[#0056D2]" />
            <span>الصفحة الرئيسية</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-gray-200 text-sm text-gray-700 shadow-sm">
            <Icon icon="solar:document-text-bold" className="w-5 h-5 text-[#0056D2]" />
            <span>خدماتنا</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-gray-200 text-sm text-gray-700 shadow-sm">
            <Icon icon="solar:phone-calling-bold" className="w-5 h-5 text-[#0056D2]" />
            <span>تواصل معنا</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            variant="default"
            size="lg"
            className="bg-[#0056D2] hover:bg-[#0047B3] text-white shadow-lg shadow-[#0056D2]/30 rounded-xl px-8 py-6 text-base font-semibold"
          >
            <Link href="/" className="flex items-center gap-2">
              <Icon icon="solar:home-2-bold" className="w-5 h-5" />
              العودة للصفحة الرئيسية
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-[#0056D2] text-[#0056D2] hover:bg-[#EAF3FF] rounded-xl px-8 py-6 text-base font-semibold"
          >
            <Link href="/services" className="flex items-center gap-2">
              <Icon icon="solar:document-text-bold" className="w-5 h-5" />
              استكشف خدماتنا
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">روابط مفيدة:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/about-us" 
              className="text-[#0056D2] hover:text-[#0047B3] hover:underline transition"
            >
              من نحن
            </Link>
            <Link 
              href="/samples" 
              className="text-[#0056D2] hover:text-[#0047B3] hover:underline transition"
            >
              نماذج الأعمال
            </Link>
            <Link 
              href="/blog" 
              className="text-[#0056D2] hover:text-[#0047B3] hover:underline transition"
            >
              المدونة
            </Link>
            <Link 
              href="/contact-us" 
              className="text-[#0056D2] hover:text-[#0047B3] hover:underline transition"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
