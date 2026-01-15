import { useState } from 'react'
import { X, CreditCard, Home, Receipt } from 'lucide-react'
import { AddPaymentFormData } from '@/types/payment'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPaymentModal({ isOpen, onClose }: AddPaymentModalProps) {
  const [step, setStep] = useState<'type' | 'form'>('type')
  const [paymentType, setPaymentType] = useState<'credit-card' | 'loan' | 'bill'>('credit-card')
  const [formData, setFormData] = useState<Partial<AddPaymentFormData>>({})

  if (!isOpen) return null

  const handleTypeSelect = (type: 'credit-card' | 'loan' | 'bill') => {
    setPaymentType(type)
    setFormData({ type })
    setStep('form')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // TODO: Handle form submission
    handleClose()
  }

  const handleClose = () => {
    setStep('type')
    setFormData({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'type' ? 'Add Payment' : `Add ${paymentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'type' ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Credit Card Option */}
              <button
                onClick={() => handleTypeSelect('credit-card')}
                className="group p-8 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-emerald-500 rounded-2xl transition-all text-center"
              >
                <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Credit Card</h3>
                <p className="text-sm text-gray-600">Track credit card payments and balances</p>
              </button>

              {/* Loan Option */}
              <button
                onClick={() => handleTypeSelect('loan')}
                className="group p-8 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-teal-500 rounded-2xl transition-all text-center"
              >
                <div className="w-16 h-16 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Loan</h3>
                <p className="text-sm text-gray-600">Manage auto, home, or personal loans</p>
              </button>

              {/* Bill Option */}
              <button
                onClick={() => handleTypeSelect('bill')}
                className="group p-8 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-cyan-500 rounded-2xl transition-all text-center"
              >
                <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bill</h3>
                <p className="text-sm text-gray-600">Add utilities, subscriptions, and more</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={
                    paymentType === 'credit-card'
                      ? 'e.g., Chase Sapphire'
                      : paymentType === 'loan'
                      ? 'e.g., Car Loan'
                      : 'e.g., Electric Bill'
                  }
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Credit Card Specific */}
              {paymentType === 'credit-card' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last 4 Digits *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        pattern="[0-9]{4}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="1234"
                        value={formData.lastFour || ''}
                        onChange={(e) => setFormData({ ...formData, lastFour: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.brand || ''}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value as any })}
                      >
                        <option value="">Select...</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="amex">American Express</option>
                        <option value="discover">Discover</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Credit Limit *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="10000"
                        value={formData.creditLimit || ''}
                        onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Payment *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="25.00"
                        value={formData.minPayment || ''}
                        onChange={(e) => setFormData({ ...formData, minPayment: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Loan Specific */}
              {paymentType === 'loan' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Type *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.loanType || ''}
                        onChange={(e) => setFormData({ ...formData, loanType: e.target.value as any })}
                      >
                        <option value="">Select...</option>
                        <option value="auto">Auto</option>
                        <option value="home">Home</option>
                        <option value="personal">Personal</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lender *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="e.g., Wells Fargo"
                        value={formData.lender || ''}
                        onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remaining Balance *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="25000"
                        value={formData.remainingBalance || ''}
                        onChange={(e) => setFormData({ ...formData, remainingBalance: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interest Rate (%) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="4.5"
                        value={formData.interestRate || ''}
                        onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Bill Specific */}
              {paymentType === 'bill' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bill Type *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.billType || ''}
                        onChange={(e) => setFormData({ ...formData, billType: e.target.value as any })}
                      >
                        <option value="">Select...</option>
                        <option value="utilities">Utilities</option>
                        <option value="internet">Internet</option>
                        <option value="phone">Phone</option>
                        <option value="insurance">Insurance</option>
                        <option value="subscription">Subscription</option>
                        <option value="rent">Rent</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="e.g., PG&E"
                        value={formData.provider || ''}
                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        checked={formData.recurring || false}
                        onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                      />
                      <span className="text-sm text-gray-700">Recurring payment</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        checked={formData.autoPay || false}
                        onChange={(e) => setFormData({ ...formData, autoPay: e.target.checked })}
                      />
                      <span className="text-sm text-gray-700">Auto-pay enabled</span>
                    </label>
                  </div>
                </>
              )}

              {/* Amount and Due Date (common for all) */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {paymentType === 'loan' ? 'Monthly Payment' : 'Amount'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="100.00"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Auto-pay for loans */}
              {paymentType === 'loan' && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    checked={formData.autoPay || false}
                    onChange={(e) => setFormData({ ...formData, autoPay: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">Auto-pay enabled</span>
                </label>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('type')}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Add Payment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
