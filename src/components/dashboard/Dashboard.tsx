import { use, Suspense } from 'react'
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
import { getDashboardDataFn } from '@/data/dashboard'

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

// Helper functions to transform database data to PaymentCardProps format
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

function getStatusFromCreditCardStatus(
  status: string
): PaymentCardProps['status'] | undefined {
  switch (status) {
    case 'due_soon':
      return { label: 'Due Soon', tone: 'warning' }
    case 'paid':
      return { label: 'Paid', tone: 'success' }
    case 'overdue':
      return { label: 'Overdue', tone: 'danger' }
    default:
      return undefined
  }
}

// Map category names to icons
function getIconForCategory(category: string): React.ComponentType<{ className?: string }> {
  const lowerCategory = category.toLowerCase()
  if (lowerCategory.includes('internet') || lowerCategory.includes('wifi')) {
    return Wifi
  }
  if (lowerCategory.includes('phone') || lowerCategory.includes('mobile')) {
    return Smartphone
  }
  return Receipt
}

// Map loan names to icons
function getIconForLoan(name: string): React.ComponentType<{ className?: string }> {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('auto') || lowerName.includes('car')) {
    return Landmark
  }
  if (lowerName.includes('mortgage') || lowerName.includes('home')) {
    return Home
  }
  if (lowerName.includes('student') || lowerName.includes('education')) {
    return Building2
  }
  return Landmark
}

type DashboardData = {
  creditCards: Array<{
    id: string
    name: string
    provider: string
    lastFourDigits: string
    amountDue: number
    dueDate: Date
    minimumPayment: number
    status: string
  }>
  loans: Array<{
    id: string
    name: string
    provider: string
    monthlyPayment: number
    nextPaymentDate: Date
    remainingBalance: number
    autoPayEnabled: boolean
  }>
  recurringBills: Array<{
    id: string
    name: string
    provider: string
    amount: number
    dueDate: Date
    category: string
    autoPayEnabled: boolean
  }>
}

function transformDashboardData(data: DashboardData) {
  // Transform credit cards
  const creditCards: PaymentCardProps[] = data.creditCards.map((card) => ({
    name: card.name,
    provider: `••••${card.lastFourDigits}`,
    amountLabel: 'Amount Due',
    amountValue: formatCurrency(card.amountDue),
    dateLabel: 'Due Date',
    dateValue: formatDate(card.dueDate),
    metaLabel: 'Minimum payment:',
    metaValue: formatCurrency(card.minimumPayment),
    status: getStatusFromCreditCardStatus(card.status),
    icon: CreditCard,
  }))

  // Transform loans
  const loans: PaymentCardProps[] = data.loans.map((loan) => ({
    name: loan.name,
    provider: loan.provider,
    amountLabel: 'Monthly Payment',
    amountValue: formatCurrency(loan.monthlyPayment),
    dateLabel: 'Next Payment',
    dateValue: formatDate(loan.nextPaymentDate),
    metaLabel: 'Remaining balance:',
    metaValue: formatCurrency(loan.remainingBalance),
    status: loan.autoPayEnabled
      ? { label: 'Auto-pay on', tone: 'success' }
      : undefined,
    icon: getIconForLoan(loan.name),
  }))

  // Transform recurring bills
  const recurringBills: PaymentCardProps[] = data.recurringBills.map((bill) => ({
    name: bill.name,
    provider: bill.provider,
    amountLabel: 'Amount',
    amountValue: formatCurrency(bill.amount),
    dateLabel: 'Due Date',
    dateValue: formatDate(bill.dueDate),
    metaLabel: 'Category:',
    metaValue: bill.category,
    status: bill.autoPayEnabled
      ? { label: 'Auto-pay on', tone: 'success' }
      : undefined,
    icon: getIconForCategory(bill.category),
  }))

  // Calculate stats
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Total due this month: credit cards + loans + recurring bills due this month
  const creditCardsDueThisMonth = data.creditCards
    .filter((card) => new Date(card.dueDate) <= endOfMonth)
    .reduce((sum, card) => sum + card.amountDue, 0)

  const loansDueThisMonth = data.loans
    .filter((loan) => new Date(loan.nextPaymentDate) <= endOfMonth)
    .reduce((sum, loan) => sum + loan.monthlyPayment, 0)

  const billsDueThisMonth = data.recurringBills
    .filter((bill) => new Date(bill.dueDate) <= endOfMonth)
    .reduce((sum, bill) => sum + bill.amount, 0)

  const totalDueThisMonth = creditCardsDueThisMonth + loansDueThisMonth + billsDueThisMonth

  // Upcoming payments: count items due within next 7 days
  const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingPayments =
    data.creditCards.filter(
      (card) => new Date(card.dueDate) >= now && new Date(card.dueDate) <= next7Days
    ).length +
    data.loans.filter(
      (loan) =>
        new Date(loan.nextPaymentDate) >= now && new Date(loan.nextPaymentDate) <= next7Days
    ).length +
    data.recurringBills.filter(
      (bill) => new Date(bill.dueDate) >= now && new Date(bill.dueDate) <= next7Days
    ).length

  // Auto-pay active: count loans and bills with auto-pay enabled
  const autoPayActive =
    data.loans.filter((loan) => loan.autoPayEnabled).length +
    data.recurringBills.filter((bill) => bill.autoPayEnabled).length

  const stats: StatCardProps[] = [
    {
      label: 'Total Due This Month',
      value: formatCurrency(totalDueThisMonth),
      icon: DollarSign,
      tone: 'emerald',
    },
    {
      label: 'Upcoming Payments',
      value: upcomingPayments.toString(),
      icon: Bell,
      tone: 'teal',
    },
    {
      label: 'Auto-Pay Active',
      value: autoPayActive.toString(),
      icon: ArrowUpRight,
      tone: 'cyan',
    },
  ]

  return { stats, creditCards, loans, recurringBills }
}

function DashboardContent() {
  // Use the use() hook to fetch data - suspends until data is ready
  const dashboardDataPromise = getDashboardDataFn()
  const data = use(dashboardDataPromise)

  // Transform database data to match UI format
  const { stats, creditCards, loans, recurringBills } = transformDashboardData(data)

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

export function Dashboard() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-20">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto" />
                <p className="text-lg font-semibold text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
