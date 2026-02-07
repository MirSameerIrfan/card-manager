import type { ComponentType, ReactNode } from 'react'

type PaymentsSectionProps = {
  title: string
  count: number
  icon: ComponentType<{ className?: string }>
  iconClassName: string
  children: ReactNode
}

export function PaymentsSection({
  title,
  count,
  icon: Icon,
  iconClassName,
  children,
}: PaymentsSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClassName}`}>
            <Icon className="h-5 w-5" />
          </span>
          {title}
          <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {count}
          </span>
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  )
}
