import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  Receipt,
  Plus,
  X,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({ component: Dashboard })

// Types
interface CreditCardItem {
  id: string
  name: string
  amount: number
  dueDate: string
  status: 'paid' | 'due-soon' | 'overdue'
  recurring: boolean
}

interface LoanItem {
  id: string
  name: string
  amount: number
  dueDate: string
  status: 'paid' | 'due-soon' | 'overdue'
  recurring: boolean
}

interface BillItem {
  id: string
  name: string
  amount: number
  dueDate: string
  status: 'paid' | 'due-soon' | 'overdue'
  recurring: boolean
}

type PaymentType = 'credit-card' | 'loan' | 'bill'

interface FormData {
  type: PaymentType
  name: string
  amount: string
  dueDate: string
  recurring: boolean
}

// Dummy Data
const initialCreditCards: CreditCardItem[] = [
  {
    id: '1',
    name: 'Chase Sapphire Reserve',
    amount: 2450.0,
    dueDate: '2024-01-25',
    status: 'due-soon',
    recurring: true,
  },
  {
    id: '2',
    name: 'American Express Gold',
    amount: 890.5,
    dueDate: '2024-01-15',
    status: 'paid',
    recurring: true,
  },
  {
    id: '3',
    name: 'Discover It Cash Back',
    amount: 1205.75,
    dueDate: '2024-01-10',
    status: 'overdue',
    recurring: true,
  },
]

const initialLoans: LoanItem[] = [
  {
    id: '1',
    name: 'Student Loan - Federal',
    amount: 450.0,
    dueDate: '2024-01-20',
    status: 'due-soon',
    recurring: true,
  },
  {
    id: '2',
    name: 'Car Loan - Toyota',
    amount: 385.0,
    dueDate: '2024-01-12',
    status: 'paid',
    recurring: true,
  },
  {
    id: '3',
    name: 'Personal Loan',
    amount: 225.5,
    dueDate: '2024-01-28',
    status: 'due-soon',
    recurring: true,
  },
]

const initialBills: BillItem[] = [
  {
    id: '1',
    name: 'Electric Bill - PG&E',
    amount: 145.0,
    dueDate: '2024-01-18',
    status: 'due-soon',
    recurring: true,
  },
  {
    id: '2',
    name: 'Internet - Comcast',
    amount: 89.99,
    dueDate: '2024-01-05',
    status: 'overdue',
    recurring: true,
  },
  {
    id: '3',
    name: 'Netflix Subscription',
    amount: 15.99,
    dueDate: '2024-01-14',
    status: 'paid',
    recurring: true,
  },
]

// Status Badge Component
function StatusBadge({ status }: { status: 'paid' | 'due-soon' | 'overdue' }) {
  const statusConfig = {
    paid: {
      icon: CheckCircle,
      text: 'Paid',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600',
    },
    'due-soon': {
      icon: Clock,
      text: 'Due Soon',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
    },
    overdue: {
      icon: AlertCircle,
      text: 'Overdue',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      {config.text}
    </span>
  )
}

// Payment Card Component
interface PaymentCardProps {
  icon: React.ComponentType<{ className?: string }>
  iconGradient: string
  name: string
  amount: number
  dueDate: string
  status: 'paid' | 'due-soon' | 'overdue'
}

function PaymentCard({
  icon: Icon,
  iconGradient,
  name,
  amount,
  dueDate,
  status,
}: PaymentCardProps) {
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-emerald-200 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <StatusBadge status={status} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{name}</h3>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-black text-gray-900">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Due: {formattedDate}</span>
      </div>
    </div>
  )
}

// Add Payment Modal Component
interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FormData) => void
}

