"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link"; 
import aboutImage from "@/assets/about.svg";

const SECTIONS = [
  {
    title: "قصص نجاح",
    icon: "solar:medal-ribbons-star-bold",
    text: "ساهمنا في دعم مئات الطلاب للارتقاء بمستوى أعمالهم الأكاديمية وتسليمها بثقة واستحقاق، مع التزام دقيق بمعايير الجامعة ومتطلباتها.",
  },

  {
    title: "آلية العمل",
    icon: "solar:hand-shake-bold",
    text: "نبدأ بتحليل احتياجك بدقة، ثم نوصي بالخدمة الأنسب ونحدد المتطلبات والجدول الزمني. متابعة مستمرة وتنفيذ منهجي وتسليم منظم في الموعد المتفق عليه.",
  },

  {
    title: "ماذا نقدم",
    icon: "solar:document-text-bold",
    text: "حلول أكاديمية شاملة تمتد من إعداد الأبحاث والتقارير إلى دعم المشاريع والعروض والتدقيق والتنسيق، مع خدمات إضافية حسب متطلباتك.",
  },

  {
    title: "من نحن",
    icon: "solar:users-group-rounded-bold",
    text: "شيل همي منصة أكاديمية متخصصة تقدّم مساعدة احترافية لدعم الطلاب في تنفيذ أعمالهم وفق أعلى المعايير الجامعية وبمنهجية دقيقة.",
  },

];

export function AboutSection() {
  return (
    <section
      dir="rtl"
      className="py-10 bg-gradient-to-b from-white dark:from-gray-900 via-blue-50/20 dark:via-gray-900 to-white dark:to-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="order-1 lg:order-1">
            <div className="space-y-8">

              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-1 mb-5 rounded-lg border"
                  style={{ backgroundColor: "#ffffff", borderColor: "#0056d2", borderWidth: "2px" }}
                >
                  <Icon
                    icon="solar:info-circle-bold"
                    className="w-4 h-4"
                    style={{ color: "#0056d2" }}
                  />
                  <span className="text-sm font-bold" style={{ color: "#0056d2" }}>
                    عن شيل همّي
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-4xl font-extrabold mb-6">
                  <span className="text-black">تعرّف </span>
                  <span className="relative inline-block" style={{ color: "#0056d2" }}>
                    علينا
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                      <path d="M2 10C60 3 140 3 198 10" stroke="#0056d2" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </h2>

                <p className="text-lg md:text-ms text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  منصة أكاديمية متخصصة تقدّم مساعدة احترافية لدعم الطلاب في تنفيذ أعمالهم وفق أعلى المعايير الجامعية
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                {SECTIONS.map((s) => (
                  <div key={s.title} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                        <Icon icon={s.icon} className="w-5 h-5 text-[#0056d2]" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{s.title}</h3>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 text-[#0056d2] font-semibold text-sm hover:gap-3 transition-all duration-300"
                >
                  تعرّف علينا أكثر
                  <Icon
                    icon="solar:arrow-left-bold"
                    className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <div className="relative p-4 lg:p-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0056d2]/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0056d2]/5 rounded-full blur-3xl -z-10" />
              <div className="relative overflow-hidden  rounded-3xl bg-white/5 dark:bg-blue-900/10 backdrop-blur-[2px] border border-white/10 dark:border-blue-800/20">
                <div className="relative  z-10 p-4">
                  <Image
                    src={aboutImage}
                    alt="منصة شيل همي - خدمات أكاديمية وطلابية"
                    width={560}
                    height={560}
                    className="w-full max-w-sm lg:max-w-lg h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
