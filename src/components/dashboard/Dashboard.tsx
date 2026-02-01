
import {
  ArrowUpRight,
  Bell,
  CreditCard,
  DollarSign,
  Landmark,
  Plus,
  Receipt,
  Trash,
} from 'lucide-react'
import { getRouteApi, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { AddPaymentModal } from './AddPaymentModal'
import { deletePaymentFn } from '@/utils/dashboard.functions'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type StatCardProps = {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  tone: 'emerald' | 'teal' | 'cyan'
}

type PaymentCardProps = {
  id: string
  type: 'credit_card' | 'loan' | 'recurring_bill'
  name: string
  provider: string
  amount: string
  date: string
  status: 'Paid' | 'Due Soon' | 'Overdue' | 'Auto-Pay'
  icon: React.ComponentType<{ className?: string }>
}



const toneClasses: Record<StatCardProps['tone'], string> = {
  emerald: 'from-emerald-500 to-emerald-600',
  teal: 'from-teal-500 to-cyan-500',
  cyan: 'from-cyan-500 to-sky-500',
}

function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl bg-linear-to-r ${toneClasses[tone]} p-6 text-white shadow-lg shadow-emerald-900/10`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/90">{label}</p>
          <p className="text-3xl font-black tracking-tight">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}



function PaymentCard({ id, type, name, provider, amount, date, status, icon: Icon }: PaymentCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const theme = {
    Paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Due Soon': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Overdue: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    'Auto-Pay': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  }[status]

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this payment?')) return

    setIsDeleting(true)
    try {
      const res = await deletePaymentFn({ data: { id, type } })
      if (!res.success) throw new Error(res.error || 'Failed')
      await router.invalidate()
    } catch (e) {
      alert('Failed to delete')
      setIsDeleting(false)
    }
  }

  return (
    <div className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        title="Delete Payment"
      >
        <Trash className="w-4 h-4" />
      </button>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${theme.bg}`}>
            <Icon className={`h-6 w-6 ${theme.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-sm font-medium text-gray-500">{provider}</p>
          </div>
        </div>
      </div>

      {/* ... rest of component ... */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Amount</p>
          <p className="mt-0.5 text-lg font-black text-gray-900">{amount}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {status === 'Auto-Pay' ? 'Next Payment' : 'Due Date'}
          </p>
          <div className={`mt-1 inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${theme.bg} ${theme.text} ${theme.border}`}>
            {date}
          </div>
        </div>
      </div>
    </div>
  )
}



const routeApi = getRouteApi('/dashboard')

export function Dashboard() {
  const data = routeApi.useLoaderData()
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)

  const statsItems: StatCardProps[] = [
    {
      label: 'Total Due This Month',
      value: formatCurrency(data.stats.totalDue),
      icon: DollarSign,
      tone: 'emerald',
    },
    {
      label: 'Upcoming Payments',
      value: data.stats.upcomingPaymentsCount.toString(),
      icon: Bell,
      tone: 'teal',
    },
    {
      label: 'Auto-Pay Active',
      value: data.stats.autoPayCount.toString(),
      icon: ArrowUpRight,
      tone: 'cyan',
    },
  ]

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-20">
      <AddPaymentModal isOpen={isAddPaymentOpen} onClose={() => setIsAddPaymentOpen(false)} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Overview</p>
            <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">Dashboard</h1>
            <p className="max-w-2xl text-lg text-gray-600">Manage all your payments in one place.</p>
          </div>

          <button
            onClick={() => setIsAddPaymentOpen(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-emerald-900/15 transition-all hover:translate-y-0.5 hover:bg-emerald-700"
          >
            <Plus className="h-5 w-5" />
            Add Payment
          </button>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {statsItems.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {/* Credit Cards Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <CreditCard className="h-5 w-5" />
              </span>
              Credit Cards
              <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {data.creditCards.length}
              </span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.creditCards.map((card) => (
              <PaymentCard
                key={card.id}
                id={card.id}
                type="credit_card"
                name={card.name}
                provider={card.provider}
                amount={formatCurrency(card.amountDue)}
                date={formatDate(card.dueDate)}
                status={card.status as PaymentCardProps['status']}
                icon={CreditCard}
              />
            ))}
          </div>
        </section>

        {/* Loans Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Landmark className="h-5 w-5" />
              </span>
              Loans
              <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {data.loans.length}
              </span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.loans.map((loan) => (
              <PaymentCard
                key={loan.id}
                id={loan.id}
                type="loan"
                name={loan.name}
                provider={loan.provider}
                amount={formatCurrency(loan.monthlyPayment)}
                date={formatDate(loan.nextPayment)}
                status={loan.autoPay ? 'Auto-Pay' : 'Due Soon'}
                icon={Landmark}
              />
            ))}
          </div>
        </section>

        {/* Recurring Bills Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Receipt className="h-5 w-5" />
              </span>
              Recurring Bills
              <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {data.recurringBills.length}
              </span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.recurringBills.map((bill) => (
              <PaymentCard
                key={bill.id}
                id={bill.id}
                type="recurring_bill"
                name={bill.name}
                provider={bill.provider}
                amount={formatCurrency(bill.amount)}
                date={formatDate(bill.dueDate)}
                status={bill.autoPay ? 'Auto-Pay' : 'Due Soon'}
                icon={Receipt}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
