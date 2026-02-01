import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/utils/prisma'
import { getCurrentUserServer } from '@/utils/auth.server'

export const getCreditCardsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getCurrentUserServer()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const creditCards = await prisma.creditCard.findMany({
    where: { userId: user.id },
    orderBy: { dueDate: 'asc' },
  })

  return creditCards
})

export const getLoansFn = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getCurrentUserServer()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const loans = await prisma.loan.findMany({
    where: { userId: user.id },
    orderBy: { nextPaymentDate: 'asc' },
  })

  return loans
})

export const getRecurringBillsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getCurrentUserServer()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const bills = await prisma.recurringBill.findMany({
    where: { userId: user.id },
    orderBy: { dueDate: 'asc' },
  })

  return bills
})

export const getPaymentStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getCurrentUserServer()
  if (!user) {
    throw new Error('Unauthorized')
  }

  // Get current month start and end dates
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Get credit cards due this month
  const creditCards = await prisma.creditCard.findMany({
    where: {
      userId: user.id,
      dueDate: {
        gte: monthStart,
        lte: monthEnd,
      },
      isPaid: false,
    },
  })

  // Get loans with next payment this month
  const loans = await prisma.loan.findMany({
    where: {
      userId: user.id,
      nextPaymentDate: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })

  // Get recurring bills due this month
  const bills = await prisma.recurringBill.findMany({
    where: {
      userId: user.id,
      dueDate: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  })

  // Calculate total due this month
  const totalDue =
    creditCards.reduce((sum, card) => sum + card.amountDue, 0) +
    loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0) +
    bills.reduce((sum, bill) => sum + bill.amount, 0)

  // Calculate upcoming payments (next 7 days)
  const weekFromNow = new Date()
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  const upcomingCreditCards = creditCards.filter(
    (card) => card.dueDate <= weekFromNow && !card.isPaid
  ).length

  const upcomingLoans = loans.filter((loan) => loan.nextPaymentDate <= weekFromNow).length

  const upcomingBills = bills.filter((bill) => bill.dueDate <= weekFromNow).length

  const upcomingPayments = upcomingCreditCards + upcomingLoans + upcomingBills

  // Count auto-pay active
  const autoPayLoans = await prisma.loan.count({
    where: {
      userId: user.id,
      isAutoPayOn: true,
    },
  })

  const autoPayBills = await prisma.recurringBill.count({
    where: {
      userId: user.id,
      isAutoPayOn: true,
    },
  })

  const autoPayActive = autoPayLoans + autoPayBills

  return {
    totalDue,
    upcomingPayments,
    autoPayActive,
  }
})
