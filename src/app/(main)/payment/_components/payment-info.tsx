"use client";

import { Icon } from "@iconify/react";

const BRAND = {
  primary: "#0056D2",
  primarySoft: "rgba(0,86,210,0.10)",
  text: "#0f172a",
  subtext: "rgba(15,23,42,0.68)",
  border: "rgba(15,23,42,0.10)",
  cardBg: "rgba(255,255,255,0.85)",
};

const PAYMENT_INFO = [
  {
    icon: "mingcute:safe-shield-2-fill",
    title: "دفع آمن",
    description: "جميع طرق الدفع لدينا آمنة ومشفرة لحماية معلوماتك المالية",
  },
  {
    icon: "mingcute:clock-fill",
    title: "معالجة فورية",
    description: "يتم تأكيد الدفع بسرعة لبدء العمل على طلبك مباشرة",
  },
  {
    icon: "icon-park-outline:return",
    title: "ضمان الاسترجاع",
    description: "نوفر سياسة استرجاع واضحة وفق الشروط المعتمدة لضمان حقوقك",
  },
  {
    icon: "mdi:support",
    title: "دعم 24/7",
    description: "فريق الدعم متاح على مدار الساعة لمساعدتك في أي استفسار",
  },
];

export function PaymentInfo() {
  return (
    <section
      dir="rtl"
      style={{
        position: "relative",
        padding: "70px 24px",
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
      }}
    >
      {/* Subtle top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,86,210,0.25) 50%, transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "1100px",
          margin: "0 auto",
          zIndex: 1,
        }}
      >
        {/* Header: Title only */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "clamp(20px, 3.5vw, 34px)",
              fontWeight: "800",
              margin: 0,
              lineHeight: 1.3,
              color: BRAND.text,
            }}
          >
            لماذا تختار <span style={{ color: BRAND.primary }}>طرق دفعنا</span>
          </h2>
        </div>

        {/* Cards grid (kept بالكامل) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {PAYMENT_INFO.map((info, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                background: BRAND.cardBg,
                border: `1px solid ${BRAND.border}`,
                borderRadius: "18px",
                padding: "24px 18px",
                textAlign: "center",
                transition: "all 0.25s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = "rgba(0,86,210,0.28)";
                el.style.boxShadow = "0 12px 28px rgba(2,6,23,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.borderColor = BRAND.border;
                el.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: BRAND.primarySoft,
                  border: "1px solid rgba(0,86,210,0.20)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Icon
                  icon={info.icon}
                  style={{
                    fontSize: "24px",
                    color: BRAND.primary,
                  }}
                />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  color: BRAND.text,
                  margin: "0 0 8px",
                }}
              >
                {info.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "13px",
                  color: BRAND.subtext,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {info.description}
              </p>

              {/* Number */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "16px",
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "rgba(0,86,210,0.18)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
      `}</style>
    </section>
  );
}