function AddPaymentModal({ isOpen, onClose, onSave }: AddPaymentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    type: 'credit-card',
    name: '',
    amount: '',
    dueDate: '',
    recurring: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.amount && formData.dueDate) {
      onSave(formData)
      setFormData({
        type: 'credit-card',
        name: '',
        amount: '',
        dueDate: '',
        recurring: false,
      })
      onClose()
    }
  }

  const handleCancel = () => {
    setFormData({
      type: 'credit-card',
      name: '',
      amount: '',
      dueDate: '',
      recurring: false,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Add New Payment</h2>
            <button
              onClick={handleCancel}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Type Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Payment Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'credit-card' })}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'credit-card'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard
                  className={`w-6 h-6 mx-auto mb-2 ${
                    formData.type === 'credit-card' ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    formData.type === 'credit-card' ? 'text-emerald-700' : 'text-gray-600'
                  }`}
                >
                  Credit Card
                </span>
                {formData.type === 'credit-card' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'loan' })}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'loan'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <DollarSign
                  className={`w-6 h-6 mx-auto mb-2 ${
                    formData.type === 'loan' ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    formData.type === 'loan' ? 'text-emerald-700' : 'text-gray-600'
                  }`}
                >
                  Loan
                </span>
                {formData.type === 'loan' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'bill' })}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'bill'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Receipt
                  className={`w-6 h-6 mx-auto mb-2 ${
                    formData.type === 'bill' ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    formData.type === 'bill' ? 'text-emerald-700' : 'text-gray-600'
                  }`}
                >
                  Bill
                </span>
                {formData.type === 'bill' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
              Name / Description
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Chase Credit Card, Electric Bill"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-gray-900"
              required
            />
          </div>

          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-bold text-gray-900 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                $
              </span>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-gray-900"
                required
              />
            </div>
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-bold text-gray-900 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-gray-900"
              required
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <label htmlFor="recurring" className="block text-sm font-bold text-gray-900">
                Monthly Recurring
              </label>
              <p className="text-xs text-gray-600 mt-1">
                This payment repeats every month
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, recurring: !formData.recurring })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                formData.recurring ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={formData.recurring}
              id="recurring"
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  formData.recurring ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
            >
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Dashboard Component
function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [creditCards, setCreditCards] = useState<CreditCardItem[]>(initialCreditCards)
  const [loans, setLoans] = useState<LoanItem[]>(initialLoans)
  const [bills, setBills] = useState<BillItem[]>(initialBills)

  const handleSavePayment = (data: FormData) => {
    const newPayment = {
      id: Date.now().toString(),
      name: data.name,
      amount: parseFloat(data.amount),
      dueDate: data.dueDate,
      status: 'due-soon' as const,
      recurring: data.recurring,
    }

    if (data.type === 'credit-card') {
      setCreditCards([...creditCards, newPayment])
    } else if (data.type === 'loan') {
      setLoans([...loans, newPayment])
    } else {
      setBills([...bills, newPayment])
    }
  }

  // Calculate totals
  const totalCreditCardAmount = creditCards.reduce((sum, card) => sum + card.amount, 0)
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalBillAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const grandTotal = totalCreditCardAmount + totalLoanAmount + totalBillAmount

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4">
              Payment Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track and manage all your credit cards, loans, and bills in one place
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Overview */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">
                  Total Due
                </h3>
              </div>
              <p className="text-4xl font-black mb-1">
                ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm opacity-80">Across all payments</p>
            </div>

            {/* Credit Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Credit Cards
                </h3>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                ${totalCreditCardAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600">{creditCards.length} cards</p>
            </div>

            {/* Loans */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Loans
                </h3>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                ${totalLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600">{loans.length} loans</p>
            </div>

            {/* Bills */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Bills
                </h3>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                ${totalBillAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600">{bills.length} bills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Credit Cards Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Credit Cards</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditCards.map((card) => (
                <PaymentCard
                  key={card.id}
                  icon={CreditCard}
                  iconGradient="from-emerald-500 to-teal-500"
                  name={card.name}
                  amount={card.amount}
                  dueDate={card.dueDate}
                  status={card.status}
                />
              ))}
            </div>
          </div>

          {/* Loans Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Loans</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan) => (
                <PaymentCard
                  key={loan.id}
                  icon={DollarSign}
                  iconGradient="from-teal-500 to-cyan-500"
                  name={loan.name}
                  amount={loan.amount}
                  dueDate={loan.dueDate}
                  status={loan.status}
                />
              ))}
            </div>
          </div>

          {/* Bills Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Bills</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bills.map((bill) => (
                <PaymentCard
                  key={bill.id}
                  icon={Receipt}
                  iconGradient="from-cyan-500 to-sky-500"
                  name={bill.name}
                  amount={bill.amount}
                  dueDate={bill.dueDate}
                  status={bill.status}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePayment}
      />
    </div>
  )
}
