"use client";

import { Icon } from "@iconify/react";

interface ChipItem {
  label: string;
  icon: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;

  badge?: string;
  badgeIcon?: string;

  chips?: ChipItem[];
  className?: string;
}

const DEFAULT_CHIPS: readonly ChipItem[] = [
  { label: "جودة عالية", icon: "solar:star-bold" },
  { label: "خصوصية وشفافية", icon: "solar:shield-check-bold" },
  { label: "دعم سريع", icon: "solar:bolt-bold" },
] as const;

const DEFAULT_POLICY_DESCRIPTION =
  "نلتزم بسياسات واضحة تضمن الشفافية، حماية البيانات، وتجربة استخدام آمنة.";

/* ✅ أشكال خلفية تدل على السياسات */
const POLICY_MARKS = [
  // Right side
  { icon: "solar:document-text-bold", top: "15%", side: "right", offset: "8%", size: 64, rotate: "-8deg" },
  { icon: "solar:shield-check-bold", top: "45%", side: "right", offset: "16%", size: 60, rotate: "10deg" },
  { icon: "solar:scale-bold", top: "75%", side: "right", offset: "10%", size: 58, rotate: "-12deg" },

  // Left side
  { icon: "solar:lock-bold", top: "22%", side: "left", offset: "10%", size: 62, rotate: "12deg" },
  { icon: "solar:clipboard-text-bold", top: "55%", side: "left", offset: "18%", size: 56, rotate: "-6deg" },
  { icon: "solar:pen-new-square-bold", top: "80%", side: "left", offset: "8%", size: 60, rotate: "8deg" },
] as const;

export function PageHero({
  title,
  subtitle,
  description,
  badge = "سياساتنا",
  badgeIcon = "solar:document-text-bold",
  chips = DEFAULT_CHIPS as ChipItem[],
  className = "",
}: PageHeroProps) {
  return (
    <section
      dir="rtl"
      className={`relative overflow-hidden flex items-center justify-center px-6 py-20 md:py-24 min-h-[450px] ${className}`}
    >
      {/* Background mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(900px 520px at 20% 20%, rgba(225,239,255,0.9) 0%, rgba(255,255,255,0) 65%),
            radial-gradient(900px 520px at 80% 30%, rgba(225,239,255,0.6) 0%, rgba(255,255,255,0) 70%),
            linear-gradient(180deg, #FFFFFF 0%, #E1EFFF 50%, #FFFFFF 100%)
          `,
        }}
      />

      {/* Decorative policy icons (watermark style) */}
      <div className="absolute inset-0 pointer-events-none">
        {POLICY_MARKS.map((m, i) => (
          <div
            key={i}
            className="absolute select-none"
            style={{
              top: m.top,
              [m.side]: m.offset,
              transform: `rotate(${m.rotate})`,
              opacity: 0.07,
            }}
          >
            <Icon icon={m.icon} width={m.size} style={{ color: "#0056D2" }} />
          </div>
        ))}
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0056D2] bg-[#EAF3FF] text-[#0056D2] text-xs font-semibold shadow-sm">
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#0056D2]/10">
              <Icon icon={badgeIcon} width={12} className="text-[#0056D2]" />
            </div>
            <span>{badge}</span>
          </div>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="mb-2 text-sm md:text-base font-semibold text-[#0056D2]/80">
            {subtitle}
          </p>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black mb-4">
          {title}
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto mb-6">
          {description ?? DEFAULT_POLICY_DESCRIPTION}
        </p>

        {/* Chips */}
        {chips?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {chips.map((item, i) => (
              <div
                key={`${item.label}-${i}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/85 backdrop-blur border border-slate-200 text-slate-700 shadow-sm hover:shadow transition-shadow"
              >
                <Icon icon={item.icon} width={18} style={{ color: "#0056D2" }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
