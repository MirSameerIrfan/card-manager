// src/lib/format-utils.ts
import type { LoanType, BillCategory } from '../../generated/prisma/client'

// Format currency to string
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format date to readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

// Get icon name for loan type
export function getLoanTypeName(type: LoanType): string {
  const names: Record<LoanType, string> = {
    AUTO: 'Auto Loan',
    MORTGAGE: 'Mortgage',
    STUDENT: 'Student Loan',
    PERSONAL: 'Personal Loan',
  }
  return names[type] || type
}

// Get category display name
export function getBillCategoryName(category: BillCategory): string {
  const names: Record<BillCategory, string> = {
    UTILITIES: 'Utilities',
    SUBSCRIPTION: 'Subscription',
    INSURANCE: 'Insurance',
    PHONE: 'Phone',
    INTERNET: 'Internet',
    OTHER: 'Other',
  }
  return names[category] || category
}
