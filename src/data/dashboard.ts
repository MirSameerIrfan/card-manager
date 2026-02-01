// src/data/dashboard.ts
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/db'
import type { 
  LoanType, 
  BillCategory 
} from '../../generated/prisma/client'

// Types for the dashboard data
export type DashboardStats = {
  totalDueThisMonth: number
  upcomingPayments: number
  autoPayActive: number
}

export type CreditCardData = {
  id: string
  name: string
  provider: string
  last4: string | null
  currentBalance: number
  minimumPayment: number
  dueDate: Date
  isPaid: boolean
  isOverdue: boolean
  isDueSoon: boolean
  autopay: boolean
}

export type LoanData = {
  id: string
  name: string
  provider: string
  type: LoanType
  monthlyPayment: number
  remainingBalance: number
  nextPaymentDate: Date
  autopay: boolean
}

export type RecurringBillData = {
  id: string
  name: string
  provider: string
  category: BillCategory
  amount: number
  dueDay: number
  nextDueDate: Date
  autopay: boolean
}

// Server function to get dashboard statistics
export const getDashboardStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      // Get current month date range
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      // Get all payments for current month
      const paymentsThisMonth = await prisma.payment.findMany({
        where: {
          dueDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      })

      // Calculate total due this month
      const totalDueThisMonth = paymentsThisMonth.reduce(
        (sum, payment) => sum + Number(payment.amountDue),
        0
      )

      // Get upcoming payments (next 7 days, not paid)
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      
      const upcomingPaymentsCount = await prisma.payment.count({
        where: {
          dueDate: {
            gte: now,
            lte: sevenDaysFromNow,
          },
          status: {
            in: ['UPCOMING', 'DUE_SOON'],
          },
        },
      })

      // Count accounts with autopay enabled
      const autoPayCount = await prisma.financialAccount.count({
        where: {
          autopay: true,
          isActive: true,
        },
      })

      return {
        totalDueThisMonth,
        upcomingPayments: upcomingPaymentsCount,
        autoPayActive: autoPayCount,
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalDueThisMonth: 0,
        upcomingPayments: 0,
        autoPayActive: 0,
      }
    }
  }
)

// Server function to get credit cards
export const getCreditCards = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const accounts = await prisma.financialAccount.findMany({
        where: {
          type: 'CREDIT_CARD',
          isActive: true,
        },
        include: {
          creditCard: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const now = new Date()
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

      return accounts.map((account) => {
        const card = account.creditCard!
        const dueDate = new Date(card.dueDate)
        const isOverdue = dueDate < now
        const isDueSoon = dueDate >= now && dueDate <= sevenDaysFromNow
        const isPaid = Number(card.currentBalance) === 0

        return {
          id: account.id,
          name: account.name,
          provider: account.last4 ? `••••${account.last4}` : account.provider,
          last4: account.last4,
          currentBalance: Number(card.currentBalance),
          minimumPayment: Number(card.minimumPayment),
          dueDate,
          isPaid,
          isOverdue,
          isDueSoon,
          autopay: account.autopay,
        }
      })
    } catch (error) {
      console.error('Error fetching credit cards:', error)
      return []
    }
  }
)

// Server function to get loans
export const getLoans = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const accounts = await prisma.financialAccount.findMany({
      where: {
        type: 'LOAN',
        isActive: true,
      },
      include: {
        loan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return accounts.map((account) => {
      const loan = account.loan!
      return {
        id: account.id,
        name: account.name,
        provider: account.provider,
        type: loan.type,
        monthlyPayment: Number(loan.monthlyPayment),
        remainingBalance: Number(loan.remainingBalance),
        nextPaymentDate: new Date(loan.nextPaymentDate),
        autopay: account.autopay,
      }
    })
  } catch (error) {
    console.error('Error fetching loans:', error)
    return []
  }
})

// Server function to get recurring bills
export const getRecurringBills = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const accounts = await prisma.financialAccount.findMany({
        where: {
          type: 'RECURRING_BILL',
          isActive: true,
        },
        include: {
          recurringBill: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const now = new Date()
      
      return accounts.map((account) => {
        const bill = account.recurringBill!
        
        // Calculate next due date based on dueDay
        const nextDueDate = new Date(now.getFullYear(), now.getMonth(), bill.dueDay)
        if (nextDueDate < now) {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1)
        }

        return {
          id: account.id,
          name: account.name,
          provider: account.provider,
          category: bill.category,
          amount: Number(bill.amount),
          dueDay: bill.dueDay,
          nextDueDate,
          autopay: account.autopay,
        }
      })
    } catch (error) {
      console.error('Error fetching recurring bills:', error)
      return []
    }
  }
)
