"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";

import { FloatingUI } from "@/components/common/floating-ui";
import hero1 from "@/assets/sliderone.webp";
import hero2 from "@/assets/slidertwo.webp";
import hero3 from "@/assets/sliderthree.webp";

const SLIDES = [
  {
    image: hero1,
    badge: "معايير أكاديمية يعتمد عليها الطلاب",
    title: (
      <>
        نقدّم لك <span className="text-[#0056d2]">تنفيذًا</span> أكاديميًا{" "}
        <span className="text-[#0056d2]">احترافيًا</span> بمعايير دقيقة
      </>
    ),
    description:
      "إعداد الأبحاث والتقارير ومشاريع التخرج وفق ضوابط علمية واضحة وإشراف متخصص.",
    features: ["فريق أكاديمي متخصص", "محتوى أصلي موثق", "دعم احترافي متواصل"],
  },
  {
    image: hero2,
    badge: "إنجاز أكاديمي بثقة واستحقاق",
    title: (
      <>
        نحو <span className="text-[#0056d2]">نتائج</span> أكاديمية مشرّفة{" "}
        <span className="text-[#0056d2]">تعكس تميزك</span>
      </>
    ),
    description:
      "تنفيذ أكاديمي دقيق يواكب متطلبات جامعتك، ويمنحك الثقة لتسلّم أعمالك بأعلى مستوى من الاحتراف.",
    features: ["التزام صارم بالمواعيد", "مراجعة وتدقيق احترافي", "تنسيق أكاديمي معتمد"],
  },
  {
    image: hero3,
    badge: "التزام دقيق بالمواعيد",
    title: (
      <>
        جاهز <span className="text-[#0056d2]">في الوقت المحدد</span> دون تنازل عن
        الجودة
      </>
    ),
    description:
      "تنفيذ أكاديمي منظم يضمن تسليم أعمالك ضمن الإطار الزمني المطلوب، مع مراجعة دقيقة وخصوصية كاملة.",
    features: ["تسليم قبل الموعد النهائي", "مراجعة وتدقيق شامل", "خصوصية وسرية تامة"],
  },
];

const AUTOPLAY_INTERVAL = 5500;

