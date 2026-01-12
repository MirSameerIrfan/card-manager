import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Testimonials } from '@/components/landing/Testimonials'
import { CTA } from '@/components/landing/CTA'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  )
}
