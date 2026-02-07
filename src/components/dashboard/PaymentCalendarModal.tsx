import { X } from 'lucide-react'
import { PaymentCalendar } from './PaymentCalendar'

type PaymentCalendarItem = {
  date: Date | string
  amount: number
  type: 'credit_card' | 'loan' | 'recurring_bill'
}

type PaymentCalendarModalProps = {
  isOpen: boolean
  onClose: () => void
  payments: PaymentCalendarItem[]
}

export function PaymentCalendarModal({
  isOpen,
  onClose,
  payments,
}: PaymentCalendarModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white p-6 shadow-2xl shadow-emerald-900/20 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Calendar
            </p>
            <h2 className="text-2xl font-black text-gray-900">Upcoming Payments</h2>
            <p className="mt-1 text-sm text-gray-500">
              Totals per day with payment counts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
            aria-label="Close calendar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <PaymentCalendar
          payments={payments}
          className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm"
        />
      </div>
    </div>
  )
}
