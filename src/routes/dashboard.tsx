import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Plus,
  X,
  Clock,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Home as HomeIcon,
  Car,
  GraduationCap,
  Wifi,
  Zap,
  Phone,
  Tv,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

// Types
interface CreditCard {
  id: string
  name: string
  lastFourDigits: string
  amountDue: number
  dueDate: string
  status: 'due-soon' | 'paid' | 'overdue'
}

interface Loan {
  id: string
  type: string
  lender: string
  monthlyPayment: number
  nextPaymentDate: string
  status: 'on-track' | 'due-soon' | 'overdue'
  icon: typeof HomeIcon
}

interface Bill {
  id: string
  name: string
  provider: string
  amount: number
  dueDate: string
  status: 'paid' | 'due-soon' | 'overdue'
  icon: typeof Wifi
}

type ModalType = 'card' | 'loan' | 'bill' | null

// Mock data with localStorage persistence
const getStoredData = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : defaultValue
}

const setStoredData = <T,>(key: string, data: T) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

const defaultCreditCards: CreditCard[] = [
  {
    id: '1',
    name: 'Chase Sapphire',
    lastFourDigits: '4589',
    amountDue: 1247.5,
    dueDate: '2024-02-15',
    status: 'due-soon',
  },
  {
    id: '2',
    name: 'American Express Gold',
    lastFourDigits: '2341',
    amountDue: 892.3,
    dueDate: '2024-02-20',
    status: 'paid',
  },
  {
    id: '3',
    name: 'Capital One Venture',
    lastFourDigits: '7823',
    amountDue: 2145.67,
    dueDate: '2024-02-10',
    status: 'overdue',
  },
]

const defaultLoans: Loan[] = [
  {
    id: '1',
    type: 'Home Mortgage',
    lender: 'Wells Fargo',
    monthlyPayment: 2450.0,
    nextPaymentDate: '2024-02-01',
    status: 'on-track',
    icon: HomeIcon,
  },
  {
    id: '2',
    type: 'Car Loan',
    lender: 'Honda Finance',
    monthlyPayment: 485.0,
    nextPaymentDate: '2024-02-20',
    status: 'on-track',
    icon: Car,
  },
  {
    id: '3',
    type: 'Student Loan',
    lender: 'Sallie Mae',
    monthlyPayment: 320.5,
    nextPaymentDate: '2024-02-12',
    status: 'due-soon',
    icon: GraduationCap,
  },
]

const defaultBills: Bill[] = [
  {
    id: '1',
    name: 'Internet',
    provider: 'Xfinity',
    amount: 89.99,
    dueDate: '2024-02-05',
    status: 'paid',
    icon: Wifi,
  },
  {
    id: '2',
    name: 'Electricity',
    provider: 'PG&E',
    amount: 145.32,
    dueDate: '2024-02-15',
    status: 'due-soon',
    icon: Zap,
  },
  {
    id: '3',
    name: 'Mobile Phone',
    provider: 'Verizon',
    amount: 120.0,
    dueDate: '2024-02-08',
    status: 'overdue',
    icon: Phone,
  },
  {
    id: '4',
    name: 'Streaming Services',
    provider: 'Netflix + Spotify',
    amount: 34.98,
    dueDate: '2024-02-18',
    status: 'paid',
    icon: Tv,
  },
]

