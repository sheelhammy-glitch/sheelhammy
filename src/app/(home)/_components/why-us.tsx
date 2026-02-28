"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import DetailsModalWhyUS from "@/components/common/DetailsModalWhyUS";

export const THEME = {
  primary: "#0056d2",
  soft: "#e1efff",
  black: "#000000",
  white: "#ffffff",
};

 export const FEATURES = [
  {
    icon: "qlementine-icons:quality-4-16",
    title: "معايير جودة دقيقة",
    description:
      "نلتزم بتقديم أعمال أكاديمية مطابقة للمعايير الجامعية، مع تدقيق شامل يضمن الدقة والاتساق.",
    details: {
      points: [
        "مراجعة لغوية ومنهجية متعددة المراحل",
        "تنسيق معتمد وفق أنظمة APA / MLA / Chicago",
        "تحقق دقيق من المراجع والاقتباسات",
      ],
      note: "الجودة ليست خيارًا — بل معيار ثابت في كل عمل.",
    },
  },
  {
    icon: "solar:users-group-two-rounded-bold",
    title: "فريق أكاديمي متخصص",
    description:
      "يضم فريقنا مختصين في مختلف التخصصات لضمان تنفيذ كل طلب وفق خلفية علمية مناسبة.",
    details: {
      points: [
        "تخصصات متعددة تغطي المجالات الأكاديمية الرئيسية",
        "خبرة عملية في الكتابة والبحث الأكاديمي",
        "إسناد كل مشروع لمختص في مجاله",
      ],
      note: "الاختصاص الدقيق أساس جودة التنفيذ.",
    },
  },
  {
    icon: "solar:clock-circle-bold",
    title: "التزام صارم بالمواعيد",
    description:
      "نُدير كل طلب وفق جدول زمني واضح يضمن التسليم ضمن الموعد المتفق عليه.",
    details: {
      points: [
        "تحديد إطار زمني واضح منذ البداية",
        "مراحل تنفيذ منظمة عند الحاجة",
        "إمكانية التسليم العاجل وفق الضوابط",
      ],
      note: "الوقت عنصر أساسي في منهجيتنا.",
    },
  },
  {
    icon: "solar:lock-password-bold",
    title: "خصوصية وحماية بيانات",
    description:
      "نطبّق سياسات صارمة لحماية معلوماتك وملفاتك الأكاديمية بأعلى درجات السرية.",
    details: {
      points: [
        "حفظ البيانات بسرية تامة",
        "عدم مشاركة أي معلومات مع أطراف خارجية",
        "إدارة الملفات وفق معايير أمان واضحة",
      ],
      note: "ثقتك مسؤوليتنا.",
    },
  },
  {
    icon: "solar:verified-check-bold",
    title: "دعم مستمر بعد التسليم",
    description:
      "نوفّر متابعة وتعديلات ضمن نطاق المتطلبات لضمان رضاك الكامل عن النتيجة النهائية.",
    details: {
      points: [
        "تعديلات وفق المتطلبات الأصلية",
        "توضيحات بعد التسليم عند الحاجة",
        "متابعة حتى اعتماد النسخة النهائية",
      ],
      note: "نجاحك لا ينتهي عند لحظة التسليم.",
    },
  },
  {
    icon: "solar:star-bold",
    title: "منهجية قائمة على الثقة",
    description:
      "نبني علاقتنا مع عملائنا على الشفافية والوضوح والالتزام بمعايير احترافية ثابتة.",
    details: {
      points: [
        "تواصل واضح ومباشر",
        "تطوير مستمر للخدمات",
        "معايير أداء محددة وقابلة للقياس",
      ],
      note: "الثقة هي أساس استمراريتنا.",
    },
  },
];
 




