"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import FAQRow from "@/components/common/FAQRow";

export type FAQItem = {
  q: string;
  a: string;
  category: string;
};

type DBFAQ = {
  id: string;
  question: string;
  answer: string;
};

const WHATSAPP_NUMBER = "962781858647";
const WHATSAPP_TEXT = encodeURIComponent("مرحبًا، لدي استفسار بخصوص خدمات شيل همّي.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;
 
const FALLBACK_FAQS: FAQItem[] = [
  {
    q: "كيف أقدّم طلب خدمة على شيل همّي؟",
    a: "اختر الخدمة، اكتب التفاصيل (المادة/المقرر، التعليمات، الموعد)، وارفع الملفات إن وجدت. بعدها نتواصل لتأكيد المتطلبات وتحديد المدة والتكلفة ثم نبدأ التنفيذ.",
    category: "البدء",
  },
  {
    q: "ما الخدمات التي تقدمونها للطلاب؟",
    a: "نقدم: إعداد الواجبات والأسايمنت، التقارير والأبحاث، عروض PowerPoint، مشاريع التخرج، الشروحات، التلخيص، والتحضير للاختبارات وفق متطلباتك.",
    category: "الخدمات",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/faqs");
        if (!res.ok) {
          throw new Error("Failed to fetch FAQs");
        }
        const data: DBFAQ[] = await res.json();
         
        const transformedFAQs: FAQItem[] = Array.isArray(data)
          ? data.map((faq) => ({
              q: faq.question,
              a: faq.answer,
              category: "عام", 
            }))
          : [];
         
        setFaqs(transformedFAQs.length > 0 ? transformedFAQs : FALLBACK_FAQS);
      } catch (error) {
        console.error("Error fetching FAQs:", error); 
        setFaqs(FALLBACK_FAQS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <section
      className="relative py-16 overflow-hidden bg-white dark:bg-gray-950"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 mb-5 rounded-lg border"
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#0056d2",
              borderWidth: "2px",
            }}
          >
            <Icon
              icon="solar:chat-round-line-bold"
              className="w-4 h-4"
              style={{ color: "#0056d2" }}
            />
            <span className="text-sm font-bold" style={{ color: "#0056d2" }}>
              أسئلة شائعة
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-4xl font-extrabold mb-6">
            <span className="text-black dark:text-white">كل ما تحتاج </span>
            <span className="relative inline-block" style={{ color: "#0056d2" }}>
              معرفته
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C60 3 140 3 198 10"
                  stroke="#0056d2"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg md:text-ms text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            إجابات سريعة ومباشرة لأهم استفساراتك
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-3 max-w-5xl mx-auto mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              icon="solar:question-circle-bold"
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              لا توجد أسئلة شائعة متاحة حالياً
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3 max-w-5xl mx-auto mb-12">
            {faqs.map((item, i) => (
              <FAQRow
                key={`faq-${i}`}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="
      inline-flex items-center gap-2.5
      px-5 py-2
      rounded-xl
      bg-[#0056D2] text-white
      font-semibold text-sm
      shadow-sm
      border border-transparent
      transition-all duration-300
      hover:border-white
      hover:shadow-md
      hover:scale-[1.02]
      focus:outline-none focus:ring-2 focus:ring-[#0056D2]/30
    "
            aria-label="التواصل عبر واتساب"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 border border-white/15">
              <Icon icon="ri:whatsapp-fill" className="w-4 h-4 text-white" />
            </span>

            <span className="text-right leading-tight">
              <span className="block">لديك سؤال؟</span>
              <span className="block text-[11px] font-medium text-white/85">
                تواصل عبر واتساب
              </span>
            </span>

            <Icon icon="solar:arrow-left-bold" className="w-3.5 h-3.5 opacity-90" />
          </a>
        </div>


      </div>
    </section>
  );
}
