import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useRouter } from '@tanstack/react-router'
import {
    CreditCard,
    Landmark,
    Receipt,
    X,
    Check,
    Calendar,
    DollarSign,
    Building2
} from 'lucide-react'
import { addPaymentFn } from '../../utils/dashboard.functions'

type PaymentType = 'credit_card' | 'loan' | 'recurring_bill'

interface AddPaymentModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddPaymentModal({ isOpen, onClose }: AddPaymentModalProps) {
    const router = useRouter()
    const [type, setType] = useState<PaymentType>('credit_card')
    const [isLoading, setIsLoading] = useState(false)

    // Generic form state - in a real app use React Hook Form or TanStack Form
    const [name, setName] = useState('')
    const [provider, setProvider] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState('')

    // Specifics
    const [minimumPayment, setMinimumPayment] = useState('')
    const [category, setCategory] = useState('')
    const [autoPay, setAutoPay] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await addPaymentFn({
                data: {
                    type,
                    name,
                    provider,
                    amount: parseFloat(amount),
                    date: new Date(date).toISOString(),
                    minimumPayment: minimumPayment ? parseFloat(minimumPayment) : undefined,
                    status: 'Due Soon', // Default
                    category: category || undefined,
                    autoPay
                }
            })

            if (!res.success) {
                throw new Error(res.error || 'Failed to add payment')
            }

            // Refresh data
            await router.invalidate()
            onClose()

            // Reset form (optional, since it unmounts mostly)
            setName('')
            setProvider('')
            setAmount('')
            setDate('')
        } catch (error: any) {
            console.error(error)
            alert(error.message || 'Failed to add payment')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal - Styled like the dashboard cards */}
            <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl shadow-emerald-900/20 transition-all sm:p-8">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Add Payment</h2>
                        <p className="mt-1 text-sm text-gray-500">Track a new financial obligation.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Type Selector */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setType('credit_card')}
                            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${type === 'credit_card'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500 ring-offset-2'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <CreditCard className="h-6 w-6" />
                            Card
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('loan')}
                            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${type === 'loan'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500 ring-offset-2'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <Landmark className="h-6 w-6" />
                            Loan
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('recurring_bill')}
                            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${type === 'recurring_bill'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500 ring-offset-2'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <Receipt className="h-6 w-6" />
                            Bill
                        </button>
                    </div>

                    {/* Common Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Name</label>
                            <input
                                required
                                type="text"
                                placeholder={type === 'credit_card' ? 'e.g. Chase Sapphire' : type === 'loan' ? 'e.g. Auto Loan' : 'e.g. Netflix'}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Provider / Last 4 Digits</label>
                            <div className="relative mt-1">
                                <Building2 className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    placeholder={type === 'credit_card' ? '••••4589' : 'e.g. Honda Finance'}
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">{type === 'loan' ? 'Monthly Payment' : 'Amount Due'}</label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">{type === 'loan' ? 'Next Payment' : 'Due Date'}</label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                    <input
                                        required
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Conditional Fields */}
                        {type === 'credit_card' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Minimum Payment</label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={minimumPayment}
                                        onChange={(e) => setMinimumPayment(e.target.value)}
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        )}

                        {type === 'recurring_bill' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Category</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Utilities"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-colors focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                                />
                            </div>
                        )}

                        {(type === 'loan' || type === 'recurring_bill') && (
                            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <input
                                    type="checkbox"
                                    id="autopay"
                                    checked={autoPay}
                                    onChange={(e) => setAutoPay(e.target.checked)}
                                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor="autopay" className="text-sm font-medium text-gray-700">
                                    Auto-pay enabled
                                </label>
                            </div>
                        )}

                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:translate-y-0.5 hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Adding...' : 'Add Payment'}
                        {!isLoading && <Check className="h-5 w-5" />}
                    </button>
                </form>
            </div>
        </div>
    )
}
