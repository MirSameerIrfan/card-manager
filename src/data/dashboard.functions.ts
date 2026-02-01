import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/utils/auth'
import { prisma } from './db'

// Type definitions matching the dashboard component's expectations
export interface CreditCardData {
  id: string
  name: string
  provider: string
  amountDue: number
  dueDate: Date
  minimumPayment: number
  status: 'due_soon' | 'paid' | 'overdue'
}

export interface LoanData {
  id: string
  name: string
  provider: string
  monthlyPayment: number
  nextPayment: Date
  remainingBalance: number
  autoPay: boolean
}

export interface RecurringBillData {
  id: string
  name: string
  provider: string
  amount: number
  dueDate: Date
  category: string
  autoPay: boolean
}

export interface DashboardStats {
  totalDue: number
  upcomingPayments: number
  autoPayActive: number
}

// Helper to get authenticated user
async function getAuthenticatedUserId(): Promise<string | null> {
  const req = getRequest()
  const session = await auth.api.getSession({
    headers: Object.fromEntries(req.headers.entries()),
  })
  return session?.user?.id || null
}

// Get user's credit cards
export const getCreditCardsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const cards = await prisma.creditCard.findMany({
    where: { userId },
    orderBy: { dueDate: 'asc' },
  })

  return cards as CreditCardData[]
})

// Get user's loans
export const getLoansFn = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const loans = await prisma.loan.findMany({
    where: { userId },
    orderBy: { nextPayment: 'asc' },
  })

  return loans as LoanData[]
})

// Get user's recurring bills
export const getRecurringBillsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const bills = await prisma.recurringBill.findMany({
    where: { userId },
    orderBy: { dueDate: 'asc' },
  })

  return bills as RecurringBillData[]
})

// Get dashboard statistics
export const getDashboardStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getAuthenticatedUserId()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Get all data in parallel
  const [creditCards, loans, bills] = await Promise.all([
    prisma.creditCard.findMany({ where: { userId } }),
    prisma.loan.findMany({ where: { userId } }),
    prisma.recurringBill.findMany({ where: { userId } }),
  ])

  // Calculate total due (credit cards + current month's payments)
  const creditCardsDue = creditCards
    .filter((card) => card.status !== 'paid')
    .reduce((sum, card) => sum + card.amountDue, 0)

  const loansDue = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
  const billsDue = bills.reduce((sum, bill) => sum + bill.amount, 0)

  const totalDue = creditCardsDue + loansDue + billsDue

  // Count upcoming payments (within next 7 days)
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcomingCreditCards = creditCards.filter((card) => {
    const dueDate = new Date(card.dueDate)
    return dueDate >= now && dueDate <= nextWeek && card.status !== 'paid'
  }).length

  const upcomingLoans = loans.filter((loan) => {
    const paymentDate = new Date(loan.nextPayment)
    return paymentDate >= now && paymentDate <= nextWeek
  }).length

  const upcomingBills = bills.filter((bill) => {
    const dueDate = new Date(bill.dueDate)
    return dueDate >= now && dueDate <= nextWeek
  }).length

  const upcomingPayments = upcomingCreditCards + upcomingLoans + upcomingBills

  // Count auto-pay enabled items
  const autoPayActive = loans.filter((loan) => loan.autoPay).length + bills.filter((bill) => bill.autoPay).length

  return {
    totalDue,
    upcomingPayments,
    autoPayActive,
  } as DashboardStats
})