export function WhyUsSection() {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const selectedFeature = useMemo(() => {
    if (selectedIndex === null) return null;
    return FEATURES[selectedIndex] ?? null;
  }, [selectedIndex]);

  useEffect(() => setIsVisible(true), []);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    window.setTimeout(() => setSelectedIndex(null), 180);
  };

  return (
    <section id="why-us-section" dir="rtl" className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-white dark:bg-slate-950" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
       
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 mb-5 rounded-lg border"
            style={{ backgroundColor: THEME.white, borderColor: THEME.primary, borderWidth: "2px" }}
          >
            <Icon icon="solar:star-bold" className="w-4 h-4" style={{ color: THEME.primary }} />
            <span className="text-sm font-bold" style={{ color: THEME.primary }}>
              مميزاتنا الفريدة
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-4xl font-extrabold mb-6">
            <span className="text-[#000000]">لماذا </span>
            <span className="relative inline-block text-[#0056d2]">
              شيل همي
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C60 3 140 3 198 10" stroke={THEME.primary} strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-[#000000]">؟</span>
          </h2>

          <p className="text-lg md:text-base text-black/70 max-w-3xl mx-auto leading-relaxed">
            ستة ركائز تجعلنا شريكك الموثوق في رحلة النجاح الأكاديمي والمهني
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className={[
                "group relative transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
              ].join(" ")}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <div className="relative h-full">
                <div
                  className="absolute -inset-0.5 rounded-[28px] opacity-0 group-hover:opacity-[0.10] blur-xl transition-all duration-500"
                  style={{ background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.black})` }}
                />

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openModal(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openModal(index);
                    }
                  }}
                  className={[
                    "relative h-full cursor-pointer",
                    "rounded-[28px] p-6",
                    "bg-white/95 dark:bg-slate-900/92",
                    "backdrop-blur-xl backdrop-saturate-150",
                    "border border-[#e1efff] dark:border-white/10",
                    "shadow-[0_10px_30px_-22px_rgba(0,0,0,0.14)]",
                    "hover:shadow-[0_14px_40px_-24px_rgba(0,0,0,0.18)]",
                    "transform transition-all duration-400 ease-out",
                    "hover:-translate-y-1",
                    "hover:border-[#0056d2]/45 dark:hover:border-white/20",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056d2]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950",
                    "flex flex-col",
                  ].join(" ")}
                >
                  <div
                    className="absolute top-0 left-0 w-16 h-16 rounded-tl-[28px] rounded-br-[60px] transition-all duration-500 group-hover:w-20 group-hover:h-20"
                    style={{ backgroundColor: THEME.soft, opacity: 0.75 }}
                  />

                  <div className="relative mb-4">
                    <div className="flex items-start gap-4"> 
                      <div className="relative">
                        <div
                          className="absolute inset-0 rounded-2xl blur-lg opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                          style={{ background: `radial-gradient(circle at 30% 30%, ${THEME.primary}, transparent 65%)` }}
                        />
                        <div
                          className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)] transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                          style={{ backgroundColor: THEME.primary }}
                        >
                          <Icon icon={feature.icon} className="w-7 h-7 text-white drop-shadow-lg" />
                        </div>
                      </div>

                      <div className="flex-1 pt-1">
                        {/* ✅ نص أساسي أسود + عند hover يصير 0056d2 */}
                        <h3 className="text-lg font-extrabold text-[#000000] dark:text-white transition-colors duration-300 group-hover:text-[#0056d2]">
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-black/70 dark:text-white/75 text-sm sm:text-[15px] leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  <div className="mt-4 relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(index);
                      }}
                      className="inline-flex items-center gap-2 text-[#0056d2] font-semibold text-sm transition-all duration-300 hover:gap-3 hover:underline cursor-pointer"
                    >
                      قراءة المزيد
                      <Icon
                        icon="solar:arrow-left-line-duotone"
                        className="w-5 h-5 text-black/60 dark:text-white/70"
                      />
                    </button>

                    <div className="absolute -bottom-3 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#e1efff] to-transparent opacity-90" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
 
        <DetailsModalWhyUS open={open} onClose={closeModal} feature={selectedFeature} />
      </div>
    </section>
  );
}