function DashboardPage() {
  const [creditCards, setCreditCards] = useState<CreditCard[]>(() =>
    getStoredData('creditCards', defaultCreditCards)
  )
  const [loans, setLoans] = useState<Loan[]>(() =>
    getStoredData('loans', defaultLoans)
  )
  const [bills, setBills] = useState<Bill[]>(() =>
    getStoredData('bills', defaultBills)
  )
  const [modalOpen, setModalOpen] = useState<ModalType>(null)

  // Calculate totals
  const totalDue = creditCards.reduce((sum, card) => sum + card.amountDue, 0)
  const totalMonthlyLoans = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
  const totalMonthlyBills = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const overdueCounts = {
    cards: creditCards.filter((c) => c.status === 'overdue').length,
    loans: loans.filter((l) => l.status === 'overdue').length,
    bills: bills.filter((b) => b.status === 'overdue').length,
  }

  const handleAddItem = (type: ModalType, data: any) => {
    if (type === 'card') {
      const newCard: CreditCard = {
        id: Date.now().toString(),
        ...data,
      }
      const updatedCards = [...creditCards, newCard]
      setCreditCards(updatedCards)
      setStoredData('creditCards', updatedCards)
    } else if (type === 'loan') {
      const newLoan: Loan = {
        id: Date.now().toString(),
        ...data,
      }
      const updatedLoans = [...loans, newLoan]
      setLoans(updatedLoans)
      setStoredData('loans', updatedLoans)
    } else if (type === 'bill') {
      const newBill: Bill = {
        id: Date.now().toString(),
        ...data,
      }
      const updatedBills = [...bills, newBill]
      setBills(updatedBills)
      setStoredData('bills', updatedBills)
    }
    setModalOpen(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-150 h-150 rounded-full bg-emerald-200/20 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-1/3 -left-1/4 w-125 h-125 rounded-full bg-teal-200/20 blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your credit cards, loans, and bills in one place
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              {overdueCounts.cards > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {overdueCounts.cards} overdue
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-1">Credit Cards Due</div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              {overdueCounts.loans > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {overdueCounts.loans} overdue
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-1">Monthly Loan Payments</div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalMonthlyLoans.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              {overdueCounts.bills > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {overdueCounts.bills} overdue
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-1">Monthly Bills</div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalMonthlyBills.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-1">Total Monthly</div>
            <div className="text-3xl font-bold text-gray-900">
              $
              {(totalDue + totalMonthlyLoans + totalMonthlyBills).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {/* Credit Cards Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-emerald-600" />
              Credit Cards
            </h2>
            <button
              onClick={() => setModalOpen('card')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map((card) => (
              <CreditCardItem key={card.id} card={card} />
            ))}
          </div>
        </section>

        {/* Loans Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-teal-600" />
              Loans
            </h2>
            <button
              onClick={() => setModalOpen('loan')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Loan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <LoanItem key={loan.id} loan={loan} />
            ))}
          </div>
        </section>

        {/* Bills Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-7 h-7 text-cyan-600" />
              Recurring Bills
            </h2>
            <button
              onClick={() => setModalOpen('bill')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Bill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bills.map((bill) => (
              <BillItem key={bill.id} bill={bill} />
            ))}
          </div>
        </section>
      </div>

      {/* Modal */}
      {modalOpen && (
        <AddItemModal
          type={modalOpen}
          onClose={() => setModalOpen(null)}
          onSubmit={handleAddItem}
        />
      )}
    </div>
  )
}

// Credit Card Item Component
function CreditCardItem({ card }: { card: CreditCard }) {
  const statusConfig = {
    'due-soon': {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Due Soon',
      icon: Clock,
    },
    paid: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'Paid',
      icon: CheckCircle,
    },
    overdue: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Overdue',
      icon: AlertCircle,
    },
  }

  const config = statusConfig[card.status]
  const StatusIcon = config.icon

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{card.name}</div>
            <div className="text-sm text-gray-500">••••{card.lastFourDigits}</div>
          </div>
        </div>
        <div className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium flex items-center gap-1`}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-gray-500">Amount Due</div>
          <div className="text-2xl font-bold text-gray-900">
            ${card.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 flex items-center gap-1 justify-end">
            <Calendar className="w-4 h-4" />
            Due Date
          </div>
          <div className="font-semibold text-gray-900">
            {new Date(card.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Loan Item Component
function LoanItem({ loan }: { loan: Loan }) {
  const statusConfig = {
    'on-track': {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'On Track',
      icon: CheckCircle,
    },
    'due-soon': {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Due Soon',
      icon: Clock,
    },
    overdue: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Overdue',
      icon: AlertCircle,
    },
  }

  const config = statusConfig[loan.status]
  const StatusIcon = config.icon
  const LoanIcon = loan.icon

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <LoanIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{loan.type}</div>
            <div className="text-sm text-gray-500">{loan.lender}</div>
          </div>
        </div>
        <div className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium flex items-center gap-1`}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-gray-500">Monthly Payment</div>
          <div className="text-2xl font-bold text-gray-900">
            ${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 flex items-center gap-1 justify-end">
            <Calendar className="w-4 h-4" />
            Next Payment
          </div>
          <div className="font-semibold text-gray-900">
            {new Date(loan.nextPaymentDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Bill Item Component
function BillItem({ bill }: { bill: Bill }) {
  const statusConfig = {
    paid: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'Paid',
      icon: CheckCircle,
    },
    'due-soon': {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Due Soon',
      icon: Clock,
    },
    overdue: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Overdue',
      icon: AlertCircle,
    },
  }

  const config = statusConfig[bill.status]
  const StatusIcon = config.icon
  const BillIcon = bill.icon

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
          <BillIcon className="w-6 h-6 text-white" />
        </div>
        <div className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium flex items-center gap-1`}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </div>
      </div>
      <div className="mb-3">
        <div className="font-semibold text-gray-900 text-lg">{bill.name}</div>
        <div className="text-sm text-gray-500">{bill.provider}</div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-gray-500">Amount</div>
          <div className="text-xl font-bold text-gray-900">
            ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 flex items-center gap-1 justify-end">
            <Calendar className="w-4 h-4" />
            Due
          </div>
          <div className="font-semibold text-gray-900 text-sm">
            {new Date(bill.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add Item Modal Component
function AddItemModal({
  type,
  onClose,
  onSubmit,
}: {
  type: 'card' | 'loan' | 'bill'
  onClose: () => void
  onSubmit: (type: ModalType, data: any) => void
}) {
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(type, formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Add New {type === 'card' ? 'Credit Card' : type === 'loan' ? 'Loan' : 'Bill'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'card' && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Card Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Chase Sapphire"
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastFourDigits"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Last 4 Digits
                  </label>
                  <input
                    id="lastFourDigits"
                    type="text"
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="1234"
                    onChange={(e) => handleChange('lastFourDigits', e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="amountDue"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Amount Due
                  </label>
                  <input
                    id="amountDue"
                    type="number"
                    step="0.01"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="1247.50"
                    onChange={(e) => handleChange('amountDue', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-2">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="paid">Paid</option>
                    <option value="due-soon">Due Soon</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </>
            )}

            {type === 'loan' && (
              <>
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-900 mb-2">
                    Loan Type
                  </label>
                  <input
                    id="type"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Car Loan"
                    onChange={(e) => handleChange('type', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="lender" className="block text-sm font-semibold text-gray-900 mb-2">
                    Lender
                  </label>
                  <input
                    id="lender"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Honda Finance"
                    onChange={(e) => handleChange('lender', e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="monthlyPayment"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Monthly Payment
                  </label>
                  <input
                    id="monthlyPayment"
                    type="number"
                    step="0.01"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="485.00"
                    onChange={(e) => handleChange('monthlyPayment', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label
                    htmlFor="nextPaymentDate"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Next Payment Date
                  </label>
                  <input
                    id="nextPaymentDate"
                    type="date"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    onChange={(e) => handleChange('nextPaymentDate', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="icon" className="block text-sm font-semibold text-gray-900 mb-2">
                    Icon
                  </label>
                  <select
                    id="icon"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    onChange={(e) => {
                      const iconMap: Record<string, any> = {
                        home: HomeIcon,
                        car: Car,
                        education: GraduationCap,
                      }
                      handleChange('icon', iconMap[e.target.value])
                    }}
                  >
                    <option value="">Select icon</option>
                    <option value="home">Home</option>
                    <option value="car">Car</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="on-track">On Track</option>
                    <option value="due-soon">Due Soon</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </>
            )}

            {type === 'bill' && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Bill Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Internet"
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="provider" className="block text-sm font-semibold text-gray-900 mb-2">
                    Provider
                  </label>
                  <input
                    id="provider"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Xfinity"
                    onChange={(e) => handleChange('provider', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="89.99"
                    onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-2">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="icon" className="block text-sm font-semibold text-gray-900 mb-2">
                    Icon
                  </label>
                  <select
                    id="icon"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    onChange={(e) => {
                      const iconMap: Record<string, any> = {
                        wifi: Wifi,
                        electricity: Zap,
                        phone: Phone,
                        streaming: Tv,
                      }
                      handleChange('icon', iconMap[e.target.value])
                    }}
                  >
                    <option value="">Select icon</option>
                    <option value="wifi">Internet</option>
                    <option value="electricity">Electricity</option>
                    <option value="phone">Phone</option>
                    <option value="streaming">Streaming</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="paid">Paid</option>
                    <option value="due-soon">Due Soon</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  type === 'card'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : type === 'loan'
                      ? 'bg-teal-600 hover:bg-teal-700'
                      : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                Add {type === 'card' ? 'Card' : type === 'loan' ? 'Loan' : 'Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
