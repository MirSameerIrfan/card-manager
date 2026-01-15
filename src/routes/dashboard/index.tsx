import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  Receipt,
  Plus,
  TrendingUp,
  Calendar,
  Clock,
  Home,
  Car,
  Smartphone,
  Wifi,
  Zap,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

// Types for our payment data
interface CreditCardPayment {
  id: string
  type: 'credit-card'
  cardName: string
  last4: string
  amountDue: number
  dueDate: string
  status: 'due-soon' | 'paid' | 'overdue'
  minimumPayment: number
}

interface Loan {
  id: string
  type: 'loan'
  loanType: string
  lender: string
  monthlyPayment: number
  nextPaymentDate: string
  remainingBalance: number
  autoPay: boolean
}

interface Bill {
  id: string
  type: 'bill'
  serviceName: string
  provider: string
  amount: number
  dueDate: string
  autoPay: boolean
  category: 'utilities' | 'subscription' | 'insurance' | 'other'
}

type Payment = CreditCardPayment | Loan | Bill

// Dummy data
const creditCards: CreditCardPayment[] = [
  {
    id: 'cc1',
    type: 'credit-card',
    cardName: 'Chase Sapphire Reserve',
    last4: '4589',
    amountDue: 1247.50,
    dueDate: '2026-01-18',
    status: 'due-soon',
    minimumPayment: 35.00
  },
  {
    id: 'cc2',
    type: 'credit-card',
    cardName: 'American Express Gold',
    last4: '8765',
    amountDue: 892.30,
    dueDate: '2026-01-25',
    status: 'paid',
    minimumPayment: 25.00
  },
  {
    id: 'cc3',
    type: 'credit-card',
    cardName: 'Discover It',
    last4: '3421',
    amountDue: 456.75,
    dueDate: '2026-01-12',
    status: 'overdue',
    minimumPayment: 25.00
  }
]

const loans: Loan[] = [
  {
    id: 'loan1',
    type: 'loan',
    loanType: 'Auto Loan',
    lender: 'Honda Finance',
    monthlyPayment: 485.00,
    nextPaymentDate: '2026-01-20',
    remainingBalance: 18250.00,
    autoPay: true
  },
  {
    id: 'loan2',
    type: 'loan',
    loanType: 'Mortgage',
    lender: 'Wells Fargo',
    monthlyPayment: 2150.00,
    nextPaymentDate: '2026-02-01',
    remainingBalance: 325000.00,
    autoPay: true
  },
  {
    id: 'loan3',
    type: 'loan',
    loanType: 'Student Loan',
    lender: 'Sallie Mae',
    monthlyPayment: 325.00,
    nextPaymentDate: '2026-01-15',
    remainingBalance: 28500.00,
    autoPay: false
  }
]

const bills: Bill[] = [
  {
    id: 'bill1',
    type: 'bill',
    serviceName: 'Internet',
    provider: 'Comcast Xfinity',
    amount: 89.99,
    dueDate: '2026-01-10',
    autoPay: true,
    category: 'utilities'
  },
  {
    id: 'bill2',
    type: 'bill',
    serviceName: 'Electric',
    provider: 'Pacific Gas & Electric',
    amount: 145.30,
    dueDate: '2026-01-15',
    autoPay: true,
    category: 'utilities'
  },
  {
    id: 'bill3',
    type: 'bill',
    serviceName: 'Phone Plan',
    provider: 'T-Mobile',
    amount: 75.00,
    dueDate: '2026-01-22',
    autoPay: true,
    category: 'utilities'
  },
  {
    id: 'bill4',
    type: 'bill',
    serviceName: 'Netflix Premium',
    provider: 'Netflix',
    amount: 19.99,
    dueDate: '2026-01-08',
    autoPay: true,
    category: 'subscription'
  },
  {
    id: 'bill5',
    type: 'bill',
    serviceName: 'Home Insurance',
    provider: 'State Farm',
    amount: 125.00,
    dueDate: '2026-01-30',
    autoPay: false,
    category: 'insurance'
  }
]

