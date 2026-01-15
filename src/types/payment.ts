export type PaymentStatus = 'paid' | 'due-soon' | 'overdue' | 'upcoming'

export interface CreditCard {
  id: string
  name: string
  lastFour: string
  dueDate: string
  amountDue: number
  status: PaymentStatus
  creditLimit: number
  currentBalance: number
  minPayment: number
  brand: 'visa' | 'mastercard' | 'amex' | 'discover'
}

export interface Loan {
  id: string
  name: string
  type: 'auto' | 'home' | 'personal' | 'student'
  lender: string
  monthlyPayment: number
  dueDate: string
  status: PaymentStatus
  remainingBalance: number
  interestRate: number
  autoPay: boolean
}

export interface Bill {
  id: string
  name: string
  type: 'utilities' | 'internet' | 'phone' | 'insurance' | 'subscription' | 'rent' | 'other'
  provider: string
  amount: number
  dueDate: string
  status: PaymentStatus
  recurring: boolean
  autoPay: boolean
}

export type PaymentItem = CreditCard | Loan | Bill

export interface AddPaymentFormData {
  type: 'credit-card' | 'loan' | 'bill'
  name: string
  amount: number
  dueDate: string
  // Credit card specific
  lastFour?: string
  creditLimit?: number
  minPayment?: number
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover'
  // Loan specific
  loanType?: 'auto' | 'home' | 'personal' | 'student'
  lender?: string
  remainingBalance?: number
  interestRate?: number
  // Bill specific
  billType?: 'utilities' | 'internet' | 'phone' | 'insurance' | 'subscription' | 'rent' | 'other'
  provider?: string
  recurring?: boolean
  autoPay?: boolean
}
