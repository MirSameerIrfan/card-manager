import { createFileRoute } from '@tanstack/react-router'
import {
  CreditCard,
  Home,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  Plus,
  TrendingUp,
  Zap,
  Wifi,
  Car,
  GraduationCap,
  Wallet,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({ component: Dashboard })

// Type definitions
interface PaymentItem {
  id: string
  name: string
  subtitle: string
  amount: number
  dueDate: string
  status: 'due-soon' | 'auto-pay' | 'overdue' | 'paid'
  icon: React.ElementType
  iconColor: string
}

interface SectionData {
  title: string
  items: PaymentItem[]
  addButtonText: string
  addButtonIcon: React.ElementType
}

// Dummy data for Credit Cards
const creditCardsData: PaymentItem[] = [
  {
    id: 'cc-1',
    name: 'Chase Sapphire',
    subtitle: '••••4589',
    amount: 1247.5,
    dueDate: 'Jan 15, 2026',
    status: 'due-soon',
    icon: CreditCard,
    iconColor: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'cc-2',
    name: 'Amex Gold',
    subtitle: '••••2847',
    amount: 892.35,
    dueDate: 'Jan 20, 2026',
    status: 'auto-pay',
    icon: CreditCard,
    iconColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'cc-3',
    name: 'Capital One Venture',
    subtitle: '••••7123',
    amount: 2156.8,
    dueDate: 'Jan 12, 2026',
    status: 'overdue',
    icon: CreditCard,
    iconColor: 'from-red-500 to-rose-500',
  },
  {
    id: 'cc-4',
    name: 'Discover It',
    subtitle: '••••9456',
    amount: 543.2,
    dueDate: 'Jan 25, 2026',
    status: 'paid',
    icon: CreditCard,
    iconColor: 'from-blue-500 to-cyan-500',
  },
]

// Dummy data for Loans
const loansData: PaymentItem[] = [
  {
    id: 'loan-1',
    name: 'Car Loan',
    subtitle: 'Honda Finance',
    amount: 485.0,
    dueDate: 'Jan 20, 2026',
    status: 'auto-pay',
    icon: Car,
    iconColor: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'loan-2',
    name: 'Student Loan',
    subtitle: 'Federal Stafford',
    amount: 350.0,
    dueDate: 'Jan 18, 2026',
    status: 'due-soon',
    icon: GraduationCap,
    iconColor: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'loan-3',
    name: 'Personal Loan',
    subtitle: 'LendingClub',
    amount: 275.5,
    dueDate: 'Jan 22, 2026',
    status: 'auto-pay',
    icon: Wallet,
    iconColor: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'loan-4',
    name: 'Home Equity',
    subtitle: 'Wells Fargo',
    amount: 825.0,
    dueDate: 'Jan 28, 2026',
    status: 'paid',
    icon: Home,
    iconColor: 'from-sky-500 to-blue-500',
  },
]

// Dummy data for Bills
const billsData: PaymentItem[] = [
  {
    id: 'bill-1',
    name: 'Netflix',
    subtitle: 'Premium Plan',
    amount: 22.99,
    dueDate: 'Jan 14, 2026',
    status: 'auto-pay',
    icon: FileText,
    iconColor: 'from-red-500 to-pink-500',
  },
  {
    id: 'bill-2',
    name: 'Electric Bill',
    subtitle: 'City Power & Light',
    amount: 125.45,
    dueDate: 'Jan 16, 2026',
    status: 'due-soon',
    icon: Zap,
    iconColor: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'bill-3',
    name: 'Internet',
    subtitle: 'Xfinity Gigabit',
    amount: 89.99,
    dueDate: 'Jan 10, 2026',
    status: 'overdue',
    icon: Wifi,
    iconColor: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'bill-4',
    name: 'Rent',
    subtitle: 'Apartment 4B',
    amount: 1850.0,
    dueDate: 'Jan 1, 2026',
    status: 'paid',
    icon: Home,
    iconColor: 'from-emerald-500 to-green-500',
  },
]

// Status badge component
function StatusBadge({ status }: { status: PaymentItem['status'] }) {
  const statusConfig = {
    'due-soon': {
      text: 'Due in 3 days',
      className: 'bg-amber-100 text-amber-700',
    },
    'auto-pay': {
      text: 'Auto-pay on',
      className: 'bg-emerald-100 text-emerald-700',
    },
    overdue: {
      text: 'Overdue',
      className: 'bg-red-100 text-red-700',
    },
    paid: {
      text: 'Paid',
      className: 'bg-gray-100 text-gray-700',
    },
  }

  const config = statusConfig[status]

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.text}
    </div>
  )
}

// Payment card component
function PaymentCard({ item }: { item: PaymentItem }) {
  const Icon = item.icon

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-emerald-200">
      {/* Header with icon and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${item.iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.subtitle}</div>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* Amount and due date */}
      <div className="flex justify-between items-end pt-4 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Amount Due
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${item.amount.toFixed(2)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-end">
            <Calendar className="w-3 h-3" />
            Due Date
          </div>
          <div className="font-semibold text-gray-700">{item.dueDate}</div>
        </div>
      </div>
    </div>
  )
}

// Section header component
function SectionHeader({
  title,
  addButtonText,
  Icon,
}: {
  title: string
  addButtonText: string
  Icon: React.ElementType
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
      <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">{addButtonText}</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  )
}

// Dashboard section component
function DashboardSection({ section }: { section: SectionData }) {
  return (
    <section className="mb-16">
      <SectionHeader
        title={section.title}
        addButtonText={section.addButtonText}
        Icon={section.addButtonIcon}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {section.items.map((item) => (
          <PaymentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

// Summary stats component
function SummaryStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm font-medium text-gray-600">Overdue</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">2</div>
        <div className="text-sm text-gray-500 mt-1">$2,245.79 total</div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm font-medium text-gray-600">Due Soon</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">3</div>
        <div className="text-sm text-gray-500 mt-1">Next 7 days</div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm font-medium text-gray-600">Auto-pay</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">5</div>
        <div className="text-sm text-gray-500 mt-1">Active</div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm font-medium text-gray-600">This Month</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">$5,862</div>
        <div className="text-sm text-gray-500 mt-1">Total payments</div>
      </div>
    </div>
  )
}

function Dashboard() {
  const sections: SectionData[] = [
    {
      title: 'Credit Cards',
      items: creditCardsData,
      addButtonText: 'Add New Card',
      addButtonIcon: Plus,
    },
    {
      title: 'Loans',
      items: loansData,
      addButtonText: 'Add New Loan',
      addButtonIcon: Plus,
    },
    {
      title: 'Bills',
      items: billsData,
      addButtonText: 'Add New Bill',
      addButtonIcon: Plus,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your credit cards, loans, and bills in one place
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border-2 border-gray-200 transition-all">
                <Calendar className="w-5 h-5" />
                Calendar View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Summary statistics */}
        <SummaryStats />

        {/* Sections */}
        {sections.map((section, index) => (
          <DashboardSection key={index} section={section} />
        ))}
      </div>
    </div>
  )
}
