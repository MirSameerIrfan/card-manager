import { createServerFn } from '@tanstack/react-start'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

export const getDashboardDataFn = createServerFn({
  method: 'GET',
}).handler(async ({ context }) => {
  const session = context.session
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.id

  const [creditCards, loans, recurringBills] = await Promise.all([
    prisma.creditCard.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
    }),
    prisma.loan.findMany({
      where: { userId },
      orderBy: { nextPaymentDate: 'asc' },
    }),
    prisma.recurringBill.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
    }),
  ])

  return {
    creditCards,
    loans,
    recurringBills,
  }
})
