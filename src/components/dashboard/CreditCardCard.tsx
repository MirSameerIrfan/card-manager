import { CreditCard as CreditCardType, PaymentStatus } from '@/types/payment'
import { CreditCard, TrendingUp, Calendar } from 'lucide-react'

interface CreditCardCardProps {
  card: CreditCardType
}

function getStatusBadge(status: PaymentStatus) {
  switch (status) {
    case 'paid':
      return 'px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium'
    case 'due-soon':
      return 'px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium'
    case 'overdue':
      return 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium'
    case 'upcoming':
      return 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium'
  }
}

function getStatusText(status: PaymentStatus) {
  switch (status) {
    case 'paid':
      return 'Paid'
    case 'due-soon':
      return 'Due Soon'
    case 'overdue':
      return 'Overdue'
    case 'upcoming':
      return 'Upcoming'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CreditCardCard({ card }: CreditCardCardProps) {
  const utilizationPercent = (card.currentBalance / card.creditLimit) * 100

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{card.name}</div>
            <div className="text-sm text-gray-500">••••{card.lastFour}</div>
          </div>
        </div>
        <span className={getStatusBadge(card.status)}>
          {getStatusText(card.status)}
        </span>
      </div>

      {/* Amount Due */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Amount Due</div>
        <div className="text-3xl font-bold text-gray-900">
          ${card.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Credit Utilization */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Credit Utilization</span>
          <span className="font-medium text-gray-900">{utilizationPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              utilizationPercent > 80
                ? 'bg-red-500'
                : utilizationPercent > 50
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>${card.currentBalance.toLocaleString()}</span>
          <span>${card.creditLimit.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Due {formatDate(card.dueDate)}</span>
        </div>
        <div className="text-sm text-gray-500">
          Min: ${card.minPayment.toFixed(2)}
        </div>
      </div>
    </div>
  )
}
