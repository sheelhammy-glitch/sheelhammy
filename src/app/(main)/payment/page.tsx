import React from 'react'
import type { Metadata } from 'next'
import { PaymentHero } from './_components/payment-hero'
import { PaymentMethods } from './_components/payment-methods'
import { PaymentInfo } from './_components/payment-info'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import AnimatedContent from '@/components/animated-content'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "طرق الدفع - شيل همّي",
    description: "تعرف على طرق الدفع المتاحة في شيل همّي، نوفر وسائل دفع آمنة وسريعة لتحويل رسوم الخدمات الأكاديمية مع تأكيد فوري وسرية تامة في جميع العمليات.",
    keywords: [
      "طرق الدفع",
      "وسائل دفع آمنة",
      "الدفع للخدمات الأكاديمية",
      "تحويل رسوم خدمة",
      "دفع أونلاين",
      "دفع آمن",
      "حماية البيانات المالية",
      "تأكيد الدفع",
      "سرية العمليات المالية",
      "خدمات أكاديمية",
      "منصة خدمات طلابية",
      "طلب خدمة أكاديمية",
      "دعم طلاب أونلاين"
    ],
    url: "/payment",
  });
}

export default function PaymentPage() {
  return (
    <main>
      <AnimatedContent distance={22} duration={0.7}>
        <PaymentHero />
      </AnimatedContent>
      <AnimatedContent distance={18} duration={0.65} delay={0.06}>
        <PaymentMethods />
      </AnimatedContent>
      <AnimatedContent distance={18} duration={0.65} delay={0.12}>
        <PaymentInfo />
      </AnimatedContent>

    </main>
  )
}
