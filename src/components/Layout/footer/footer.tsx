"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

import logo from "@/assets/logo.svg";
import arabbank from "@/assets/Arabbank.png";
import cliq from "@/assets/cliq.png";
import moneygram from "@/assets/moneygram.png";
import uwallet from "@/assets/Uwallet.png";
import westrn from "@/assets/Westrn.png";
import zaincash from "@/assets/Zainchah.png";

const BRAND = "#0056D2";
const WHATSAPP_NUMBER = "962781858647";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

// ضع روابطك الفعلية هون
const socialLinks = [
  { label: "فيسبوك", icon: "simple-icons:facebook", href: "https://www.facebook.com/sheelhammy" },
  { label: "إنستغرام", icon: "simple-icons:instagram", href: "https://www.instagram.com/sheelhammy" },
  { label: "واتساب", icon: "simple-icons:whatsapp", href: WHATSAPP_LINK },
  { label: "X", icon: "simple-icons:x", href: "https://x.com/sheelhammy" },
] as const;

const footerLinks = {
  contact: [
    {
      name: "info@sheelhammy.com",
      href: "mailto:info@sheelhammy.com",
      icon: "solar:letter-bold",
    },
    {
      name: (
        <span dir="ltr" className="inline-block">
          +962 7 8185 8647
        </span>
      ),
      href: "tel:+962781858647",
      icon: "solar:phone-calling-bold",
    },
    {
      name: "دعم أونلاين — جميع الدول",
      href: "#",
      icon: "solar:global-bold",
    },
  ],
  company: [
{ name: "المدونة العلمية", href: "/blog" },
    { name: "من نحن", href: "/about-us" },
    { name: "نماذج الأعمال", href: "/samples" },
    { name: "طرق الدفع", href: "/payment" },
    { name: "تواصل معنا", href: "/contact-us" },

  ],
  policies: [
    { name: "شروط الاستخدام", href: "/terms-of-service" },
    { name: "سياسة الخصوصية", href: "/privacy-policy" },
    { name: "سياسة الاسترجاع", href: "/refund-policy" },
    { name: "سياسة الدفع", href: "/payment-policy" },
  ],
};

const paymentMethods = [
  { name: "Arab Bank", image: arabbank },
  { name: "CliQ", image: cliq },
  { name: "MoneyGram", image: moneygram },
  { name: "U-Wallet", image: uwallet },
  { name: "Western Union", image: westrn },
  { name: "Zain Cash", image: zaincash },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-white font-bold text-base md:text-lg mb-4 tracking-tight">
      {children}
    </h4>
  );
}

function FooterItem({
  href,
  icon,
  children,
  external,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-3 text-white/70 hover:text-white transition"
    >
      <Icon
        icon={icon}
        className="w-5 h-5 mt-0.5 text-white/50 group-hover:text-[#0056D2] transition"
      />
      <span className="leading-relaxed text-sm md:text-base">{children}</span>
    </a>
  );
}

export function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative bg-gray-950 text-white border-t border-white/10"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[#0056D2]/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src={logo} alt="شيل همي" width={44} height={44} />
              <span className="text-xl font-extrabold">
                شيل <span style={{ color: BRAND }}>همي</span>
              </span>
            </Link>

            <p className="mt-4 text-white/70 text-sm md:text-base leading-relaxed max-w-md">
              شيل همي منصة خدمات أكاديمية وطلابية متخصصة في دعم طلاب الجامعات في إعداد الأبحاث، التقارير، والمشاريع باحترافية عالية. نلتزم بالجودة، السرية التامة، وتسليم الأعمال في الوقت المحدد لخدمة الطلاب في مختلف الدول العربية والعالم.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition"
                >
                  <Icon
                    icon={s.icon}
                    className="w-5 h-5 text-white/80"
                  />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <SectionTitle>تواصل معنا</SectionTitle>
            <div className="space-y-4">
              {footerLinks.contact.map((item) => (
                <FooterItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  external={item.href.startsWith("http")}
                >
                  {item.name}
                </FooterItem>
              ))}
            </div>
          </div>


          <div className="lg:col-span-2">
            <SectionTitle>روابط سريعة</SectionTitle>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm md:text-base transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <SectionTitle>السياسات</SectionTitle>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm md:text-base transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <p className="text-white/50 text-sm md:text-base">
            © {new Date().getFullYear()} شيل همي — جميع الحقوق محفوظة
          </p>


          <div className="flex flex-wrap gap-3 justify-center">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                title={method.name}
                className="h-10 w-16 rounded-xl p-2 flex items-center justify-center
                           border border-white/10 bg-white/5 backdrop-blur
                           hover:bg-white/10 hover:border-white/20 transition"
              >
                <Image
                  src={method.image}
                  alt={method.name}
                  width={56}
                  height={28}
                  className="object-contain opacity-90"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}