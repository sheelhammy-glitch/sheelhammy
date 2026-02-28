"use client";

import {  useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import StepModalProess from "@/components/common/StepModalProess";

export const PROCESS_STEPS = [
{
  number: "01",
  icon: "solar:letter-opened-bold",
  title: "استقبال الطلب",
  description:
    "بمجرد استلام طلبك عبر النموذج أو الواتساب، يقوم فريقنا بمراجعته بشكل فوري ودقيق للتأكد من وضوح جميع المتطلبات الأكاديمية. نتأكد من فهم المادة، التعليمات، الموعد النهائي، وأي ملاحظات خاصة قبل الانتقال للمرحلة التالية، لضمان بداية منظمة وواضحة للعمل.",
},

{
  number: "02",
  icon: "solar:clipboard-list-bold",
  title: "جمع البيانات",
  description:
    "نتواصل معك لجمع كافة التفاصيل الأكاديمية المطلوبة مثل التعليمات الرسمية، معايير التقييم، عدد الصفحات، أسلوب التوثيق (APA / MLA)، والموعد النهائي. نحرص على توثيق كل نقطة بدقة لضمان تنفيذ العمل وفق متطلبات المقرر دون أي نقص أو اجتهاد غير محسوب.",
},

{
  number: "03",
  icon: "solar:document-text-bold",
  title: "تقديم عرض السعر",
  description:
    "بعد مراجعة جميع التفاصيل، نقدم لك عرض سعر واضح ومحدد يشمل تكلفة التنفيذ ومدة التسليم المتوقعة. نعتمد تسعيراً شفافاً دون أي رسوم مخفية، بحيث تكون الصورة كاملة أمامك قبل البدء بالعمل.",
},

{
  number: "04",
  icon: "solar:magic-stick-bold",
  title: "البدء في التنفيذ",
  description:
    "بعد اعتماد العرض، يبدأ الفريق الأكاديمي المختص بتنفيذ العمل وفق التعليمات والمعايير المتفق عليها. نلتزم بالدقة المنهجية، سلامة الصياغة، والتوثيق الصحيح للمراجع، مع متابعة مستمرة لضمان جودة العمل قبل الانتقال لمرحلة التسليم.",
},

{
  number: "05",
  icon: "streamline:send-email-remix",
  title: "تسليم العمل",
  description:
    "بعد إتمام التنفيذ والمراجعة النهائية، يتم تسليم العمل بصيغته الكاملة والمنسقة وفق المعايير الأكاديمية المطلوبة. نحرص على الالتزام بالموعد النهائي بدقة، مع التأكد من جاهزية الملف للتسليم المباشر دون الحاجة لأي تعديلات إضافية.",
},

{
  number: "06",
  icon: "solar:headphones-round-sound-bold",
  title: "متابعة ما بعد التسليم",
  description:
    "لا تنتهي علاقتنا عند التسليم، بل نتابع معك للتأكد من رضاك الكامل عن العمل. في حال وجود أي ملاحظات أو تعديلات مطلوبة وفق تعليمات الدكتور، نتعامل معها بسرعة واحترافية لضمان أفضل نتيجة ممكنة.",
},

];

export type Step = (typeof PROCESS_STEPS)[number];



export function ProcessSection() {
  const [active, setActive] = useState<Step | null>(null);
  const steps = useMemo(() => PROCESS_STEPS, []);

  return (
    <section dir="rtl" className="py-10 bg-[#e1efff] dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:w-7xl w-full">
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
              icon="solar:checklist-bold"
              className="w-4 h-4"
              style={{ color: "#0056d2" }}
            />
            <span className="text-sm font-bold" style={{ color: "#0056d2" }}>
              مراحل تنفيذ الخدمة
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-4xl font-extrabold mb-6">
            <span className="text-black">نرافقك خطوة </span>
            <span className="relative inline-block" style={{ color: "#0056d2" }}>
              بخطوة
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

          <p className="text-lg md:text-ms text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نرافقك في كل خطوة من بداية الطلب حتى التسليم النهائي باحترافية عالية
          </p>
        </div>

        <div className="relative"> 
          <div className="hidden lg:block absolute top-[36px] right-[8.33%] left-[8.33%] h-[3px] bg-gradient-to-l from-[#0056d2] via-[#0056d2]/35 to-[#0056d2] rounded-full" />
 
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
            {steps.map((step) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActive(step)}
                className="group flex flex-col items-center text-center outline-none cursor-pointer"
                aria-label={`فتح تفاصيل الخطوة ${step.number}: ${step.title}`}
              >
                <div className="relative mb-4">
                  <div className="w-[78px] h-[78px] rounded-2xl bg-white/90 dark:bg-gray-800/80 border border-[#0056d2]/25 dark:border-blue-400/20 shadow-sm backdrop-blur flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                    <div className="w-[58px] h-[58px] rounded-xl bg-[#EFF6FF] dark:bg-blue-900/20 border border-[#0056d2]/25 dark:border-blue-400/20 flex items-center justify-center">
                      <Icon icon={step.icon} className="w-9 h-9 text-[#0056d2]" />
                    </div>
                  </div>

                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-[#0056d2] to-[#2563EB] dark:from-blue-500 dark:to-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#0056d2] dark:group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  عرض التفاصيل
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <StepModalProess open={!!active} step={active} onClose={() => setActive(null)} />
    </section>
  );
}
