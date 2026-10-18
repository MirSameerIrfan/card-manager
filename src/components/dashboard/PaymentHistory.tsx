import { History } from 'lucide-react'
import { formatCurrency, formatDate } from './dashboard-utils'

type PaymentHistoryProps = {
  payments: Array<{
    id: string
    name: string
    amount: number
    dueDate: Date | string
    paidOn: Date | string
  }>
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <section className="space-y-6">
      <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
          <History className="h-5 w-5" />
        </span>
        Recently Paid
      </h2>

      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
        {payments.map((payment) => (
          <li key={payment.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-bold text-gray-900 line-clamp-1">{payment.name}</p>
              <p className="text-sm text-gray-500">
                Paid {formatDate(payment.paidOn)} · due {formatDate(payment.dueDate)}
              </p>
            </div>
            <p className="font-black text-gray-900">{formatCurrency(payment.amount)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
