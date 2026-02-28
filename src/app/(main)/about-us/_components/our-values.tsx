"use client";

import { Icon } from "@iconify/react";

const PRIMARY = "#0056D2";

const VALUES = [
  {
    icon: "solar:medal-ribbons-star-bold",
    title: "جودة أكاديمية",
    description:
      "نلتزم بمعايير جامعية دقيقة وتنفيذ منظم يضمن مخرجات واضحة وجاهزة للتسليم.",
  },
  {
    icon: "solar:shield-check-bold",
    title: "سرية وخصوصية",
    description:
      "نحافظ على خصوصية ملفاتك ومعلوماتك بأعلى درجات الحماية، ولا نشارك أي بيانات مع أي طرف.",
  },
  {
    icon: "solar:clock-circle-bold",
    title: "التزام بالوقت",
    description:
      "نحدد جدولًا زمنيًا واضحًا ونلتزم بالتسليم في الموعد المتفق عليه دون تأخير.",
  },
  {
    icon: "solar:users-group-two-rounded-bold",
    title: "إشراف ومنهجية",
    description:
      "نبدأ بفهم المتطلبات بدقة ثم ننفّذ بخطوات واضحة ومتابعة مستمرة حتى التسليم النهائي.",
  },
  {
    icon: "solar:chat-round-dots-bold",
    title: "تواصل سريع",
    description:
      "قنوات تواصل مرنة ومتابعة مستمرة للإجابة على استفساراتك وتحديثك أولًا بأول.",
  },
  {
    icon: "solar:graph-up-bold",
    title: "تحسين مستمر",
    description:
      "نطوّر أساليبنا باستمرار لنقدّم تجربة أفضل وجودة أعلى بما يواكب احتياجات الطلاب ومتطلبات الجامعات.",
  },
];

export function OurValues() {
  return (
    <section dir="rtl" className="bg-white py-16">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:w-7xl lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0056D2] bg-white text-[#0056D2] text-xs font-semibold shadow-sm">
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#0056D2]/10">
                <Icon icon="solar:info-circle-bold" width={12} className="text-[#0056D2]" />
              </div>
              <span> قيمنا</span>
            </div>

          <h2 className="mt-4 text-2xl font-black leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
            ما <span className="text-[#0056D2]">نؤمن به</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            قيم واضحة توجه طريقة عملنا وتضمن لك تجربة أكاديمية منظمة، موثوقة، وبنتائج احترافية.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ borderColor: `${PRIMARY}18` }}
            >
              {/* Bottom hover line */}
              <div
                className="absolute inset-x-0 bottom-0 h-[3px] translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${PRIMARY}, transparent)`,
                }}
              />

              <div className="flex items-start gap-4">
                {/* Icon */}
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
                    <Icon icon={value.icon} className="h-5 w-5 text-white" />
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 transition-colors duration-300 group-hover:text-[#0056D2]">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                    {value.description}
                  </p>
                </div>
              </div>

              {/* subtle corner glow */}
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