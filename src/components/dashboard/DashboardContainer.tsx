// src/components/dashboard/DashboardContainer.tsx
import { useEffect, useState } from 'react'
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
import { 
  getDashboardStats, 
  getCreditCards, 
  getLoans, 
  getRecurringBills,
  type CreditCardData,
  type LoanData,
  type RecurringBillData,
  type DashboardStats,
} from '@/data/dashboard'
import { formatCurrency, formatDate, getLoanTypeName, getBillCategoryName } from '@/lib/format-utils'

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

// Icon mapping for bill categories
const billCategoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  UTILITIES: Receipt,
  INTERNET: Wifi,
  PHONE: Smartphone,
  SUBSCRIPTION: Receipt,
  INSURANCE: Receipt,
  OTHER: Receipt,
}

export function DashboardContainer() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [creditCards, setCreditCards] = useState<CreditCardData[]>([])
  const [loans, setLoans] = useState<LoanData[]>([])
  const [bills, setBills] = useState<RecurringBillData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, cardsData, loansData, billsData] = await Promise.all([
          getDashboardStats(),
          getCreditCards(),
          getLoans(),
          getRecurringBills(),
        ])

        setStats(statsData)
        setCreditCards(cardsData)
        setLoans(loansData)
        setBills(billsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  const statCards: StatCardProps[] = [
    {
      label: 'Total Due This Month',
      value: formatCurrency(stats?.totalDueThisMonth || 0),
      icon: DollarSign,
      tone: 'emerald',
    },
    {
      label: 'Upcoming Payments',
      value: String(stats?.upcomingPayments || 0),
      icon: Bell,
      tone: 'teal',
    },
    {
      label: 'Auto-Pay Active',
      value: String(stats?.autoPayActive || 0),
      icon: ArrowUpRight,
      tone: 'cyan',
    },
  ]

  // Transform credit cards to payment card format
  const creditCardCards: PaymentCardProps[] = creditCards.map((card) => ({
    name: card.name,
    provider: card.provider,
    amountLabel: 'Amount Due',
    amountValue: formatCurrency(card.currentBalance),
    dateLabel: 'Due Date',
    dateValue: formatDate(card.dueDate),
    metaLabel: 'Minimum payment:',
    metaValue: formatCurrency(card.minimumPayment),
    status: card.isPaid
      ? { label: 'Paid', tone: 'success' as const }
      : card.isOverdue
        ? { label: 'Overdue', tone: 'danger' as const }
        : card.isDueSoon
          ? { label: 'Due Soon', tone: 'warning' as const }
          : card.autopay
            ? { label: 'Auto-pay on', tone: 'success' as const }
            : undefined,
    icon: CreditCard,
  }))

  // Transform loans to payment card format
  const loanIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    AUTO: Landmark,
    MORTGAGE: Home,
    STUDENT: Building2,
    PERSONAL: Landmark,
  }

  const loanCards: PaymentCardProps[] = loans.map((loan) => ({
    name: getLoanTypeName(loan.type),
    provider: loan.provider,
    amountLabel: 'Monthly Payment',
    amountValue: formatCurrency(loan.monthlyPayment),
    dateLabel: 'Next Payment',
    dateValue: formatDate(loan.nextPaymentDate),
    metaLabel: 'Remaining balance:',
    metaValue: formatCurrency(loan.remainingBalance),
    status: loan.autopay ? { label: 'Auto-pay on', tone: 'success' as const } : undefined,
    icon: loanIcons[loan.type] || Landmark,
  }))

  // Transform bills to payment card format
  const billCards: PaymentCardProps[] = bills.map((bill) => ({
    name: bill.name,
    provider: bill.provider,
    amountLabel: 'Amount',
    amountValue: formatCurrency(bill.amount),
    dateLabel: 'Due Date',
    dateValue: formatDate(bill.nextDueDate),
    metaLabel: 'Category:',
    metaValue: getBillCategoryName(bill.category),
    status: bill.autopay ? { label: 'Auto-pay on', tone: 'success' as const } : undefined,
    icon: billCategoryIcons[bill.category] || Receipt,
  }))

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
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {creditCardCards.length > 0 && (
          <DashboardSection title="Credit Cards" count={creditCardCards.length} icon={CreditCard}>
            {creditCardCards.map((card) => (
              <PaymentCard key={card.name} {...card} />
            ))}
          </DashboardSection>
        )}

        {loanCards.length > 0 && (
          <DashboardSection title="Loans" count={loanCards.length} icon={Landmark}>
            {loanCards.map((loan) => (
              <PaymentCard key={loan.name} {...loan} />
            ))}
          </DashboardSection>
        )}

        {billCards.length > 0 && (
          <DashboardSection title="Recurring Bills" count={billCards.length} icon={Receipt}>
            {billCards.map((bill) => (
              <PaymentCard key={bill.name} {...bill} />
            ))}
          </DashboardSection>
        )}

        {creditCardCards.length === 0 && loanCards.length === 0 && billCards.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-white/50 p-12 text-center">
            <p className="text-lg font-semibold text-gray-600">No financial accounts found</p>
            <p className="mt-2 text-sm text-gray-500">
              Add your credit cards, loans, or bills to get started
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
