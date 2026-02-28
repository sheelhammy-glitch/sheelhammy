"use client";

import { Icon } from "@iconify/react";

const PRIMARY = "#0056D2";

const STORY_POINTS = [
  {
    icon: "solar:target-bold",
    title: "رؤيتنا",
    description:
      "أن نكون الوجهة الأولى للطلاب في إنجاز متطلباتهم الجامعية بثقة، عبر خدمات طلابية دقيقة تواكب معايير الجامعة.",
  },
  {
    icon: "solar:flag-bold",
    title: "مهمتنا",
    description:
      "تقديم دعم أكاديمي منظم بجودة عالية، يبدأ بفهم احتياج الطالب بدقة وينتهي بتسليم مرتب في الوقت المحدد وبمعايير واضحة.",
  },
  {
    icon: "solar:star-bold",
    title: "قيمنا",
    description:
      "الجودة، الدقة، السرية، الالتزام، والوضوح… مبادئ ثابتة نطبّقها في كل طلب لضمان تجربة موثوقة ونتيجة احترافية.",
  },
];

export function OurStory() {
  return (
    <section dir="rtl" className="relative overflow-hidden bg-white py-16">
      {/* Background decor */}
{/* Background decor */}
<div className="pointer-events-none absolute inset-0">
  ...
</div>

      <div className="relative container mx-auto w-full px-4 sm:px-6 lg:w-7xl lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0056D2] bg-white text-[#0056D2] text-xs font-semibold shadow-sm">
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#0056D2]/10">
                <Icon icon="solar:info-circle-bold" width={12} className="text-[#0056D2]" />
              </div>
              <span> قصتنا</span>
            </div>


          <h2 className="mt-4 text-2xl font-black leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            قصتنا{" "}
            <span className="text-[#0056D2]">ورؤيتنا</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            بدأت شيل همّي من حاجة واضحة: تقديم دعم أكاديمي موثوق يساعد الطلاب على إنجاز أعمالهم
            الجامعية بجودة عالية، تنظيم واضح، وتسليم في الوقت المحدد.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {STORY_POINTS.map((point) => (
            <div
              key={point.title}
              className="group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ borderColor: `${PRIMARY}18` }}
            >
              {/* Hover glow line */}
              <div
                className="absolute inset-x-0 bottom-0 h-[3px] translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${PRIMARY}, transparent)` }}
              />

              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 group-hover:scale-105"
                  style={{
                    borderColor: `${PRIMARY}22`,
                    background: `linear-gradient(135deg, ${PRIMARY}10, #ffffff)`,
                  }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY}, #2563EB)` }}
                  >
                    <Icon icon={point.icon} className="h-5 w-5 text-white" />
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 transition-colors duration-300 group-hover:text-[#0056D2]">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                    {point.description}
                  </p>
                </div>
              </div>

              {/* subtle corner */}
              <div
                className="pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `${PRIMARY}18` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}