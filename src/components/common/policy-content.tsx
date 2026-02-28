"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

const WHATSAPP_NUMBER = "962781858647";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

interface PolicyContentProps {
  title: string; // موجود بالـ props لو بدك لاحقًا، لكن مش رح نعرضه
  lastUpdated: string; // مثل: "2026-02-10" أو "10 فبراير 2026"
  sections: Array<{ title: string; content: string }>;
  intro: string;
  contact: string;
  footer: string;
}

function normalizeToBullets(text: string): string[] {
  const raw = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (raw.length <= 1) {
    const one = (raw[0] ?? "").trim();
    if (!one) return [];
    const parts = one
      .split(
        /(?:\s*[•\-–]\s+)|(?:\s*;\s*)|(?:\s*؛\s*)|(?:\.\s+)|(?:\s*\u2022\s*)/g
      )
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.length ? parts : [one];
  }

  return raw.map((l) => l.replace(/^([•\-–]|(\d+[\)\.\-]))\s*/g, "").trim());
}

const BULLET_ICON = "solar:check-circle-bold";

export function PolicyContent({
  lastUpdated,
  sections,
  intro,
  contact,
  footer,
}: PolicyContentProps) {
  return (
    <section dir="rtl" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* INTRO */}
        <div className="mb-14">
          <p className="text-black/80 leading-loose text-lg whitespace-pre-line">
            {intro}
          </p>
        </div>


        <div className="space-y-14">
          {sections.map((section, index) => {
            const bullets = normalizeToBullets(section.content);
            return (
              <div key={index} className="relative">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-[#0056D2] font-black text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-black">
                      {section.title}
                    </h2>
                    <div className="mt-2 h-px bg-[#E1EFFF]" />
                  </div>
                </div>

                <div className="pl-9 border-l-2 border-[#E1EFFF]">
                  {bullets.length > 0 ? (
                    <ul className="space-y-3">
                      {bullets.map((item, i) => (
                        <li
                          key={i}
                          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-[#fbfdff]"
                        >
                          {/* أصغر + موحدة */}
                          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#0056D2]/10 border border-[#0056D2]/20">
                            <Icon
                              icon={BULLET_ICON}
                              className="w-4 h-4 text-[#0056D2]"
                            />
                          </span>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-bold bg-white border border-[#E1EFFF] text-black/70">
                                نقطة {i + 1}
                              </span>
                            </div>
                            <p className="text-black/75 leading-loose whitespace-pre-line">
                              {item}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-black/75 leading-loose whitespace-pre-line">
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-20 pt-12 border-t border-[#E1EFFF]">
          <div className="flex items-start gap-4 mb-6">
            <Icon
              icon="solar:chat-round-call-bold"
              className="w-6 h-6 text-[#0056D2]"
            />
            <h3 className="text-xl font-semibold text-black">
              للتواصل والاستفسارات
            </h3>
          </div>

          <p className="text-black/75 leading-loose mb-8">{contact}</p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact-us"
              className="
                px-6 py-2.5
                bg-[#0056D2]
                text-white
                rounded-lg
                font-medium
                hover:opacity-90
                transition
              "
            >
              صفحة التواصل
            </Link>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-6 py-2.5
                border border-[#0056D2]
                text-[#0056D2]
                rounded-lg
                font-medium
                hover:bg-[#E1EFFF]
                transition
              "
            >
              واتساب
            </a>
          </div>
        </div>
        <div className="mt-10">
          <span className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold bg-[#E1EFFF] text-[#0056D2]">
            <Icon icon="solar:calendar-bold" className="w-4 h-4" />
            آخر تحديث: فبراير 2026
          </span>
        </div>

        <div className="mt-14 text-sm text-black/50 leading-relaxed">
          {footer}
        </div>
      </div>
    </section>
  );
}
