import { createFileRoute } from '@tanstack/react-router'
import { 
  CreditCard, 
  Building2, 
  Receipt, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Zap,
  Calendar,
  DollarSign
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard
})

// Type definitions
interface PaymentItem {
  id: string
  name: string
  account: string
  amount: number
  dueDate: string
  status: 'due-soon' | 'overdue' | 'paid' | 'autopay'
  statusText: string
  icon: typeof CreditCard
  iconColor: string
}

// Dummy data
const creditCards: PaymentItem[] = [
  {
    id: 'cc-1',
    name: 'Chase Sapphire',
    account: '••••4589',
    amount: 1247.50,
    dueDate: 'Jan 15, 2026',
    status: 'due-soon',
    statusText: 'Due in 3 days',
    icon: CreditCard,
    iconColor: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'cc-2',
    name: 'AmEx Platinum',
    account: '••••1234',
    amount: 2850.00,
    dueDate: 'Jan 20, 2026',
    status: 'due-soon',
    statusText: 'Due in 8 days',
    icon: CreditCard,
    iconColor: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'cc-3',
    name: 'Capital One',
    account: '••••7890',
    amount: 520.00,
    dueDate: 'Jan 10, 2026',
    status: 'paid',
    statusText: 'Paid',
    icon: CreditCard,
    iconColor: 'from-cyan-500 to-sky-500'
  }
]

const loans: PaymentItem[] = [
  {
    id: 'loan-1',
    name: 'Car Loan',
    account: 'Honda Finance',
    amount: 485.00,
    dueDate: 'Jan 20, 2026',
    status: 'autopay',
    statusText: 'Auto-pay On',
    icon: Building2,
    iconColor: 'from-sky-500 to-blue-500'
  },
  {
    id: 'loan-2',
    name: 'Student Loan',
    account: 'Sallie Mae',
    amount: 350.00,
    dueDate: 'Jan 25, 2026',
    status: 'due-soon',
    statusText: 'Due in 10 days',
    icon: Building2,
    iconColor: 'from-blue-500 to-indigo-500'
  }
]

const bills: PaymentItem[] = [
  {
    id: 'bill-1',
    name: 'Internet',
    account: 'Comcast',
    amount: 89.99,
    dueDate: 'Jan 18, 2026',
    status: 'due-soon',
    statusText: 'Due in 6 days',
    icon: Receipt,
    iconColor: 'from-indigo-500 to-violet-500'
  },
  {
    id: 'bill-2',
    name: 'Electric',
    account: 'PG&E',
    amount: 125.50,
    dueDate: 'Jan 12, 2026',
    status: 'overdue',
    statusText: 'Overdue',
    icon: Receipt,
    iconColor: 'from-violet-500 to-purple-500'
  },
  {
    id: 'bill-3',
    name: 'Phone',
    account: 'Verizon',
    amount: 75.00,
    dueDate: 'Jan 8, 2026',
    status: 'paid',
    statusText: 'Paid',
    icon: Receipt,
    iconColor: 'from-purple-500 to-pink-500'
  }
]

function Dashboard() {
  // Calculate summary stats
  const allPayments = [...creditCards, ...loans, ...bills]
  const totalDue = allPayments
    .filter(p => p.status === 'due-soon' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)
  const overdueCount = allPayments.filter(p => p.status === 'overdue').length
  const dueSoonCount = allPayments.filter(p => p.status === 'due-soon').length
  const totalPayments = allPayments.length

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            Payment Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track and manage all your payments in one place
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <SummaryCard
            icon={DollarSign}
            label="Total Due"
            value={`$${totalDue.toFixed(2)}`}
            color="from-emerald-500 to-teal-500"
          />
          <SummaryCard
            icon={AlertCircle}
            label="Overdue"
            value={overdueCount.toString()}
            color="from-red-500 to-rose-500"
            subtitle="payments"
          />
          <SummaryCard
            icon={Clock}
            label="Due Soon"
            value={dueSoonCount.toString()}
            color="from-amber-500 to-orange-500"
            subtitle="payments"
          />
          <SummaryCard
            icon={Calendar}
            label="Total Payments"
            value={totalPayments.toString()}
            color="from-cyan-500 to-sky-500"
            subtitle="tracked"
          />
        </div>

        {/* Add New Payment CTA */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-dashed border-gray-300 hover:border-emerald-500 transition-colors">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Add New Payment
                </h3>
                <p className="text-gray-600">
                  Track a new credit card, loan, or recurring bill
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                  <CreditCard className="w-5 h-5" />
                  Add Card
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                  <Building2 className="w-5 h-5" />
                  Add Loan
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                  <Receipt className="w-5 h-5" />
                  Add Bill
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Cards Section */}
        <Section
          title="Credit Cards"
          icon={CreditCard}
          items={creditCards}
          emptyMessage="No credit cards tracked yet"
        />

        {/* Loans Section */}
        <Section
          title="Loans"
          icon={Building2}
          items={loans}
          emptyMessage="No loans tracked yet"
        />

        {/* Bills Section */}
        <Section
          title="Bills"
          icon={Receipt}
          items={bills}
          emptyMessage="No bills tracked yet"
        />
      </div>
    </div>
  )
}

// Summary Card Component
interface SummaryCardProps {
  icon: typeof DollarSign
  label: string
  value: string
  color: string
  subtitle?: string
}

function SummaryCard({ icon: Icon, label, value, color, subtitle }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-linear-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 truncate">
            {value}
            {subtitle && <span className="text-sm text-gray-500 ml-1">{subtitle}</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

// Section Component
interface SectionProps {
  title: string
  icon: typeof CreditCard
  items: PaymentItem[]
  emptyMessage: string
}

function Section({ title, icon: Icon, items, emptyMessage }: SectionProps) {
  return (
    <section className="mb-8 sm:mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <PaymentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

// Payment Card Component
interface PaymentCardProps {
  item: PaymentItem
}

function PaymentCard({ item }: PaymentCardProps) {
  const Icon = item.icon

  // Status badge styling
  const statusStyles = {
    'due-soon': 'bg-amber-100 text-amber-700',
    'overdue': 'bg-red-100 text-red-500',
    'paid': 'bg-emerald-100 text-emerald-700',
    'autopay': 'bg-emerald-100 text-emerald-700'
  }

  // Status icon
  const StatusIcon = {
    'due-soon': Clock,
    'overdue': AlertCircle,
    'paid': CheckCircle,
    'autopay': Zap
  }[item.status]

  return (
    <div className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-emerald-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 bg-linear-to-br ${item.iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
            <p className="text-sm text-gray-500 truncate">{item.account}</p>
          </div>
        </div>
        <div className={`px-3 py-1 ${statusStyles[item.status]} rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap flex-shrink-0 ml-2`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{item.statusText}</span>
        </div>
      </div>

      {/* Amount and Date */}
      <div className="flex justify-between items-end pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500 mb-1">Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            ${item.amount.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">
            {item.status === 'paid' ? 'Paid On' : 'Due Date'}
          </p>
          <p className="font-semibold text-gray-900">{item.dueDate}</p>
        </div>
      </div>

      {/* Action button (appears on hover) */}
      <button className="w-full mt-4 py-2 bg-gray-50 hover:bg-emerald-50 text-emerald-700 font-semibold rounded-lg transition-all opacity-0 group-hover:opacity-100">
        View Details
      </button>
    </div>
  )
}