function DashboardPage() {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  
  // Calculate summary statistics
  // NOTE: For MVP with dummy data, using simplified logic
  // In production, would filter by actual due dates within current month
  const totalDueThisMonth = [
    ...creditCards.filter(c => c.status !== 'paid').map(c => c.amountDue),
    ...loans.map(l => l.monthlyPayment),
    ...bills.map(b => b.amount)
  ].reduce((sum, amount) => sum + amount, 0)
  
  // Count payments that require attention (not on auto-pay or due soon)
  const upcomingPaymentsCount = [
    ...creditCards.filter(c => c.status === 'due-soon'),
    ...loans.filter(l => !l.autoPay),
    ...bills.filter(b => !b.autoPay)
  ].length
  
  const autoPayCount = [
    ...loans.filter(l => l.autoPay),
    ...bills.filter(b => b.autoPay)
  ].length

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage all your payments in one place
              </p>
            </div>
            
            {/* Add Payment Button */}
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Payment
            </button>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">Total Due This Month</span>
              </div>
              <div className="text-3xl font-bold">
                ${totalDueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">Upcoming Payments</span>
              </div>
              <div className="text-3xl font-bold">{upcomingPaymentsCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500 to-sky-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">Auto-Pay Active</span>
              </div>
              <div className="text-3xl font-bold">{autoPayCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Credit Cards Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Credit Cards</h2>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
              {creditCards.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map(card => (
              <CreditCardCard key={card.id} card={card} />
            ))}
          </div>
        </section>

        {/* Loans Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Loans</h2>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
              {loans.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map(loan => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </section>

        {/* Bills Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recurring Bills</h2>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
              {bills.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bills.map(bill => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </section>
      </div>

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <AddPaymentModal onClose={() => setShowAddPaymentModal(false)} />
      )}
    </div>
  )
}

// Credit Card Component
function CreditCardCard({ card }: { card: CreditCardPayment }) {
  const statusConfig = {
    'due-soon': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Due Soon' },
    'paid': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid' },
    'overdue': { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' }
  }
  
  const status = statusConfig[card.status]
  const dueDate = new Date(card.dueDate)
  const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{card.cardName}</div>
            <div className="text-sm text-gray-500">••••{card.last4}</div>
          </div>
        </div>
        <div className={`px-3 py-1 ${status.bg} ${status.text} rounded-full text-xs font-medium`}>
          {status.label}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm text-gray-500">Amount Due</div>
            <div className="text-2xl font-bold text-gray-900">
              ${card.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Due Date</div>
            <div className="font-semibold text-gray-900">{formattedDate}</div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Minimum payment: ${card.minimumPayment.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

// Loan Component
function LoanCard({ loan }: { loan: Loan }) {
  const dueDate = new Date(loan.nextPaymentDate)
  const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  const getLoanIcon = () => {
    if (loan.loanType.toLowerCase().includes('auto') || loan.loanType.toLowerCase().includes('car')) {
      return Car
    } else if (loan.loanType.toLowerCase().includes('mortgage') || loan.loanType.toLowerCase().includes('home')) {
      return Home
    } else {
      return DollarSign
    }
  }
  
  const Icon = getLoanIcon()
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-teal-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{loan.loanType}</div>
            <div className="text-sm text-gray-500">{loan.lender}</div>
          </div>
        </div>
        {loan.autoPay && (
          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            Auto-pay on
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm text-gray-500">Monthly Payment</div>
            <div className="text-2xl font-bold text-gray-900">
              ${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Next Payment</div>
            <div className="font-semibold text-gray-900">{formattedDate}</div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Remaining balance: ${loan.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Bill Component
function BillCard({ bill }: { bill: Bill }) {
  const dueDate = new Date(bill.dueDate)
  const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  
  const getBillIcon = () => {
    if (bill.serviceName.toLowerCase().includes('internet') || bill.serviceName.toLowerCase().includes('wifi')) {
      return Wifi
    } else if (bill.serviceName.toLowerCase().includes('electric') || bill.serviceName.toLowerCase().includes('power')) {
      return Zap
    } else if (bill.serviceName.toLowerCase().includes('phone') || bill.serviceName.toLowerCase().includes('mobile')) {
      return Smartphone
    } else {
      return Receipt
    }
  }
  
  const Icon = getBillIcon()
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-cyan-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{bill.serviceName}</div>
            <div className="text-sm text-gray-500">{bill.provider}</div>
          </div>
        </div>
        {bill.autoPay && (
          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            Auto-pay on
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm text-gray-500">Amount</div>
            <div className="text-2xl font-bold text-gray-900">
              ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Due Date</div>
            <div className="font-semibold text-gray-900">{formattedDate}</div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 capitalize">
            Category: {bill.category}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add Payment Modal Component
function AddPaymentModal({ onClose }: { onClose: () => void }) {
  const paymentTypes = [
    {
      type: 'credit-card',
      icon: CreditCard,
      title: 'Credit Card',
      description: 'Add a new credit card payment',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      type: 'loan',
      icon: TrendingUp,
      title: 'Loan',
      description: 'Add a mortgage, auto, or student loan',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      type: 'bill',
      icon: Receipt,
      title: 'Recurring Bill',
      description: 'Add utilities, subscriptions, or other bills',
      color: 'from-cyan-500 to-sky-500'
    }
  ]
  
  const handleSelectType = (type: string) => {
    // TODO: Navigate to add payment form for the selected type
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Payment
            </h2>
            <p className="text-gray-600">
              Select the type of payment you want to add
            </p>
          </div>
          
          {/* Payment type options */}
          <div className="grid md:grid-cols-3 gap-4">
            {paymentTypes.map((paymentType) => {
              const Icon = paymentType.icon
              return (
                <button
                  key={paymentType.type}
                  onClick={() => handleSelectType(paymentType.type)}
                  className="group relative bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 text-left"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${paymentType.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {paymentType.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {paymentType.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
