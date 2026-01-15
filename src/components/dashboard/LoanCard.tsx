import { Loan as LoanType, PaymentStatus } from '@/types/payment'
import { Home, Car, GraduationCap, DollarSign, Calendar, Zap } from 'lucide-react'

interface LoanCardProps {
  loan: LoanType
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

function getLoanIcon(type: LoanType['type']) {
  switch (type) {
    case 'auto':
      return Car
    case 'home':
      return Home
    case 'student':
      return GraduationCap
    case 'personal':
      return DollarSign
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function LoanCard({ loan }: LoanCardProps) {
  const Icon = getLoanIcon(loan.type)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{loan.name}</div>
            <div className="text-sm text-gray-500">{loan.lender}</div>
          </div>
        </div>
        <span className={getStatusBadge(loan.status)}>
          {getStatusText(loan.status)}
        </span>
      </div>

      {/* Monthly Payment */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
        <div className="text-3xl font-bold text-gray-900">
          ${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Remaining Balance & Interest */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Remaining</div>
          <div className="text-lg font-semibold text-gray-900">
            ${(loan.remainingBalance / 1000).toFixed(1)}k
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Interest Rate</div>
          <div className="text-lg font-semibold text-gray-900">
            {loan.interestRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Due {formatDate(loan.dueDate)}</span>
        </div>
        {loan.autoPay && (
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
            <Zap size={14} />
            <span>Auto-pay</span>
          </div>
        )}
      </div>
    </div>
  )
}
