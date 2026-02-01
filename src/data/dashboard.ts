import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/utils/auth'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Singleton pattern for PrismaClient to avoid connection pool exhaustion
let prisma: PrismaClient

function getPrismaClient() {
  if (!prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    })
    prisma = new PrismaClient({ adapter })
  }
  return prisma
}

export const getDashboardDataFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const req = getRequest()
  const session = await auth.api.getSession({
    headers: Object.fromEntries(req.headers.entries()),
  })

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.id
  const db = getPrismaClient()

  const [creditCards, loans, recurringBills] = await Promise.all([
    db.creditCard.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
    }),
    db.loan.findMany({
      where: { userId },
      orderBy: { nextPaymentDate: 'asc' },
    }),
    db.recurringBill.findMany({
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
