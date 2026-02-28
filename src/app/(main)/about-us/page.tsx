import React from 'react'
import { AboutHero } from './_components/about-hero'
import { OurStory } from './_components/our-story'
import { OurValues } from './_components/our-values'
import { Stats } from './_components/stats' 
import { FAQSection } from '@/app/(home)/_components/faq'
import { About } from './_components/about'

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <About />
      <OurStory />
      <OurValues />
      <Stats /> 
      <FAQSection />

    </main>
  )
}
