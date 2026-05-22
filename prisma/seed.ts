import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import 'dotenv/config'
import { auth } from '../src/utils/auth'
import { randomUUID } from 'crypto';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding ...')

    // 1. Cleanup existing demo user data to avoid conflicts
    const existingUser = await prisma.user.findUnique({
        where: { email: 'demo@example.com' }
    });

    if (existingUser) {
        console.log('Deleting existing demo user...');
        await prisma.user.delete({
            where: { email: 'demo@example.com' }
        });
    }

    // 2. Create User via Better Auth
    console.log('Creating user via Auth...');

    let user;
    try {
        // Create user
        const response = await auth.api.signUpEmail({
            body: {
                email: 'demo@example.com',
                password: 'password1234',
                name: 'Demo User',
            },
            asResponse: false
        });
        user = response?.user;

        if (!user) {
            console.log('User creation check...');
            const u = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
            user = u;
        }
    } catch (e) {
        console.error('Error creating user via auth:', e);
        user = await prisma.user.findUnique({
            where: { email: 'demo@example.com' }
        });
    }

    if (!user) {
        throw new Error("Failed to create or find user");
    }

    console.log(`User ready: ${user.email} (${user.id})`)

    const userId = user.id;

    // 3. Credit Cards
    console.log('Seeding Credit Cards...');
    await prisma.credit_card.createMany({
        data: [
            {
                id: randomUUID(),
                userId,
                name: 'Chase Sapphire Reserve',
                provider: '••••4589',
                amountDue: 1247.50,
                dueDate: new Date('2026-01-18'),
                minimumPayment: 35.00,
                status: 'Due Soon', // Warning tone
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'American Express Gold',
                provider: '••••8765',
                amountDue: 892.30,
                dueDate: new Date('2026-01-25'),
                minimumPayment: 25.00,
                status: 'Paid', // Success tone
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'Discover It',
                provider: '••••3421',
                amountDue: 456.75,
                dueDate: new Date('2026-01-12'),
                minimumPayment: 25.00,
                status: 'Overdue', // Danger tone
                updatedAt: new Date(),
            }
        ]
    })

    // 4. Loans
    console.log('Seeding Loans...');
    await prisma.loan.createMany({
        data: [
            {
                id: randomUUID(),
                userId,
                name: 'Auto Loan',
                provider: 'Honda Finance',
                monthlyPayment: 485.00,
                nextPayment: new Date('2026-01-20'),
                remainingBalance: 18250.00,
                autoPay: true,
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'Mortgage',
                provider: 'Wells Fargo',
                monthlyPayment: 2150.00,
                nextPayment: new Date('2026-02-01'),
                remainingBalance: 325000.00,
                autoPay: true,
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'Student Loan',
                provider: 'Sallie Mae',
                monthlyPayment: 325.00,
                nextPayment: new Date('2026-01-15'),
                remainingBalance: 28500.00,
                autoPay: false,
                updatedAt: new Date(),
            }
        ]
    })

    // 5. Recurring Bills
    console.log('Seeding Recurring Bills...');
    await prisma.recurring_bill.createMany({
        data: [
            {
                id: randomUUID(),
                userId,
                name: 'Internet',
                provider: 'Comcast Xfinity',
                amount: 89.99,
                dueDate: new Date('2026-01-10'),
                category: 'Utilities',
                frequency: 'monthly',
                autoPay: true,
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'Electric',
                provider: 'Pacific Gas & Electric',
                amount: 145.30,
                dueDate: new Date('2026-01-15'),
                category: 'Utilities',
                frequency: 'monthly',
                autoPay: true,
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'Phone Plan',
                provider: 'T-Mobile',
                amount: 75.00,
                dueDate: new Date('2026-01-22'),
                category: 'Utilities',
                frequency: 'biweekly',
                autoPay: true,
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'Netflix Premium',
                provider: 'Netflix',
                amount: 19.99,
                dueDate: new Date('2026-01-08'),
                category: 'Subscription',
                frequency: 'monthly',
                autoPay: true,
                updatedAt: new Date(),
            },
            {
                id: randomUUID(),
                userId,
                name: 'Home Insurance',
                provider: 'State Farm',
                amount: 125.00,
                dueDate: new Date('2026-01-30'),
                category: 'Insurance',
                frequency: 'monthly',
                autoPay: true,
                updatedAt: new Date(),
            }
        ]
    })

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
