import { Suspense, use } from 'react'
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
  getCreditCardsFn,
  getLoansFn,
  getRecurringBillsFn,
  getDashboardStatsFn,
  type CreditCardData,
  type LoanData,
  type RecurringBillData,
  type DashboardStats,
} from '@/data/dashboard.functions'

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
        {metaLabel} <span className="font-semibold text-gray-700">{metaValue}</span>
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

// Helper functions to format data for display
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function mapCreditCardStatus(status: string): NonNullable<PaymentCardProps['status']> {
  switch (status) {
    case 'due_soon':
      return { label: 'Due Soon', tone: 'warning' }
    case 'paid':
      return { label: 'Paid', tone: 'success' }
    case 'overdue':
      return { label: 'Overdue', tone: 'danger' }
    default:
      return { label: 'Due Soon', tone: 'warning' }
  }
}

// Icon mapping for bills by category
function getBillIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'utilities':
      return Wifi
    case 'subscription':
      return Receipt
    case 'insurance':
      return Receipt
    default:
      return Receipt
  }
}

// Components that fetch and display real data
function StatsSection({ statsPromise }: { statsPromise: Promise<DashboardStats> }) {
  const stats = use(statsPromise)

  const statCards: StatCardProps[] = [
    {
      label: 'Total Due This Month',
      value: formatCurrency(stats.totalDue),
      icon: DollarSign,
      tone: 'emerald',
    },
    {
      label: 'Upcoming Payments',
      value: stats.upcomingPayments.toString(),
      icon: Bell,
      tone: 'teal',
    },
    {
      label: 'Auto-Pay Active',
      value: stats.autoPayActive.toString(),
      icon: ArrowUpRight,
      tone: 'cyan',
    },
  ]

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  )
}

function CreditCardsSection({ cardsPromise }: { cardsPromise: Promise<CreditCardData[]> }) {
  const creditCards = use(cardsPromise)

  if (creditCards.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/15">
            <CreditCard className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Credit Cards</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">0</span>
        </div>
        <div className="rounded-2xl border border-emerald-100/60 bg-white p-12 text-center">
          <p className="text-gray-500">No credit cards found. Add your first credit card to get started.</p>
        </div>
      </section>
    )
  }

  const mappedCards: PaymentCardProps[] = creditCards.map((card) => ({
    name: card.name,
    provider: card.provider,
    amountLabel: 'Amount Due',
    amountValue: formatCurrency(card.amountDue),
    dateLabel: 'Due Date',
    dateValue: formatDate(card.dueDate),
    metaLabel: 'Minimum payment:',
    metaValue: formatCurrency(card.minimumPayment),
    status: mapCreditCardStatus(card.status),
    icon: CreditCard,
  }))

  return (
    <DashboardSection title="Credit Cards" count={creditCards.length} icon={CreditCard}>
      {mappedCards.map((card) => (
        <PaymentCard key={card.name} {...card} />
      ))}
    </DashboardSection>
  )
}

function LoansSection({ loansPromise }: { loansPromise: Promise<LoanData[]> }) {
  const loans = use(loansPromise)

  if (loans.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/15">
            <Landmark className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Loans</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">0</span>
        </div>
        <div className="rounded-2xl border border-emerald-100/60 bg-white p-12 text-center">
          <p className="text-gray-500">No loans found.</p>
        </div>
      </section>
    )
  }

  const getLoanIcon = (name: string) => {
    if (name.toLowerCase().includes('auto')) return Landmark
    if (name.toLowerCase().includes('mortgage') || name.toLowerCase().includes('home')) return Home
    if (name.toLowerCase().includes('student')) return Building2
    return Landmark
  }

  const mappedLoans: PaymentCardProps[] = loans.map((loan) => ({
    name: loan.name,
    provider: loan.provider,
    amountLabel: 'Monthly Payment',
    amountValue: formatCurrency(loan.monthlyPayment),
    dateLabel: 'Next Payment',
    dateValue: formatDate(loan.nextPayment),
    metaLabel: 'Remaining balance:',
    metaValue: formatCurrency(loan.remainingBalance),
    status: loan.autoPay ? { label: 'Auto-pay on', tone: 'success' } : undefined,
    icon: getLoanIcon(loan.name),
  }))

  return (
    <DashboardSection title="Loans" count={loans.length} icon={Landmark}>
      {mappedLoans.map((loan) => (
        <PaymentCard key={loan.name} {...loan} />
      ))}
    </DashboardSection>
  )
}

function RecurringBillsSection({ billsPromise }: { billsPromise: Promise<RecurringBillData[]> }) {
  const bills = use(billsPromise)

  if (bills.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-900/15">
            <Receipt className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Recurring Bills</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">0</span>
        </div>
        <div className="rounded-2xl border border-emerald-100/60 bg-white p-12 text-center">
          <p className="text-gray-500">No recurring bills found.</p>
        </div>
      </section>
    )
  }

  const mappedBills: PaymentCardProps[] = bills.map((bill) => ({
    name: bill.name,
    provider: bill.provider,
    amountLabel: 'Amount',
    amountValue: formatCurrency(bill.amount),
    dateLabel: 'Due Date',
    dateValue: formatDate(bill.dueDate),
    metaLabel: 'Category:',
    metaValue: bill.category,
    status: bill.autoPay ? { label: 'Auto-pay on', tone: 'success' } : undefined,
    icon: getBillIcon(bill.category),
  }))

  return (
    <DashboardSection title="Recurring Bills" count={bills.length} icon={Receipt}>
      {mappedBills.map((bill) => (
        <PaymentCard key={bill.name} {...bill} />
      ))}
    </DashboardSection>
  )
}

// Loading fallbacks
function LoadingCard() {
  return (
    <div className="h-64 animate-pulse rounded-2xl border border-emerald-100/60 bg-white p-6">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded bg-gray-200"></div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-gray-200"></div>
          <div className="h-8 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-gray-200"></div>
          <div className="h-6 w-28 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

function LoadingSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200"></div>
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </section>
  )
}

function LoadingStats() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-emerald-200"></div>
      ))}
    </section>
  )
}

export function Dashboard() {
  // Fetch all data in parallel - these return promises that suspend rendering
  const statsPromise = getDashboardStatsFn()
  const cardsPromise = getCreditCardsFn()
  const loansPromise = getLoansFn()
  const billsPromise = getRecurringBillsFn()

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

        <Suspense fallback={<LoadingStats />}>
          <StatsSection statsPromise={statsPromise} />
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <CreditCardsSection cardsPromise={cardsPromise} />
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <LoansSection loansPromise={loansPromise} />
        </Suspense>

        <Suspense fallback={<LoadingSection />}>
          <RecurringBillsSection billsPromise={billsPromise} />
        </Suspense>
      </div>
    </main>
  )
}
