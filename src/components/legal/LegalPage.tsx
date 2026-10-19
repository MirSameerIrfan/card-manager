import type { ReactNode } from 'react'
import { Footer } from '@/components/landing/Footer'

type LegalPageProps = {
  title: string
  effectiveDate: string
  children: ReactNode
}

/** Layout for the Privacy Policy and Terms of Service. */
export function LegalPage({ title, effectiveDate, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Effective {effectiveDate}</p>
        <div className="mt-10 space-y-4 leading-relaxed text-gray-700 [&_a]:font-semibold [&_a]:text-emerald-600 [&_a:hover]:text-emerald-700 [&_h2]:pt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_li]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
