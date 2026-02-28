import { Icon } from "@iconify/react";
import Image from "next/image";
import aboutImage from "@/assets/about.svg";

const PRIMARY = "#0056D2";

export function About() {
  return (
    <section dir="rtl" className="relative overflow-hidden bg-white py-16">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: `${PRIMARY}14` }}
        />
        <div
          className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full blur-3xl"
          style={{ background: `${PRIMARY}10` }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            color: PRIMARY,
          }}
        />
      </div>

      <div className="relative container mx-auto w-full px-4 sm:px-6 lg:w-7xl lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0056D2] bg-white text-[#0056D2] text-xs font-semibold shadow-sm">
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#0056D2]/10">
                <Icon icon="solar:info-circle-bold" width={12} className="text-[#0056D2]" />
              </div>
              <span>من نحن</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl">
                شيل همّي… شريكك الأكاديمي{" "}
                <span className="text-[#0056D2]">للإنجاز بثقة</span>
              </h2>
              <p className="text-base text-gray-600 sm:text-lg leading-relaxed">
                منصة أكاديمية متخصصة تقدّم خدمات طلابية عالية الجودة، وفق معايير جامعية دقيقة
                ومنهجية عمل منظمة من لحظة الطلب حتى التسليم.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                <strong className="text-gray-900">شيل همّي</strong> تساعدك على إنجاز متطلباتك
                الجامعية بأسلوب احترافي ومنظم، مع اهتمام بالتفاصيل وتوافق كامل مع تعليمات الجامعة.
              </p>

              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                نبدأ بفهم احتياجك بدقة، ثم نحدد المتطلبات والجدول الزمني، وننفّذ بمتابعة مستمرة
                وتسليم منظم في الوقت المحدد وبجودة تعكس مستوى أكاديمي قوي.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}, #2563EB)` }}
              >
                اطلب الخدمة
                <Icon icon="solar:arrow-left-bold" width={18} />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-extrabold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: `${PRIMARY}22` }}
              >
                تواصل معنا
                <Icon icon="solar:chat-round-dots-bold" width={18} className="text-[#0056D2]" />
              </a>
            </div>
          </div>

          {/* Image بدون كارد */}
          <div className="relative flex justify-center">
            <div
              className="absolute w-72 h-72 bg-[#0056D2]/10 rounded-full blur-3xl"
            />
            <Image
              src={aboutImage}
              alt="منصة شيل همي - خدمات أكاديمية وطلابية"
              width={600}
              height={600}
              className="relative w-full max-w-md h-auto object-contain drop-shadow-xl"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}