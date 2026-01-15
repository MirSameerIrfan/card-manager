import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CreditCard,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  X,
  Wallet,
  Receipt,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({ component: Dashboard })

// Type definitions
interface CreditCardItem {
  id: number
  name: string
  lastFour: string
  amount: number
  dueDate: string
  status: 'due-soon' | 'upcoming' | 'overdue' | 'paid'
}

interface LoanItem {
  id: number
  name: string
  provider: string
  amount: number
  dueDate: string
  status: 'auto-pay' | 'upcoming' | 'overdue' | 'paid'
}

interface BillItem {
  id: number
  name: string
  provider: string
  amount: number
  dueDate: string
  recurring: boolean
  status: 'paid' | 'due-soon' | 'upcoming' | 'overdue'
}

type PaymentType = 'credit-card' | 'loan' | 'bill'

interface NewPaymentForm {
  type: PaymentType
  name: string
  provider?: string
  lastFour?: string
  amount: string
  dueDate: string
  recurring: boolean
}

function Dashboard() {
  // State for payment items
  const [creditCards, setCreditCards] = useState<CreditCardItem[]>([
    {
      id: 1,
      name: 'Chase Sapphire',
      lastFour: '4589',
      amount: 1247.5,
      dueDate: '2026-01-15',
      status: 'due-soon',
    },
    {
      id: 2,
      name: 'Amex Gold',
      lastFour: '3456',
      amount: 890.25,
      dueDate: '2026-01-20',
      status: 'upcoming',
    },
  ])

  const [loans, setLoans] = useState<LoanItem[]>([
    {
      id: 1,
      name: 'Car Loan',
      provider: 'Honda Finance',
      amount: 485.0,
      dueDate: '2026-01-20',
      status: 'auto-pay',
    },
    {
      id: 2,
      name: 'Student Loan',
      provider: 'Federal',
      amount: 250.0,
      dueDate: '2026-01-25',
      status: 'upcoming',
    },
  ])

  const [bills, setBills] = useState<BillItem[]>([
    {
      id: 1,
      name: 'Internet',
      provider: 'Comcast',
      amount: 79.99,
      dueDate: '2026-01-10',
      recurring: true,
      status: 'paid',
    },
    {
      id: 2,
      name: 'Electricity',
      provider: 'PG&E',
      amount: 120.0,
      dueDate: '2026-01-18',
      recurring: true,
      status: 'due-soon',
    },
  ])

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<PaymentType>('credit-card')
  const [formData, setFormData] = useState<NewPaymentForm>({
    type: 'credit-card',
    name: '',
    provider: '',
    lastFour: '',
    amount: '',
    dueDate: '',
    recurring: false,
  })

  // Open modal with specific type
  const openModal = (type: PaymentType) => {
    setModalType(type)
    setFormData({
      type,
      name: '',
      provider: '',
      lastFour: '',
      amount: '',
      dueDate: '',
      recurring: false,
    })
    setIsModalOpen(true)
  }

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({
      type: 'credit-card',
      name: '',
      provider: '',
      lastFour: '',
      amount: '',
      dueDate: '',
      recurring: false,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(formData.amount)
    if (isNaN(amount)) {
      alert('Please enter a valid amount')
      return
    }

    if (formData.type === 'credit-card') {
      const newCard: CreditCardItem = {
        id: Date.now(),
        name: formData.name,
        lastFour: formData.lastFour || '0000',
        amount,
        dueDate: formData.dueDate,
        status: 'upcoming',
      }
      setCreditCards([...creditCards, newCard])
    } else if (formData.type === 'loan') {
      const newLoan: LoanItem = {
        id: Date.now(),
        name: formData.name,
        provider: formData.provider || '',
        amount,
        dueDate: formData.dueDate,
        status: 'upcoming',
      }
      setLoans([...loans, newLoan])
    } else if (formData.type === 'bill') {
      const newBill: BillItem = {
        id: Date.now(),
        name: formData.name,
        provider: formData.provider || '',
        amount,
        dueDate: formData.dueDate,
        recurring: formData.recurring,
        status: 'upcoming',
      }
      setBills([...bills, newBill])
    }

    closeModal()
  }

  // Get status badge styles
  const getStatusBadge = (
    status: string
  ): { text: string; className: string } => {
    switch (status) {
      case 'due-soon':
        return {
          text: 'Due Soon',
          className: 'px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium',
        }
      case 'paid':
        return {
          text: 'Paid',
          className: 'px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium',
        }
      case 'overdue':
        return {
          text: 'Overdue',
          className: 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium',
        }
      case 'auto-pay':
        return {
          text: 'Auto-pay on',
          className: 'px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium',
        }
      default:
        return {
          text: 'Upcoming',
          className: 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium',
        }
    }
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
            Payment Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your credit cards, loans, and recurring bills in one place
          </p>
        </div>

        {/* Grid Layout for Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Credit Cards Section */}
          <section className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex-1 flex flex-col">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Credit Cards
                  </h2>
                  <p className="text-sm text-gray-500">
                    {creditCards.length} active cards
                  </p>
                </div>
              </div>

              {/* Card List */}
              <div className="space-y-4 flex-1 mb-6">
                {creditCards.map((card) => {
                  const badge = getStatusBadge(card.status)
                  return (
                    <div
                      key={card.id}
                      className="border-2 border-gray-100 rounded-xl p-4 hover:border-emerald-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {card.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ••••{card.lastFour}
                          </div>
                        </div>
                        <span className={badge.className}>{badge.text}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-gray-500">Amount Due</div>
                          <div className="text-xl font-bold text-gray-900">
                            ${card.amount.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Due Date</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatDate(card.dueDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add New Button */}
              <button
                onClick={() => openModal('credit-card')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                aria-label="Add new credit card"
              >
                <Plus className="w-5 h-5" />
                Add New Card
              </button>
            </div>
          </section>

          {/* Loans Section */}
          <section className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex-1 flex flex-col">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Loans</h2>
                  <p className="text-sm text-gray-500">
                    {loans.length} active loans
                  </p>
                </div>
              </div>

              {/* Loan List */}
              <div className="space-y-4 flex-1 mb-6">
                {loans.map((loan) => {
                  const badge = getStatusBadge(loan.status)
                  return (
                    <div
                      key={loan.id}
                      className="border-2 border-gray-100 rounded-xl p-4 hover:border-teal-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {loan.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {loan.provider}
                          </div>
                        </div>
                        <span className={badge.className}>{badge.text}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-gray-500">
                            Monthly Payment
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            ${loan.amount.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Next Payment</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatDate(loan.dueDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add New Button */}
              <button
                onClick={() => openModal('loan')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                aria-label="Add new loan"
              >
                <Plus className="w-5 h-5" />
                Add New Loan
              </button>
            </div>
          </section>

          {/* Bills Section */}
          <section className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex-1 flex flex-col">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bills</h2>
                  <p className="text-sm text-gray-500">
                    {bills.length} recurring bills
                  </p>
                </div>
              </div>

              {/* Bill List */}
              <div className="space-y-4 flex-1 mb-6">
                {bills.map((bill) => {
                  const badge = getStatusBadge(bill.status)
                  return (
                    <div
                      key={bill.id}
                      className="border-2 border-gray-100 rounded-xl p-4 hover:border-cyan-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {bill.name}
                            {bill.recurring && (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bill.provider}
                          </div>
                        </div>
                        <span className={badge.className}>{badge.text}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-gray-500">Amount</div>
                          <div className="text-xl font-bold text-gray-900">
                            ${bill.amount.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Due Date</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatDate(bill.dueDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add New Button */}
              <button
                onClick={() => openModal('bill')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                aria-label="Add new bill"
              >
                <Plus className="w-5 h-5" />
                Add New Bill
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    {modalType === 'credit-card' && (
                      <CreditCard className="w-5 h-5 text-white" />
                    )}
                    {modalType === 'loan' && (
                      <Wallet className="w-5 h-5 text-white" />
                    )}
                    {modalType === 'bill' && (
                      <Receipt className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                    Add New{' '}
                    {modalType === 'credit-card'
                      ? 'Credit Card'
                      : modalType === 'loan'
                        ? 'Loan'
                        : 'Bill'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Payment Type Selector */}
                <div>
                  <label
                    htmlFor="payment-type"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Payment Type
                  </label>
                  <select
                    id="payment-type"
                    value={modalType}
                    onChange={(e) => {
                      const newType = e.target.value as PaymentType
                      setModalType(newType)
                      setFormData({ ...formData, type: newType })
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-900 font-medium"
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="loan">Loan</option>
                    <option value="bill">Bill</option>
                  </select>
                </div>

                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Name / Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={
                      modalType === 'credit-card'
                        ? 'e.g., Chase Sapphire'
                        : modalType === 'loan'
                          ? 'e.g., Car Loan'
                          : 'e.g., Internet'
                    }
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                  />
                </div>

                {/* Provider Input (for loans and bills) */}
                {(modalType === 'loan' || modalType === 'bill') && (
                  <div>
                    <label
                      htmlFor="provider"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Provider / Company
                    </label>
                    <input
                      type="text"
                      id="provider"
                      value={formData.provider}
                      onChange={(e) =>
                        setFormData({ ...formData, provider: e.target.value })
                      }
                      placeholder={
                        modalType === 'loan'
                          ? 'e.g., Honda Finance'
                          : 'e.g., Comcast'
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                    />
                  </div>
                )}

                {/* Last Four Digits (for credit cards) */}
                {modalType === 'credit-card' && (
                  <div>
                    <label
                      htmlFor="lastFour"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Last 4 Digits
                    </label>
                    <input
                      type="text"
                      id="lastFour"
                      value={formData.lastFour}
                      onChange={(e) =>
                        setFormData({ ...formData, lastFour: e.target.value })
                      }
                      placeholder="e.g., 4589"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                    />
                  </div>
                )}

                {/* Amount Input */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      id="amount"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                    />
                  </div>
                </div>

                {/* Due Date Input */}
                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                    />
                  </div>
                </div>

                {/* Recurring Toggle (for bills) */}
                {modalType === 'bill' && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={formData.recurring}
                      onChange={(e) =>
                        setFormData({ ...formData, recurring: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <label
                      htmlFor="recurring"
                      className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Monthly Recurring Payment
                    </label>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
