import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a demo user (you'll need to replace this with an actual user ID from your auth system)
  console.log('Seeding database with sample payment data...')

  const demoUserId = 'demo-user-id' // This should be a real user ID from your database

  // Seed Credit Cards
  await prisma.creditCard.createMany({
    data: [
      {
        userId: demoUserId,
        name: 'Chase Sapphire Reserve',
        provider: '••••4589',
        lastFourDigits: '4589',
        amountDue: 1247.5,
        dueDate: new Date('2026-01-18'),
        minimumPayment: 35.0,
        isPaid: false,
        isOverdue: false,
      },
      {
        userId: demoUserId,
        name: 'American Express Gold',
        provider: '••••8765',
        lastFourDigits: '8765',
        amountDue: 892.3,
        dueDate: new Date('2026-01-25'),
        minimumPayment: 25.0,
        isPaid: true,
        isOverdue: false,
      },
      {
        userId: demoUserId,
        name: 'Discover It',
        provider: '••••3421',
        lastFourDigits: '3421',
        amountDue: 456.75,
        dueDate: new Date('2026-01-12'),
        minimumPayment: 25.0,
        isPaid: false,
        isOverdue: true,
      },
    ],
  })

  // Seed Loans
  await prisma.loan.createMany({
    data: [
      {
        userId: demoUserId,
        name: 'Auto Loan',
        provider: 'Honda Finance',
        monthlyPayment: 485.0,
        nextPaymentDate: new Date('2026-01-20'),
        remainingBalance: 18250.0,
        isAutoPayOn: true,
      },
      {
        userId: demoUserId,
        name: 'Mortgage',
        provider: 'Wells Fargo',
        monthlyPayment: 2150.0,
        nextPaymentDate: new Date('2026-02-01'),
        remainingBalance: 325000.0,
        isAutoPayOn: true,
      },
      {
        userId: demoUserId,
        name: 'Student Loan',
        provider: 'Sallie Mae',
        monthlyPayment: 325.0,
        nextPaymentDate: new Date('2026-01-15'),
        remainingBalance: 28500.0,
        isAutoPayOn: false,
      },
    ],
  })

  // Seed Recurring Bills
  await prisma.recurringBill.createMany({
    data: [
      {
        userId: demoUserId,
        name: 'Internet',
        provider: 'Comcast Xfinity',
        amount: 89.99,
        dueDate: new Date('2026-01-10'),
        category: 'Utilities',
        isAutoPayOn: true,
      },
      {
        userId: demoUserId,
        name: 'Electric',
        provider: 'Pacific Gas & Electric',
        amount: 145.3,
        dueDate: new Date('2026-01-15'),
        category: 'Utilities',
        isAutoPayOn: true,
      },
      {
        userId: demoUserId,
        name: 'Phone Plan',
        provider: 'T-Mobile',
        amount: 75.0,
        dueDate: new Date('2026-01-22'),
        category: 'Utilities',
        isAutoPayOn: true,
      },
      {
        userId: demoUserId,
        name: 'Netflix Premium',
        provider: 'Netflix',
        amount: 19.99,
        dueDate: new Date('2026-01-08'),
        category: 'Subscription',
        isAutoPayOn: true,
      },
      {
        userId: demoUserId,
        name: 'Home Insurance',
        provider: 'State Farm',
        amount: 125.0,
        dueDate: new Date('2026-01-30'),
        category: 'Insurance',
        isAutoPayOn: true,
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
