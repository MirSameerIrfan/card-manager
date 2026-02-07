import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Testimonials } from '@/components/landing/Testimonials'
import { CTA } from '@/components/landing/CTA'
import { redirectIfAuthenticated } from '@/utils/route-guards'

export const Route = createFileRoute('/')({
  beforeLoad: async () => redirectIfAuthenticated(),
  component: LandingPage,
})

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
