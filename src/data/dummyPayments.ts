import { CreditCard, Loan, Bill } from '@/types/payment'

export const dummyCreditCards: CreditCard[] = [
  {
    id: 'cc-1',
    name: 'Chase Sapphire Preferred',
    lastFour: '4589',
    dueDate: '2026-01-15',
    amountDue: 1247.50,
    status: 'due-soon',
    creditLimit: 10000,
    currentBalance: 3425.50,
    minPayment: 35.00,
    brand: 'visa'
  },
  {
    id: 'cc-2',
    name: 'American Express Gold',
    lastFour: '1008',
    dueDate: '2026-01-22',
    amountDue: 892.75,
    status: 'upcoming',
    creditLimit: 15000,
    currentBalance: 2150.25,
    minPayment: 25.00,
    brand: 'amex'
  },
  {
    id: 'cc-3',
    name: 'Citi Double Cash',
    lastFour: '7722',
    dueDate: '2026-01-08',
    amountDue: 450.00,
    status: 'overdue',
    creditLimit: 8000,
    currentBalance: 1890.00,
    minPayment: 25.00,
    brand: 'mastercard'
  },
  {
    id: 'cc-4',
    name: 'Capital One Venture',
    lastFour: '3344',
    dueDate: '2025-12-28',
    amountDue: 0,
    status: 'paid',
    creditLimit: 12000,
    currentBalance: 0,
    minPayment: 0,
    brand: 'visa'
  }
]

export const dummyLoans: Loan[] = [
  {
    id: 'loan-1',
    name: 'Car Loan',
    type: 'auto',
    lender: 'Honda Finance',
    monthlyPayment: 485.00,
    dueDate: '2026-01-20',
    status: 'upcoming',
    remainingBalance: 18540.00,
    interestRate: 4.2,
    autoPay: true
  },
  {
    id: 'loan-2',
    name: 'Home Mortgage',
    type: 'home',
    lender: 'Wells Fargo',
    monthlyPayment: 1850.00,
    dueDate: '2026-01-01',
    status: 'paid',
    remainingBalance: 285000.00,
    interestRate: 3.5,
    autoPay: true
  },
  {
    id: 'loan-3',
    name: 'Student Loan',
    type: 'student',
    lender: 'Federal Loans',
    monthlyPayment: 320.00,
    dueDate: '2026-01-18',
    status: 'due-soon',
    remainingBalance: 24500.00,
    interestRate: 5.8,
    autoPay: false
  },
  {
    id: 'loan-4',
    name: 'Personal Loan',
    type: 'personal',
    lender: 'Marcus by Goldman Sachs',
    monthlyPayment: 275.00,
    dueDate: '2026-01-12',
    status: 'overdue',
    remainingBalance: 4800.00,
    interestRate: 6.99,
    autoPay: false
  }
]

export const dummyBills: Bill[] = [
  {
    id: 'bill-1',
    name: 'Electric Bill',
    type: 'utilities',
    provider: 'PG&E',
    amount: 125.50,
    dueDate: '2026-01-25',
    status: 'upcoming',
    recurring: true,
    autoPay: true
  },
  {
    id: 'bill-2',
    name: 'Internet',
    type: 'internet',
    provider: 'Comcast Xfinity',
    amount: 89.99,
    dueDate: '2026-01-15',
    status: 'due-soon',
    recurring: true,
    autoPay: false
  },
  {
    id: 'bill-3',
    name: 'Phone',
    type: 'phone',
    provider: 'Verizon',
    amount: 65.00,
    dueDate: '2026-01-10',
    status: 'overdue',
    recurring: true,
    autoPay: false
  },
  {
    id: 'bill-4',
    name: 'Car Insurance',
    type: 'insurance',
    provider: 'State Farm',
    amount: 145.00,
    dueDate: '2026-01-05',
    status: 'paid',
    recurring: true,
    autoPay: true
  },
  {
    id: 'bill-5',
    name: 'Netflix',
    type: 'subscription',
    provider: 'Netflix',
    amount: 15.99,
    dueDate: '2026-01-20',
    status: 'upcoming',
    recurring: true,
    autoPay: true
  },
  {
    id: 'bill-6',
    name: 'Spotify',
    type: 'subscription',
    provider: 'Spotify',
    amount: 10.99,
    dueDate: '2026-01-15',
    status: 'due-soon',
    recurring: true,
    autoPay: true
  }
]
