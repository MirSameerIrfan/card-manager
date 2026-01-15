import { CreditCard, Loan, Bill, PaymentStatus } from '@/types/payment'
import { CreditCard as CreditCardIcon, Car, Home, Zap, Calendar, TrendingUp } from 'lucide-react'

interface ListDashboardProps {
  creditCards: CreditCard[]
  loans: Loan[]
  bills: Bill[]
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

export function ListDashboard({ creditCards, loans, bills }: ListDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Credit Cards List */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Credit Cards</h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Card</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount Due</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creditCards.map((card) => {
                  const utilizationPercent = (card.currentBalance / card.creditLimit) * 100
                  return (
                    <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCardIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{card.name}</div>
                            <div className="text-sm text-gray-500">••••{card.lastFour}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          ${card.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">Min: ${card.minPayment.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          {formatDate(card.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[100px]">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  utilizationPercent > 80
                                    ? 'bg-red-500'
                                    : utilizationPercent > 50
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            {utilizationPercent.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(card.status)}>
                          {getStatusText(card.status)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Loans List */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Loans</h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Loan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Monthly Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Remaining</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{loan.name}</div>
                          <div className="text-sm text-gray-500">{loan.lender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        ${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500">{loan.interestRate.toFixed(2)}% APR</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {formatDate(loan.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        ${(loan.remainingBalance / 1000).toFixed(1)}k
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={getStatusBadge(loan.status)}>
                          {getStatusText(loan.status)}
                        </span>
                        {loan.autoPay && (
                          <span className="text-emerald-600" title="Auto-pay enabled">
                            <Zap size={16} />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bills List */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bills</h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bill</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-sky-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{bill.name}</div>
                          <div className="text-sm text-gray-500">{bill.provider}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {formatDate(bill.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {bill.recurring && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            Recurring
                          </span>
                        )}
                        {bill.autoPay && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                            Auto-pay
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(bill.status)}>
                        {getStatusText(bill.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
