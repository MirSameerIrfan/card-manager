import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Find or create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
    },
  })

  console.log('✅ Created/found test user:', testUser.email)

  // Clear existing data for this user
  await prisma.creditCard.deleteMany({ where: { userId: testUser.id } })
  await prisma.loan.deleteMany({ where: { userId: testUser.id } })
  await prisma.recurringBill.deleteMany({ where: { userId: testUser.id } })

  console.log('🧹 Cleared existing payment data')

  // Seed Credit Cards
  const creditCards = await Promise.all([
    prisma.creditCard.create({
      data: {
        userId: testUser.id,
        name: 'Chase Sapphire Reserve',
        provider: '••••4589',
        amountDue: 1247.50,
        dueDate: new Date('2026-01-18'),
        minimumPayment: 35.00,
        status: 'due_soon',
      },
    }),
    prisma.creditCard.create({
      data: {
        userId: testUser.id,
        name: 'American Express Gold',
        provider: '••••8765',
        amountDue: 892.30,
        dueDate: new Date('2026-01-25'),
        minimumPayment: 25.00,
        status: 'paid',
      },
    }),
    prisma.creditCard.create({
      data: {
        userId: testUser.id,
        name: 'Discover It',
        provider: '••••3421',
        amountDue: 456.75,
        dueDate: new Date('2026-01-12'),
        minimumPayment: 25.00,
        status: 'overdue',
      },
    }),
  ])

  console.log('💳 Created', creditCards.length, 'credit cards')

  // Seed Loans
  const loans = await Promise.all([
    prisma.loan.create({
      data: {
        userId: testUser.id,
        name: 'Auto Loan',
        provider: 'Honda Finance',
        monthlyPayment: 485.00,
        nextPayment: new Date('2026-01-20'),
        remainingBalance: 18250.00,
        autoPay: true,
      },
    }),
    prisma.loan.create({
      data: {
        userId: testUser.id,
        name: 'Mortgage',
        provider: 'Wells Fargo',
        monthlyPayment: 2150.00,
        nextPayment: new Date('2026-02-01'),
        remainingBalance: 325000.00,
        autoPay: true,
      },
    }),
    prisma.loan.create({
      data: {
        userId: testUser.id,
        name: 'Student Loan',
        provider: 'Sallie Mae',
        monthlyPayment: 325.00,
        nextPayment: new Date('2026-01-15'),
        remainingBalance: 28500.00,
        autoPay: false,
      },
    }),
  ])

  console.log('🏦 Created', loans.length, 'loans')

  // Seed Recurring Bills
  const bills = await Promise.all([
    prisma.recurringBill.create({
      data: {
        userId: testUser.id,
        name: 'Internet',
        provider: 'Comcast Xfinity',
        amount: 89.99,
        dueDate: new Date('2026-01-10'),
        category: 'Utilities',
        autoPay: true,
      },
    }),
    prisma.recurringBill.create({
      data: {
        userId: testUser.id,
        name: 'Electric',
        provider: 'Pacific Gas & Electric',
        amount: 145.30,
        dueDate: new Date('2026-01-15'),
        category: 'Utilities',
        autoPay: true,
      },
    }),
    prisma.recurringBill.create({
      data: {
        userId: testUser.id,
        name: 'Phone Plan',
        provider: 'T-Mobile',
        amount: 75.00,
        dueDate: new Date('2026-01-22'),
        category: 'Utilities',
        autoPay: true,
      },
    }),
    prisma.recurringBill.create({
      data: {
        userId: testUser.id,
        name: 'Netflix Premium',
        provider: 'Netflix',
        amount: 19.99,
        dueDate: new Date('2026-01-08'),
        category: 'Subscription',
        autoPay: true,
      },
    }),
    prisma.recurringBill.create({
      data: {
        userId: testUser.id,
        name: 'Home Insurance',
        provider: 'State Farm',
        amount: 125.00,
        dueDate: new Date('2026-01-30'),
        category: 'Insurance',
        autoPay: true,
      },
    }),
  ])

  console.log('📄 Created', bills.length, 'recurring bills')

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
