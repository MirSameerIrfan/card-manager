import { Bill as BillType, PaymentStatus } from '@/types/payment'
import { Zap, Wifi, Phone, Shield, Youtube, Home, Receipt, Calendar } from 'lucide-react'

interface BillCardProps {
  bill: BillType
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

function getBillIcon(type: BillType['type']) {
  switch (type) {
    case 'utilities':
      return Zap
    case 'internet':
      return Wifi
    case 'phone':
      return Phone
    case 'insurance':
      return Shield
    case 'subscription':
      return Youtube
    case 'rent':
      return Home
    case 'other':
      return Receipt
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BillCard({ bill }: BillCardProps) {
  const Icon = getBillIcon(bill.type)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{bill.name}</div>
            <div className="text-sm text-gray-500">{bill.provider}</div>
          </div>
        </div>
        <span className={getStatusBadge(bill.status)}>
          {getStatusText(bill.status)}
        </span>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Amount</div>
        <div className="text-3xl font-bold text-gray-900">
          ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        {bill.recurring && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
            Recurring
          </span>
        )}
        {bill.autoPay && (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium flex items-center gap-1">
            <Zap size={12} />
            Auto-pay
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t border-gray-100">
        <Calendar size={16} />
        <span>Due {formatDate(bill.dueDate)}</span>
      </div>
    </div>
  )
}
