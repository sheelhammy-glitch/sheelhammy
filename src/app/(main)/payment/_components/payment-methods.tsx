"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import arabbank from "@/assets/Arabbank.png";
import cliq from "@/assets/cliq.png";
import moneygram from "@/assets/moneygram.png";
import uwallet from "@/assets/Uwallet.png";
import westrn from "@/assets/Westrn.png";
import zainchah from "@/assets/Zainchah.png";

type PaymentMethod = {
  name: string;
  image: StaticImageData;
  description: string;
  highlights: string[];
  note: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: "Arab Bank",
    image: arabbank,
    description: "تحويل بنكي آمن وسريع عبر البنك العربي.",
    highlights: ["آمن ومضمون", "متاح 24/7"],
    note: "مناسب للتحويلات البنكية",
  },
  {
    name: "CliQ",
    image: cliq,
    description: "تحويل فوري وسهل باستخدام CliQ.",
    highlights: ["تحويل فوري", "سهل الاستخدام"],
    note: "الأسرع للتأكيد",
  },
  {
    name: "MoneyGram",
    image: moneygram,
    description: "تحويلات مالية عالمية عبر MoneyGram.",
    highlights: ["عالمي", "سريع"],
    note: "متاح في دول كثيرة",
  },
  {
    name: "U-Wallet",
    image: uwallet,
    description: "محفظة إلكترونية للدفع والتحويل بسهولة.",
    highlights: ["محفظة رقمية", "آمن"],
    note: "مناسب للدفع الإلكتروني",
  },
  {
    name: "Western Union",
    image: westrn,
    description: "تحويلات دولية عبر Western Union.",
    highlights: ["عالمي", "موثوق"],
    note: "حل ممتاز للدولي",
  },
  {
    name: "Zain Cash",
    image: zainchah,
    description: "الدفع الإلكتروني والتحويل عبر زين كاش.",
    highlights: ["إلكتروني", "سريع"],
    note: "شائع داخل الأردن",
  },
];

export function PaymentMethods() {
  return (
    <section dir="rtl" className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAYMENT_METHODS.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-[#0056D2]/35 hover:shadow-md transition"
            >
              {/* Logo + Title */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl border border-gray-100 bg-white flex items-center justify-center">
                  <Image
                    src={m.image}
                    alt={m.name}
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{m.note}</p>
                </div>

                <span className="w-9 h-9 rounded-xl bg-[#EAF3FF] flex items-center justify-center">
                  <Icon icon="solar:card-bold" width={18} className="text-[#0056D2]" />
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {m.description}
              </p>

              {/* Highlights */}
              <div className="mt-4 space-y-2">
                {m.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <Icon icon="solar:check-circle-bold" width={16} className="text-[#0056D2]" />
                    <span className="font-semibold">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-sm text-gray-500">
          بعد إتمام الدفع، يرجى إرسال إيصال الدفع عبر واتساب لتأكيد الطلب وبدء التنفيذ.
        </p>
        {/* Payment Policy Link */}
        <div className="mt-4">
          <Link
            href="/payment-policy"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0056D2] hover:underline"
          >
            <Icon icon="solar:document-text-bold" width={16} />
            الاطلاع على سياسات الدفع
          </Link>
        </div>
      </div>

    </section>
  );
}
