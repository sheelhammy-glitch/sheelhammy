import React from 'react'
import { HeroSection } from './_components/hero'
import { Stats } from './_components/stats'
import { AboutSection } from './_components/about'
import { WhyUsSection } from './_components/why-us'
import { ServicesSection } from './_components/services'
import { ProcessSection } from './_components/process'
import { FAQSection } from './_components/faq'
import { ScopeSection } from './_components/scope'
import { TestimonialsSection } from './_components/testimonials'
import Benfits from './_components/benfits'

export default function page() {
  return (
    <main>
      <HeroSection />
      <Benfits />
      <AboutSection />
      <Stats />
      <WhyUsSection />
      <ServicesSection />
      <ProcessSection />
      <ScopeSection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  )
}
