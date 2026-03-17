import React from 'react'
import type { Metadata } from 'next'
import { ServicesHero } from './_components/services-hero'
import { ServicesList } from './_components/services-list'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import AnimatedContent from '@/components/animated-content'

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "خدماتنا - شيل همّي",
    description: "استكشف خدمات شيل همّي الأكاديمية: حل الأسايمنت، إعداد الأبحاث، مشاريع التخرج، التقارير والتدقيق اللغوي لجميع التخصصات في الوطن العربي بجودة عالية.",
    keywords: [
      "خدمات أكاديمية",
      "حل أسايمنت",
      "إعداد أبحاث جامعية",
      "مشاريع تخرج",
      "تقارير جامعية",
      "تدقيق لغوي أكاديمي",
      "إعادة صياغة أكاديمية",
      "اطلب خدمة أكاديمية",
      "أفضل منصة خدمات طلابية",
      "مساعدة جامعية أونلاين",
      "دعم أكاديمي احترافي",
      "خدمات طلابية",
      "كتابة بحث علمي",
      "دعم طلاب الجامعات",
      "منصة أكاديمية عربية"
    ],
    url: "/services",
  });
}

export default function ServicesPage() {
  return (
    <main>
      <AnimatedContent distance={22} duration={0.7}>
        <ServicesHero />
      </AnimatedContent>
      <AnimatedContent distance={18} duration={0.65} delay={0.06}>
        <ServicesList />
      </AnimatedContent>

    </main>
  )
}
