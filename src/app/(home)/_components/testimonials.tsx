"use client";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { Marquee } from "@/components/ui/marquee";
import LogoImage from "@/assets/logo.svg";
import AnimatedContent from "@/components/animated-content";

type DBTestimonial = {
  id: string;
  clientName: string;
  content: string;
  avatar: string | null;
  rating: number;
  createdAt: string;
};

type ReviewItem = {
  name: string;
  username: string;
  body: string;
  img: string;
  rating?: number;
};

const GRADIENTS = [
  ["#4f46e5", "#6366f1"],
  ["#2563eb", "#38bdf8"],
  ["#1d4ed8", "#60a5fa"],
  ["#0f172a", "#1e293b"],
  ["#334155", "#64748b"],
  ["#0ea5e9", "#22d3ee"],
];

function getGrad(name: string) {
  const s = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[s % GRADIENTS.length];
}
function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function ReviewCard({ name, body, rating = 5 }: ReviewItem) {
  const [g1, g2] = getGrad(name);
  return (
    <div className="trc">
      <div className="trc-glow" style={{ background: `linear-gradient(135deg, ${g1}18, ${g2}10)` }} />

      <div className="trc-header">
        <div className="trc-av" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
          {getInitials(name)}
        </div>

        <div className="trc-meta">
          <span className="trc-name">{name}</span>
          <span className="trc-role">طالب أكاديمي</span>
        </div>

        <div className="trc-stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <Icon
              key={s}
              icon="solar:star-bold"
              style={{
                width: 11,
                height: 11,
                color: s <= rating ? "#f59e0b" : "#e2e8f0",
              }}
            />
          ))}
        </div>
      </div>

      <div className="trc-line" style={{ background: `linear-gradient(to right, ${g1}40, ${g2}40, transparent)` }} />

      <div className="trc-body">
        <Icon icon="solar:quote-up-square-bold" className="trc-qicon" style={{ color: g1 }} />
        <p className="trc-text">{body}</p>
      </div>


    </div>
  );
}

const SectionHeader = () => (
  <div className="text-center mb-12">
    <div
      className="inline-flex items-center gap-2 px-4 py-1 mb-5 rounded-lg border"
      style={{ backgroundColor: "#ffffff", borderColor: "#0056d2", borderWidth: "2px" }}
    >
      <span className="flex items-center gap-2 font-semibold text-sm" style={{ color: "#0056d2" }}>
        <Icon icon="solar:star-bold" className="text-base" />
        آراء الطلاب
      </span>
    </div>

    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
      <span className="text-black dark:text-white">ماذا يقول </span>
      <span className="relative inline-block" style={{ color: "#0056d2" }}>
        طلابنا
        <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
          <path d="M2 10C60 3 140 3 198 10" stroke="#0056d2" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
    </h2>

    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
      اكتشف تجارب طلابنا الحقيقية مع خدماتنا الأكاديمية
    </p>
  </div>
);

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) throw new Error("Failed");
        const data: DBTestimonial[] = await res.json();
        setReviews(
          Array.isArray(data)
            ? data.map((t) => ({
              name: t.clientName,
              username: `@${t.clientName.toLowerCase().replace(/\s+/g, "_")}`,
              body: t.content,
              img: LogoImage.src,
              rating: t.rating ?? 5,
            }))
            : []
        );
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <section dir="rtl" className="py-16 bg-gradient-to-b from-white dark:from-gray-900 via-blue-50/20 dark:via-gray-900 to-white dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SectionHeader />
          <div className="flex justify-center py-12" style={{ color: "#0056d2" }}>
            جاري التحميل...
          </div>
        </div>
      </section>
    );
  }

  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <>

      <section dir="rtl" className="py-16 bg-gradient-to-b from-white dark:from-gray-900 via-blue-50/20 dark:via-gray-900 to-white dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <AnimatedContent distance={22} duration={0.7}>
            <SectionHeader />
          </AnimatedContent>

          {reviews.length > 0 ? (
            <AnimatedContent distance={18} duration={0.65} delay={0.06}>
              <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
                <Marquee pauseOnHover className="[--duration:28s]">
                  {firstRow.map((r, i) => (
                    <ReviewCard key={`${r.username}-${i}`} {...r} />
                  ))}
                </Marquee>

                {secondRow.length > 0 && (
                  <Marquee reverse pauseOnHover className="[--duration:22s]">
                    {secondRow.map((r, i) => (
                      <ReviewCard key={`${r.username}-${i}`} {...r} />
                    ))}
                  </Marquee>
                )}

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900" />
              </div>
            </AnimatedContent>
          ) : (
            <div className="flex justify-center items-center py-12 text-gray-500 dark:text-gray-400">
              لا توجد آراء متاحة حالياً
            </div>
          )}
        </div>
      </section>
    </>
  );
}