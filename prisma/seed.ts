// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@cardmanager.com' },
    update: {},
    create: {
      id: 'demo-user-id',
      email: 'demo@cardmanager.com',
      name: 'Demo User',
      emailVerified: true,
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create Credit Cards
  const creditCard1 = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'CREDIT_CARD',
      name: 'Chase Sapphire Reserve',
      provider: 'Chase',
      last4: '4589',
      autopay: false,
      currency: 'USD',
      creditCard: {
        create: {
          currentBalance: 1247.50,
          minimumPayment: 35.00,
          creditLimit: 25000,
          statementDate: new Date('2026-01-05'),
          statementDayOfMonth: 5,
          dueDate: new Date('2026-01-18'),
          dueDayOfMonth: 18,
        },
      },
    },
  })

  const creditCard2 = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'CREDIT_CARD',
      name: 'American Express Gold',
      provider: 'American Express',
      last4: '8765',
      autopay: true,
      currency: 'USD',
      creditCard: {
        create: {
          currentBalance: 0, // Paid
          minimumPayment: 25.00,
          creditLimit: 15000,
          statementDate: new Date('2025-12-30'),
          statementDayOfMonth: 30,
          dueDate: new Date('2026-01-25'),
          dueDayOfMonth: 25,
        },
      },
    },
  })

  const creditCard3 = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'CREDIT_CARD',
      name: 'Discover It',
      provider: 'Discover',
      last4: '3421',
      autopay: false,
      currency: 'USD',
      creditCard: {
        create: {
          currentBalance: 456.75,
          minimumPayment: 25.00,
          creditLimit: 10000,
          statementDate: new Date('2025-12-25'),
          statementDayOfMonth: 25,
          dueDate: new Date('2026-01-12'),
          dueDayOfMonth: 12,
        },
      },
    },
  })

  console.log('✅ Created 3 credit cards')

  // Create Loans
  const autoLoan = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'LOAN',
      name: 'Auto Loan',
      provider: 'Honda Finance',
      autopay: true,
      currency: 'USD',
      loan: {
        create: {
          type: 'AUTO',
          monthlyPayment: 485.00,
          remainingBalance: 18250.00,
          nextPaymentDate: new Date('2026-01-20'),
        },
      },
    },
  })

  const mortgage = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'LOAN',
      name: 'Mortgage',
      provider: 'Wells Fargo',
      autopay: true,
      currency: 'USD',
      loan: {
        create: {
          type: 'MORTGAGE',
          monthlyPayment: 2150.00,
          remainingBalance: 325000.00,
          nextPaymentDate: new Date('2026-02-01'),
        },
      },
    },
  })

  const studentLoan = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'LOAN',
      name: 'Student Loan',
      provider: 'Sallie Mae',
      autopay: false,
      currency: 'USD',
      loan: {
        create: {
          type: 'STUDENT',
          monthlyPayment: 325.00,
          remainingBalance: 28500.00,
          nextPaymentDate: new Date('2026-01-15'),
        },
      },
    },
  })

  console.log('✅ Created 3 loans')

  // Create Recurring Bills
  const internet = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'RECURRING_BILL',
      name: 'Internet',
      provider: 'Comcast Xfinity',
      autopay: true,
      currency: 'USD',
      recurringBill: {
        create: {
          amount: 89.99,
          cadence: 'MONTHLY',
          category: 'INTERNET',
          dueDay: 10,
        },
      },
    },
  })

  const electric = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'RECURRING_BILL',
      name: 'Electric',
      provider: 'Pacific Gas & Electric',
      autopay: true,
      currency: 'USD',
      recurringBill: {
        create: {
          amount: 145.30,
          cadence: 'MONTHLY',
          category: 'UTILITIES',
          dueDay: 15,
        },
      },
    },
  })

  const phone = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'RECURRING_BILL',
      name: 'Phone Plan',
      provider: 'T-Mobile',
      autopay: true,
      currency: 'USD',
      recurringBill: {
        create: {
          amount: 75.00,
          cadence: 'MONTHLY',
          category: 'PHONE',
          dueDay: 22,
        },
      },
    },
  })

  const netflix = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'RECURRING_BILL',
      name: 'Netflix Premium',
      provider: 'Netflix',
      autopay: true,
      currency: 'USD',
      recurringBill: {
        create: {
          amount: 19.99,
          cadence: 'MONTHLY',
          category: 'SUBSCRIPTION',
          dueDay: 8,
        },
      },
    },
  })

  const insurance = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      type: 'RECURRING_BILL',
      name: 'Home Insurance',
      provider: 'State Farm',
      autopay: true,
      currency: 'USD',
      recurringBill: {
        create: {
          amount: 125.00,
          cadence: 'MONTHLY',
          category: 'INSURANCE',
          dueDay: 30,
        },
      },
    },
  })

  console.log('✅ Created 5 recurring bills')

  // Create some payment records
  await prisma.payment.create({
    data: {
      accountId: creditCard1.id,
      amountDue: 1247.50,
      currency: 'USD',
      dueDate: new Date('2026-01-18'),
      status: 'DUE_SOON',
    },
  })

  await prisma.payment.create({
    data: {
      accountId: creditCard3.id,
      amountDue: 456.75,
      currency: 'USD',
      dueDate: new Date('2026-01-12'),
      status: 'OVERDUE',
    },
  })

  await prisma.payment.create({
    data: {
      accountId: autoLoan.id,
      amountDue: 485.00,
      currency: 'USD',
      dueDate: new Date('2026-01-20'),
      status: 'UPCOMING',
    },
  })

  console.log('✅ Created sample payment records')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
