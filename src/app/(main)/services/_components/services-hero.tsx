"use client";

import { Icon } from "@iconify/react";

const SERVICES_MARKS = [
  { icon: "solar:case-round-bold", top: "16%", side: "right", offset: "8%", size: 62, rotate: "-10deg" },
  { icon: "solar:document-text-bold", top: "40%", side: "right", offset: "18%", size: 56, rotate: "8deg" },
  { icon: "solar:book-bold", top: "70%", side: "right", offset: "10%", size: 60, rotate: "12deg" },
  { icon: "solar:palette-bold", top: "20%", side: "left", offset: "8%", size: 60, rotate: "10deg" },
  { icon: "solar:code-bold", top: "52%", side: "left", offset: "16%", size: 54, rotate: "0deg" },
  { icon: "solar:graph-up-bold", top: "76%", side: "left", offset: "10%", size: 64, rotate: "-10deg" },
] as const;

export function ServicesHero() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden min-h-[480px] flex items-center justify-center px-6 py-20"
    > 
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(900px 520px at 15% 18%, rgba(225,239,255,0.95) 0%, rgba(255,255,255,0) 62%),
            radial-gradient(900px 520px at 85% 28%, rgba(225,239,255,0.70) 0%, rgba(255,255,255,0) 66%),
            radial-gradient(900px 520px at 55% 88%, rgba(225,239,255,0.55) 0%, rgba(255,255,255,0) 66%),
            linear-gradient(180deg, #FFFFFF 0%, #E1EFFF 46%, #FFFFFF 100%)
          `,
        }}
      />

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        {SERVICES_MARKS.map((m, i) => (
          <div
            key={i}
            className="absolute select-none"
            style={{
              top: m.top,
              [m.side]: m.offset,
              transform: `rotate(${m.rotate})`,
              opacity: 0.075,  
            }}
          >
            <Icon icon={m.icon} width={m.size} style={{ color: "#0056D2" }} />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0056D2] bg-[#EAF3FF] text-[#0056D2] text-xs font-semibold shadow-sm">
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#0056D2]/10">
              <Icon icon="solar:case-round-bold" width={12} className="text-[#0056D2]" />
            </div>
            <span> خدماتنا</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black mb-4">
          خدمات{" "}
          <span className="text-[#0056D2]">
            شاملة
          </span>{" "}
          لجميع احتياجاتك
        </h1>

        <p className="text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto mb-8">
          نقدم مجموعة واسعة من الخدمات الأكاديمية والمهنية المصممة خصيصاً لمساعدتك على تحقيق أهدافك بتميز واحترافية.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: "solar:shield-check-bold", label: "جودة مضمونة" },
            { icon: "solar:clock-circle-bold", label: "تسليم في الوقت المحدد" },
            { icon: "solar:headphones-round-sound-bold", label: "دعم مستمر" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/85 backdrop-blur border border-slate-200 text-slate-700 shadow-sm hover:shadow transition-shadow"
            >
              <Icon icon={item.icon} width={18} style={{ color: "#0056D2" }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
