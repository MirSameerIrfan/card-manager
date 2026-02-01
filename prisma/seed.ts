import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
    },
  })

  console.log('Created user:', user.email)

  // Seed Credit Cards
  const creditCards = [
    {
      userId: user.id,
      name: 'Chase Sapphire Reserve',
      provider: 'Chase',
      lastFourDigits: '4589',
      amountDue: 1247.5,
      dueDate: new Date('2026-01-18'),
      minimumPayment: 35.0,
      status: 'due_soon',
    },
    {
      userId: user.id,
      name: 'American Express Gold',
      provider: 'American Express',
      lastFourDigits: '8765',
      amountDue: 892.3,
      dueDate: new Date('2026-01-25'),
      minimumPayment: 25.0,
      status: 'paid',
    },
    {
      userId: user.id,
      name: 'Discover It',
      provider: 'Discover',
      lastFourDigits: '3421',
      amountDue: 456.75,
      dueDate: new Date('2026-01-12'),
      minimumPayment: 25.0,
      status: 'overdue',
    },
  ]

  for (const card of creditCards) {
    await prisma.creditCard.create({ data: card })
    console.log('Created credit card:', card.name)
  }

  // Seed Loans
  const loans = [
    {
      userId: user.id,
      name: 'Auto Loan',
      provider: 'Honda Finance',
      monthlyPayment: 485.0,
      nextPaymentDate: new Date('2026-01-20'),
      remainingBalance: 18250.0,
      autoPayEnabled: true,
    },
    {
      userId: user.id,
      name: 'Mortgage',
      provider: 'Wells Fargo',
      monthlyPayment: 2150.0,
      nextPaymentDate: new Date('2026-02-01'),
      remainingBalance: 325000.0,
      autoPayEnabled: true,
    },
    {
      userId: user.id,
      name: 'Student Loan',
      provider: 'Sallie Mae',
      monthlyPayment: 325.0,
      nextPaymentDate: new Date('2026-01-15'),
      remainingBalance: 28500.0,
      autoPayEnabled: false,
    },
  ]

  for (const loan of loans) {
    await prisma.loan.create({ data: loan })
    console.log('Created loan:', loan.name)
  }

  // Seed Recurring Bills
  const recurringBills = [
    {
      userId: user.id,
      name: 'Internet',
      provider: 'Comcast Xfinity',
      amount: 89.99,
      dueDate: new Date('2026-01-10'),
      category: 'Utilities',
      autoPayEnabled: true,
    },
    {
      userId: user.id,
      name: 'Electric',
      provider: 'Pacific Gas & Electric',
      amount: 145.3,
      dueDate: new Date('2026-01-15'),
      category: 'Utilities',
      autoPayEnabled: true,
    },
    {
      userId: user.id,
      name: 'Phone Plan',
      provider: 'T-Mobile',
      amount: 75.0,
      dueDate: new Date('2026-01-22'),
      category: 'Utilities',
      autoPayEnabled: true,
    },
    {
      userId: user.id,
      name: 'Netflix Premium',
      provider: 'Netflix',
      amount: 19.99,
      dueDate: new Date('2026-01-08'),
      category: 'Subscription',
      autoPayEnabled: true,
    },
    {
      userId: user.id,
      name: 'Home Insurance',
      provider: 'State Farm',
      amount: 125.0,
      dueDate: new Date('2026-01-30'),
      category: 'Insurance',
      autoPayEnabled: true,
    },
  ]

  for (const bill of recurringBills) {
    await prisma.recurringBill.create({ data: bill })
    console.log('Created recurring bill:', bill.name)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