export function HeroSection() {
  const slides = useMemo(() => SLIDES, []);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);


  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const dx = (e.clientX - w / 2) / (w / 2);
      const dy = (e.clientY - h / 2) / (h / 2);
      setParallax({ x: dx, y: dy });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const handleDotClick = (index: number) => {
    setCurrent(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const px = parallax.x;
  const py = parallax.y;

  return (
    <section
      dir="rtl"
      className="relative min-h-[100vh] flex items-center overflow-hidden pt-10 bg-white dark:bg-gray-950"
    >
      <FloatingUI />


      <div className="absolute inset-0 z-0 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,86,210,0.12),transparent_45%),radial-gradient(circle_at_80%_35%,rgba(225,239,255,0.95),transparent_55%),radial-gradient(circle_at_50%_95%,rgba(0,86,210,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,0.65),rgba(255,255,255,0.9))] dark:bg-[linear-gradient(to_bottom,rgba(3,7,18,0.9),rgba(3,7,18,0.65),rgba(3,7,18,0.95))]" />


        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
          }}
        />


        <div
          className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full blur-[1px]"
          style={{
            transform: `translate3d(${px * 14}px, ${py * 10}px, 0)`,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(225,239,255,0.9) 22%, rgba(0,86,210,0.16) 55%, rgba(0,86,210,0.06) 70%, transparent 76%)",
            boxShadow:
              "0 40px 120px rgba(0,86,210,0.14), inset 0 0 80px rgba(255,255,255,0.55)",
          }}
        />
        <div
          className="absolute -bottom-28 -left-28 w-[620px] h-[620px] rounded-full"
          style={{
            transform: `translate3d(${px * -16}px, ${py * -12}px, 0)`,
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(225,239,255,0.85) 20%, rgba(0,86,210,0.14) 55%, rgba(0,86,210,0.05) 72%, transparent 78%)",
            filter: "blur(0px)",
            boxShadow:
              "0 50px 140px rgba(0,86,210,0.12), inset 0 0 90px rgba(255,255,255,0.45)",
            opacity: 0.9,
          }}
        />


        <div
          className="absolute top-[18%] left-[10%] w-[340px] h-[240px] rounded-[2rem] border border-white/50"
          style={{
            transform: `perspective(900px) rotateY(${px * 8}deg) rotateX(${py * -6}deg) translate3d(${px * -10}px, ${py * -6}px, 0)`,
          }}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_55%)]" />
          <div className="absolute bottom-6 right-6 opacity-20">
            <Icon icon="solar:document-text-bold" className="w-16 h-16 text-[#0056d2]" />
          </div>
        </div>

        <div
          className="absolute top-[28%] right-[14%] w-[260px] h-[190px] rounded-[2rem] border border-white/45 "
          style={{
            transform: `perspective(900px) rotateY(${px * -7}deg) rotateX(${py * 6}deg) translate3d(${px * 12}px, ${py * 8}px, 0)`,
          }}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.85),transparent_55%)]" />
          <div className="absolute bottom-6 left-6 opacity-20">
            <Icon icon="solar:graduation-cap-bold" className="w-16 h-16 text-[#0056d2]" />
          </div>
        </div>


        <div
          className="absolute bottom-[12%] right-[22%] w-[220px] h-[220px] rounded-full"
          style={{
            transform: `translate3d(${px * 8}px, ${py * 6}px, 0)`,
            background:
              "conic-gradient(from 180deg, rgba(0,86,210,0.14), rgba(225,239,255,0.7), rgba(0,86,210,0.10))",
            WebkitMask:
              "radial-gradient(circle, transparent 58%, #000 60%)",
            mask: "radial-gradient(circle, transparent 58%, #000 60%)",
            opacity: 0.75,
            filter: "blur(0.2px)",
          }}
        />


        <div className="absolute bottom-0 left-0 w-full opacity-25">
          <svg className="w-full h-72" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave3d" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E1EFFF" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#0056D2" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#E1EFFF" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <path
              d="M0,52 Q300,10 600,48 T1200,52 L1200,120 L0,120 Z"
              fill="url(#wave3d)"
            />
          </svg>
        </div>
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="text-right order-2 lg:order-1 relative">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${current === index
                    ? "opacity-100 relative z-10"
                    : "opacity-0 absolute inset-0 z-0 pointer-events-none"
                  }`}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-1 mb-5 rounded-lg border border-[#0056d2]/10 bg-white/70 backdrop-blur-xl shadow-sm"
                >
                  <Icon
                    icon="solar:medal-ribbons-star-bold"
                    className="w-4 h-4"
                    style={{ color: "#0056d2" }}
                  />
                  <span className="text-sm font-bold" style={{ color: "#0056d2" }}>
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                  {slide.title}
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  {slide.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Icon icon="solar:stars-line-duotone" className="w-4 h-4 text-[#0056d2]" />
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/contact-us"
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                        bg-[#0056d2] text-white text-sm font-semibold 
                        shadow-lg shadow-[#0056d2]/25 
                        transition-all duration-300 
                        hover:shadow-xl hover:shadow-[#0056d2]/35 
                        hover:-translate-y-0.5"
                    >
                      قدّم طلبك الآن
                      <Icon
                        icon="solar:arrow-left-linear"
                        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                      />
                    </Link>

                    <Link
                      href="/services"
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                        bg-white/65 backdrop-blur-xl 
                        border border-[#0056d2]/20
                        text-[#0056d2] text-sm font-medium
                        transition-all duration-300 
                        hover:bg-white hover:border-[#0056d2]/40 
                        hover:-translate-y-0.5"
                    >
                      <Icon
                        icon="solar:book-2-outline"
                        className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                      />
                      استكشف الخدمات
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative hidden lg:block order-1 lg:order-2">
            <div
              className="relative w-full h-[475px] overflow-hidden"
              style={{
                transform: `perspective(900px) rotateY(${px * -3}deg) rotateX(${py * 2}deg)`,
                transition: "transform 120ms ease-out",
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${current === index ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                  <Image
                    src={slide.image}
                    alt={`Hero ${index + 1}`}
                    fill
                    className="object-contain object-center select-none pointer-events-none"
                    priority={index === 0}
                    draggable={false}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDotClick(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${current === i ? "w-8 bg-[#0056d2]" : "w-2 bg-[#0056d2]/30"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}