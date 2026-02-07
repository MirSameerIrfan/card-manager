import { CalendarDays, Plus } from 'lucide-react'

type DashboardHeaderProps = {
  greeting: string
  displayName: string
  dueText: string
  onOpenCalendar: () => void
  onAddPayment: () => void
}

export function DashboardHeader({
  greeting,
  displayName,
  dueText,
  onOpenCalendar,
  onAddPayment,
}: DashboardHeaderProps) {
  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Overview</p>
        <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">
          {greeting}, {displayName}
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">{dueText}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onOpenCalendar}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-emerald-200 bg-white px-6 py-3 text-base font-semibold text-emerald-700 shadow-sm transition-all hover:translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
        >
          <CalendarDays className="h-5 w-5" />
          View Calendar
        </button>
        <button
          onClick={onAddPayment}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-emerald-900/15 transition-all hover:translate-y-0.5 hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Add Payment
        </button>
      </div>
    </section>
  )
}
