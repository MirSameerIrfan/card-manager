import {
  ArrowUpRight,
  Bell,
  Building2,
  CreditCard,
  DollarSign,
  Home,
  Landmark,
  Plus,
  Receipt,
  Smartphone,
  Wifi,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  getCreditCardsFn,
  getLoansFn,
  getRecurringBillsFn,
  getPaymentStatsFn,
} from '@/data/payments'

type StatCardProps = {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  tone: 'emerald' | 'teal' | 'cyan'
}

type PaymentCardProps = {
  name: string
  provider: string
  amountLabel: string
  amountValue: string
  dateLabel: string
  dateValue: string
  metaLabel: string
  metaValue: string
  status?: {
    label: string
    tone: 'warning' | 'success' | 'danger'
  }
  icon: React.ComponentType<{ className?: string }>
}

type DashboardSectionProps = {
  title: string
  count: number
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}

const toneClasses: Record<StatCardProps['tone'], string> = {
  emerald: 'from-emerald-500 to-emerald-600',
  teal: 'from-teal-500 to-cyan-500',
  cyan: 'from-cyan-500 to-sky-500',
}

const statusClasses: Record<NonNullable<PaymentCardProps['status']>['tone'], string> = {
  warning: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-rose-100 text-rose-700',
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Utilities: Wifi,
  Subscription: Receipt,
  Insurance: Receipt,
  default: Receipt,
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

function StatusPill({ status }: { status: NonNullable<PaymentCardProps['status']> }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status.tone]}`}>
      {status.label}
    </span>
  )
}

function PaymentCard({
  name,
  provider,
  amountLabel,
  amountValue,
  dateLabel,
  dateValue,
  metaLabel,
  metaValue,
  status,
  icon: Icon,
}: PaymentCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-emerald-100/60 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/15">
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            <p className="text-sm font-medium text-gray-500">{provider}</p>
          </div>
        </div>
        {status ? <StatusPill status={status} /> : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{amountLabel}</p>
          <p className="mt-2 text-2xl font-black text-gray-900">{amountValue}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{dateLabel}</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{dateValue}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4 text-sm font-medium text-gray-500">
        {metaLabel}{' '}
        <span className="font-semibold text-gray-700">{metaValue}</span>
      </div>
    </article>
  )
}

function DashboardSection({ title, count, icon: Icon, children }: DashboardSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/15">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">{title}</h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {count}
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  )
}

export function Dashboard() {
  // State for data
  const [creditCardsData, setCreditCardsData] = useState<Awaited<ReturnType<typeof getCreditCardsFn>>>([])
  const [loansData, setLoansData] = useState<Awaited<ReturnType<typeof getLoansFn>>>([])
  const [recurringBillsData, setRecurringBillsData] = useState<Awaited<ReturnType<typeof getRecurringBillsFn>>>([])
  const [statsData, setStatsData] = useState<Awaited<ReturnType<typeof getPaymentStatsFn>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [creditCards, loans, bills, stats] = await Promise.all([
          getCreditCardsFn(),
          getLoansFn(),
          getRecurringBillsFn(),
          getPaymentStatsFn(),
        ])
        setCreditCardsData(creditCards)
        setLoansData(loans)
        setRecurringBillsData(bills)
        setStatsData(stats)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Format stats data
  const stats: StatCardProps[] = [
    {
      label: 'Total Due This Month',
      value: statsData?.totalDue ? `$${statsData.totalDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
      icon: DollarSign,
      tone: 'emerald',
    },
    {
      label: 'Upcoming Payments',
      value: String(statsData?.upcomingPayments || 0),
      icon: Bell,
      tone: 'teal',
    },
    {
      label: 'Auto-Pay Active',
      value: String(statsData?.autoPayActive || 0),
      icon: ArrowUpRight,
      tone: 'cyan',
    },
  ]

  // Transform credit cards data
  const creditCards: PaymentCardProps[] =
    creditCardsData?.map((card) => {
      const dueDate = new Date(card.dueDate)
      const now = new Date()
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      let status: PaymentCardProps['status']
      if (card.isPaid) {
        status = { label: 'Paid', tone: 'success' }
      } else if (card.isOverdue || daysDiff < 0) {
        status = { label: 'Overdue', tone: 'danger' }
      } else if (daysDiff <= 7) {
        status = { label: 'Due Soon', tone: 'warning' }
      } else {
        status = undefined
      }

      return {
        name: card.name,
        provider: card.provider,
        amountLabel: 'Amount Due',
        amountValue: `$${card.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        dateLabel: 'Due Date',
        dateValue: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        metaLabel: 'Minimum payment:',
        metaValue: `$${card.minimumPayment.toFixed(2)}`,
        status,
        icon: CreditCard,
      }
    }) || []

  // Transform loans data
  const loans: PaymentCardProps[] =
    loansData?.map((loan) => {
      const nextPaymentDate = new Date(loan.nextPaymentDate)

      return {
        name: loan.name,
        provider: loan.provider,
        amountLabel: 'Monthly Payment',
        amountValue: `$${loan.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        dateLabel: 'Next Payment',
        dateValue: nextPaymentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        metaLabel: 'Remaining balance:',
        metaValue: `$${loan.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        status: loan.isAutoPayOn ? { label: 'Auto-pay on', tone: 'success' } : undefined,
        icon: loan.name.toLowerCase().includes('mortgage') ? Home : loan.name.toLowerCase().includes('auto') || loan.name.toLowerCase().includes('car') ? Landmark : Building2,
      }
    }) || []

  // Transform recurring bills data
  const recurringBills: PaymentCardProps[] =
    recurringBillsData?.map((bill) => {
      const dueDate = new Date(bill.dueDate)
      
      // Determine icon based on category or name
      let icon: React.ComponentType<{ className?: string }> = Receipt
      if (bill.category === 'Utilities' && bill.name.toLowerCase().includes('internet')) {
        icon = Wifi
      } else if (bill.category === 'Utilities' && bill.name.toLowerCase().includes('phone')) {
        icon = Smartphone
      } else if (bill.category === 'Utilities' || bill.category === 'Subscription' || bill.category === 'Insurance') {
        icon = Receipt
      }

      return {
        name: bill.name,
        provider: bill.provider,
        amountLabel: 'Amount',
        amountValue: `$${bill.amount.toFixed(2)}`,
        dateLabel: 'Due Date',
        dateValue: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        metaLabel: 'Category:',
        metaValue: bill.category,
        status: bill.isAutoPayOn ? { label: 'Auto-pay on', tone: 'success' } : undefined,
        icon,
      }
    }) || []

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
              <p className="text-lg font-semibold text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Overview</p>
            <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">Dashboard</h1>
            <p className="max-w-2xl text-lg text-gray-600">Manage all your payments in one place.</p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-emerald-900/15 transition-all hover:translate-y-0.5 hover:bg-emerald-700">
            <Plus className="h-5 w-5" />
            Add Payment
          </button>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <DashboardSection title="Credit Cards" count={creditCards.length} icon={CreditCard}>
          {creditCards.map((card) => (
            <PaymentCard key={card.name} {...card} />
          ))}
        </DashboardSection>

        <DashboardSection title="Loans" count={loans.length} icon={Landmark}>
          {loans.map((loan) => (
            <PaymentCard key={loan.name} {...loan} />
          ))}
        </DashboardSection>

        <DashboardSection title="Recurring Bills" count={recurringBills.length} icon={Receipt}>
          {recurringBills.map((bill) => (
            <PaymentCard key={bill.name} {...bill} />
          ))}
        </DashboardSection>
      </div>
    </main>
  )
}
