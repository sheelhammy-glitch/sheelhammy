"use client";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { Marquee } from "@/components/ui/marquee";
import LogoImage from "@/assets/logo.svg";

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
  ["#667eea", "#764ba2"],
  ["#0056d2", "#0891b2"],
  // بدل الأخضر: صار أزرق 0056d2
  ["#0056d2", "#60a5fa"],
  ["#ee0979", "#ff6a00"],
  ["#4776e6", "#8e54e9"],
  ["#1a1a2e", "#16213e"],
];

function getGrad(name: string) {
  const s = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[s % GRADIENTS.length];
}
function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ══ الكارد الاحترافي ══ */
function ReviewCard({ name, body, rating = 5 }: ReviewItem) {
  const [g1, g2] = getGrad(name);
  return (
    <div className="trc">
      {/* خلفية gradient خفيفة */}
      <div className="trc-glow" style={{ background: `linear-gradient(135deg, ${g1}18, ${g2}10)` }} />

      {/* هيدر */}
      <div className="trc-header">
        {/* avatar */}
        <div className="trc-av" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
          {getInitials(name)}
        </div>

        <div className="trc-meta">
          <span className="trc-name">{name}</span>
          <span className="trc-role">طالب أكاديمي</span>
        </div>

        {/* نجوم */}
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

      {/* فاصل */}
      <div className="trc-line" style={{ background: `linear-gradient(to right, ${g1}40, ${g2}40, transparent)` }} />

      {/* النص */}
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
      <style jsx global>{`
        /* ═══ CARD ═══ */
        .trc {
          position: relative;
          width: 272px; /* أصغر */
          flex-shrink: 0;
          margin: 0 8px;
          border-radius: 18px;
          border: 1px solid rgba(0, 0, 0, 0.07);
          background: #ffffff;
          padding: 18px 18px 14px; /* أصغر */
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 2px 4px rgba(0, 0, 0, 0.04),
            0 8px 20px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }
        .trc:hover {
          transform: translateY(-2px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 4px 10px rgba(0, 0, 0, 0.06),
            0 14px 30px rgba(0, 0, 0, 0.09);
        }
        .trc-glow {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          opacity: 0.5;
          pointer-events: none;
        }

        /* header */
        .trc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          position: relative;
        }
        .trc-av {
          width: 38px; /* أصغر */
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
          letter-spacing: 0.5px;
        }
        .trc-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .trc-name {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .trc-role {
          font-size: 10.5px;
          color: #94a3b8;
          font-weight: 500;
        }
        .trc-stars {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }

        /* فاصل */
        .trc-line {
          height: 1px;
          border-radius: 1px;
          margin-bottom: 12px;
          position: relative;
        }

        /* body */
        .trc-body {
          position: relative;
          margin-bottom: 12px;
        }
        .trc-qicon {
          width: 20px;
          height: 20px;
          margin-bottom: 7px;
          display: block;
          opacity: 0.7;
        }
        .trc-text {
          font-size: 12.5px; /* أصغر */
          color: #475569;
          line-height: 1.75;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 400;
        }

        /* footer */
        .trc-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end; /* لأنه ما عاد في نص */
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          position: relative;
        }
        .trc-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>

      <section dir="rtl" className="py-16 bg-gradient-to-b from-white dark:from-gray-900 via-blue-50/20 dark:via-gray-900 to-white dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SectionHeader />

          {reviews.length > 0 ? (
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

              {/* إذا بدك تشيل الفيد نهائياً احذف السطرين الجايين */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900" />
            </div>
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