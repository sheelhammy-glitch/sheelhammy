import React from 'react'
import type { Metadata } from 'next'
import { ContactHero } from './_components/contact-hero'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { ContactForm } from './_components/contact-form';
import AnimatedContent from '@/components/animated-content'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "تواصل معنا - شيل همّي",
    description: "تواصل مع فريق شيل همّي للخدمات الأكاديمية بسهولة عبر واتساب أو نموذج التواصل، واحصل على استشارة سريعة ودعم احترافي لجميع التخصصات في الوطن العربي.",
    keywords: [
      "تواصل معنا",
      "تواصل مع فريق أكاديمي",
      "استفسار أكاديمي",
      "طلب خدمة أكاديمية",
      "نموذج تواصل",
      "احجز خدمة الآن",
      "اطلب أسايمنت",
      "استشارة أكاديمية",
      "دعم طلابي سريع",
      "خدمات أكاديمية",
      "مساعدة طلاب",
      "منصة شيل همّي",
      "دعم أكاديمي أونلاين"
    ],
    url: "/contact-us",
  });
}

export default function ContactPage() {
  return (
    <main>
      <AnimatedContent distance={22} duration={0.7}>
        <ContactHero />
      </AnimatedContent>
      <AnimatedContent distance={18} duration={0.65} delay={0.06}>
        <ContactForm />
      </AnimatedContent>
    </main>
  )
}
