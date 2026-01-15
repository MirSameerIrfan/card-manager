import { CreditCard, Loan, Bill, PaymentStatus } from '@/types/payment'
import { CreditCard as CreditCardIcon, Calendar } from 'lucide-react'

interface TimelineDashboardProps {
  creditCards: CreditCard[]
  loans: Loan[]
  bills: Bill[]
}

type TimelineItem = {
  id: string
  name: string
  type: 'credit-card' | 'loan' | 'bill'
  amount: number
  dueDate: string
  status: PaymentStatus
  details: string
}

function getStatusColor(status: PaymentStatus) {
  switch (status) {
    case 'paid':
      return 'border-emerald-500 bg-emerald-50'
    case 'due-soon':
      return 'border-amber-500 bg-amber-50'
    case 'overdue':
      return 'border-red-500 bg-red-50'
    case 'upcoming':
      return 'border-gray-300 bg-gray-50'
  }
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
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function formatDateShort(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDaysUntilDue(dateString: string) {
  const today = new Date()
  const dueDate = new Date(dateString)
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  return `${diffDays} days`
}

export function TimelineDashboard({ creditCards, loans, bills }: TimelineDashboardProps) {
  // Combine all items into a timeline
  const timelineItems: TimelineItem[] = [
    ...creditCards.map(card => ({
      id: card.id,
      name: card.name,
      type: 'credit-card' as const,
      amount: card.amountDue,
      dueDate: card.dueDate,
      status: card.status,
      details: `••••${card.lastFour}`
    })),
    ...loans.map(loan => ({
      id: loan.id,
      name: loan.name,
      type: 'loan' as const,
      amount: loan.monthlyPayment,
      dueDate: loan.dueDate,
      status: loan.status,
      details: loan.lender
    })),
    ...bills.map(bill => ({
      id: bill.id,
      name: bill.name,
      type: 'bill' as const,
      amount: bill.amount,
      dueDate: bill.dueDate,
      status: bill.status,
      details: bill.provider
    }))
  ]

  // Sort by due date
  const sortedItems = timelineItems.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )

  // Group by month
  const groupedByMonth = sortedItems.reduce((acc, item) => {
    const date = new Date(item.dueDate)
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(item)
    return acc
  }, {} as Record<string, TimelineItem[]>)

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="text-sm text-gray-500 mb-1">Overdue</div>
          <div className="text-3xl font-bold text-gray-900">
            {sortedItems.filter(item => item.status === 'overdue').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
          <div className="text-sm text-gray-500 mb-1">Due Soon</div>
          <div className="text-3xl font-bold text-gray-900">
            {sortedItems.filter(item => item.status === 'due-soon').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-300">
          <div className="text-sm text-gray-500 mb-1">Upcoming</div>
          <div className="text-3xl font-bold text-gray-900">
            {sortedItems.filter(item => item.status === 'upcoming').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
          <div className="text-sm text-gray-500 mb-1">Paid</div>
          <div className="text-3xl font-bold text-gray-900">
            {sortedItems.filter(item => item.status === 'paid').length}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {Object.entries(groupedByMonth).map(([monthYear, items]) => (
        <section key={monthYear}>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">{monthYear}</h2>
            <span className="text-sm text-gray-500">({items.length} payments)</span>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Timeline items */}
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={item.id} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full border-4 ${getStatusColor(item.status)} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-gray-700">
                        {formatDateShort(item.dueDate).split(' ')[0]}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatDateShort(item.dueDate).split(' ')[1]}
                      </div>
                    </div>
                  </div>

                  {/* Item card */}
                  <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.details}</p>
                      </div>
                      <span className={getStatusBadge(item.status)}>
                        {getStatusText(item.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">{item.type.replace('-', ' ')}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">
                          {getDaysUntilDue(item.dueDate)}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(item.dueDate)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
