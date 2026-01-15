# Dashboard Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                       DashboardPage                             │
│                  (Main Container Component)                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Animated Background Layer                    │ │
│  │  • Emerald gradient circle (top-right)                    │ │
│  │  • Teal gradient circle (bottom-left)                     │ │
│  │  • Blur effects with pulse animation                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Header Section                         │ │
│  │  • Page title: "Financial Dashboard"                     │ │
│  │  • Subtitle description                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Summary Cards Grid (4 cards)                 │ │
│  │                                                           │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │ │
│  │  │ Credit   │ │  Loans   │ │  Bills   │ │  Total   │  │ │
│  │  │  Cards   │ │ Monthly  │ │ Monthly  │ │ Monthly  │  │ │
│  │  │   Due    │ │ Payments │ │          │ │          │  │ │
│  │  │          │ │          │ │          │ │          │  │ │
│  │  │ $X,XXX   │ │ $X,XXX   │ │ $X,XXX   │ │ $X,XXX   │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │ │
│  │                                                           │ │
│  │  • Gradient icon backgrounds                             │ │
│  │  • Overdue count badges                                  │ │
│  │  • Dynamic totals calculation                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │            Credit Cards Section                           │ │
│  │  ┌────────────────┐                                       │ │
│  │  │ Section Header │  [Add Card Button]                   │ │
│  │  └────────────────┘                                       │ │
│  │                                                           │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │ │
│  │  │CreditCardItem│ │CreditCardItem│ │CreditCardItem│    │ │
│  │  │              │ │              │ │              │    │ │
│  │  │ Chase        │ │ Amex Gold    │ │ Cap One      │    │ │
│  │  │ ••••4589     │ │ ••••2341     │ │ ••••7823     │    │ │
│  │  │ $1,247.50    │ │ $892.30      │ │ $2,145.67    │    │ │
│  │  │ Due: Feb 15  │ │ Due: Feb 20  │ │ Due: Feb 10  │    │ │
│  │  │ [Due Soon]   │ │ [Paid]       │ │ [Overdue]    │    │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Loans Section                                │ │
│  │  ┌────────────────┐                                       │ │
│  │  │ Section Header │  [Add Loan Button]                   │ │
│  │  └────────────────┘                                       │ │
│  │                                                           │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │ │
│  │  │  LoanItem    │ │  LoanItem    │ │  LoanItem    │    │ │
│  │  │              │ │              │ │              │    │ │
│  │  │ Home         │ │ Car Loan     │ │ Student      │    │ │
│  │  │ Wells Fargo  │ │ Honda Fin    │ │ Sallie Mae   │    │ │
│  │  │ $2,450/mo    │ │ $485/mo      │ │ $320.50/mo   │    │ │
│  │  │ Next: Feb 1  │ │ Next: Feb 20 │ │ Next: Feb 12 │    │ │
│  │  │ [On Track]   │ │ [On Track]   │ │ [Due Soon]   │    │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │            Bills Section                                  │ │
│  │  ┌────────────────┐                                       │ │
│  │  │ Section Header │  [Add Bill Button]                   │ │
│  │  └────────────────┘                                       │ │
│  │                                                           │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │ │
│  │  │BillItem  │ │BillItem  │ │BillItem  │ │BillItem  │  │ │
│  │  │Internet  │ │Electric  │ │  Phone   │ │Streaming │  │ │
│  │  │ Xfinity  │ │  PG&E    │ │ Verizon  │ │ Netflix  │  │ │
│  │  │ $89.99   │ │ $145.32  │ │ $120.00  │ │ $34.98   │  │ │
│  │  │Due:Feb 5 │ │Due:Feb15 │ │Due:Feb 8 │ │Due:Feb18 │  │ │
│  │  │  [Paid]  │ │[DueSoon] │ │[Overdue] │ │  [Paid]  │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              AddItemModal (Conditional)                   │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  Modal Overlay (backdrop-blur, click to close)      │ │ │
│  │  │  ┌───────────────────────────────────────────────┐  │ │ │
│  │  │  │         Modal Content Card                    │  │ │ │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │ │ │
│  │  │  │  │  Modal Header                           │  │  │ │ │
│  │  │  │  │  "Add New [Card/Loan/Bill]"    [X]      │  │  │ │ │
│  │  │  │  └─────────────────────────────────────────┘  │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │ │ │
│  │  │  │  │         Dynamic Form Fields             │  │  │ │ │
│  │  │  │  │  • Name/Type                            │  │  │ │ │
│  │  │  │  │  • Details (digits/lender/provider)     │  │  │ │ │
│  │  │  │  │  • Amount                               │  │  │ │ │
│  │  │  │  │  • Date                                 │  │  │ │ │
│  │  │  │  │  • Icon (for loans/bills)               │  │  │ │ │
│  │  │  │  │  • Status dropdown                      │  │  │ │ │
│  │  │  │  └─────────────────────────────────────────┘  │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │ │ │
│  │  │  │  │      Action Buttons                     │  │  │ │ │
│  │  │  │  │  [Cancel]   [Add Card/Loan/Bill]        │  │  │ │ │
│  │  │  │  └─────────────────────────────────────────┘  │  │ │ │
│  │  │  └───────────────────────────────────────────────┘  │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Component Mount                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Initialize State from localStorage            │
│  • creditCards ← getStoredData('creditCards', defaults)     │
│  • loans ← getStoredData('loans', defaults)                 │
│  • bills ← getStoredData('bills', defaults)                 │
│  • modalOpen ← null                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Calculate Derived Data                     │
│  • totalDue = sum(creditCards.amountDue)                   │
│  • totalMonthlyLoans = sum(loans.monthlyPayment)           │
│  • totalMonthlyBills = sum(bills.amount)                   │
│  • overdueCounts = count by status                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Render Dashboard                         │
│  • Display summary cards with calculated totals            │
│  • Map creditCards → CreditCardItem components             │
│  • Map loans → LoanItem components                         │
│  • Map bills → BillItem components                         │
│  • Conditionally render AddItemModal                       │
└─────────────────────────────────────────────────────────────┘
```

## User Interaction Flow

```
┌──────────────────┐
│  User clicks     │
│  "Add Card"      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  setModalOpen('card')            │
│  Modal renders with card form    │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  User fills form fields:         │
│  • name                          │
│  • lastFourDigits                │
│  • amountDue                     │
│  • dueDate                       │
│  • status                        │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  User clicks "Add Card"          │
│  handleSubmit triggered          │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  handleAddItem('card', formData) │
│  • Create new card object        │
│  • Add to creditCards array      │
│  • Save to localStorage          │
│  • Close modal                   │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Component re-renders            │
│  • New card appears in grid      │
│  • Summary totals update         │
│  • Overdue counts recalculate    │
└──────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                      React State                            │
│                                                             │
│  creditCards: CreditCard[]                                 │
│  ├─ id: string                                             │
│  ├─ name: string                                           │
│  ├─ lastFourDigits: string                                 │
│  ├─ amountDue: number                                      │
│  ├─ dueDate: string                                        │
│  └─ status: 'due-soon' | 'paid' | 'overdue'               │
│                                                             │
│  loans: Loan[]                                             │
│  ├─ id: string                                             │
│  ├─ type: string                                           │
│  ├─ lender: string                                         │
│  ├─ monthlyPayment: number                                 │
│  ├─ nextPaymentDate: string                                │
│  ├─ status: 'on-track' | 'due-soon' | 'overdue'           │
│  └─ icon: LucideIcon                                       │
│                                                             │
│  bills: Bill[]                                             │
│  ├─ id: string                                             │
│  ├─ name: string                                           │
│  ├─ provider: string                                       │
│  ├─ amount: number                                         │
│  ├─ dueDate: string                                        │
│  ├─ status: 'paid' | 'due-soon' | 'overdue'               │
│  └─ icon: LucideIcon                                       │
│                                                             │
│  modalOpen: 'card' | 'loan' | 'bill' | null                │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    localStorage                             │
│  • 'creditCards' → JSON.stringify(creditCards)             │
│  • 'loans' → JSON.stringify(loans)                         │
│  • 'bills' → JSON.stringify(bills)                         │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Layout Grid

```
Mobile (< 640px):
┌─────────────────┐
│  Summary Card 1 │
├─────────────────┤
│  Summary Card 2 │
├─────────────────┤
│  Summary Card 3 │
├─────────────────┤
│  Summary Card 4 │
└─────────────────┘

┌─────────────────┐
│  Credit Card 1  │
├─────────────────┤
│  Credit Card 2  │
├─────────────────┤
│  Credit Card 3  │
└─────────────────┘


Tablet (640px - 1024px):
┌─────────────────┬─────────────────┐
│  Summary Card 1 │  Summary Card 2 │
├─────────────────┼─────────────────┤
│  Summary Card 3 │  Summary Card 4 │
└─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┐
│  Credit Card 1  │  Credit Card 2  │
├─────────────────┼─────────────────┤
│  Credit Card 3  │                 │
└─────────────────┴─────────────────┘


Desktop (≥ 1024px):
┌──────────┬──────────┬──────────┬──────────┐
│ Summary1 │ Summary2 │ Summary3 │ Summary4 │
└──────────┴──────────┴──────────┴──────────┘

┌──────────┬──────────┬──────────┐
│  Card 1  │  Card 2  │  Card 3  │
└──────────┴──────────┴──────────┘

┌──────────┬──────────┬──────────┐
│  Loan 1  │  Loan 2  │  Loan 3  │
└──────────┴──────────┴──────────┘

┌─────┬─────┬─────┬─────┐
│Bill1│Bill2│Bill3│Bill4│
└─────┴─────┴─────┴─────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Stack                           │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  React 19.2                                           │ │
│  │  • Functional components                              │ │
│  │  • useState hooks                                     │ │
│  │  • Modern JSX transform (no React import needed)     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  TypeScript                                           │ │
│  │  • Full type safety                                   │ │
│  │  • Interface definitions                              │ │
│  │  • Generic helper functions                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  TanStack Router                                      │ │
│  │  • File-based routing                                 │ │
│  │  • createFileRoute                                    │ │
│  │  • Type-safe navigation                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Tailwind CSS                                         │ │
│  │  • Utility-first styling                              │ │
│  │  • Responsive design                                  │ │
│  │  • Custom gradients                                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Lucide React                                         │ │
│  │  • Icon library                                       │ │
│  │  • Consistent design                                  │ │
│  │  • Customizable                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  localStorage                                         │ │
│  │  • Client-side persistence                            │ │
│  │  • JSON serialization                                 │ │
│  │  • Automatic sync                                     │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

```
Current Implementation:
• Direct state updates
• Full re-renders on state change
• localStorage sync on each add

Future Optimizations:
┌─────────────────────────────────────────────────────────────┐
│  React.memo() on item components                           │
│  • Prevent unnecessary re-renders                          │
│  • Memoize expensive calculations                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Virtual scrolling for large lists                         │
│  • Render only visible items                               │
│  • Improve performance with 100+ items                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Debounced localStorage writes                             │
│  • Batch updates                                           │
│  • Reduce storage operations                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Code splitting                                            │
│  • Lazy load modal component                              │
│  • Dynamic imports                                         │
└─────────────────────────────────────────────────────────────┘
```

## Accessibility Features

```
┌─────────────────────────────────────────────────────────────┐
│  Semantic HTML                                              │
│  • <section> for major areas                               │
│  • <button> for interactive elements                       │
│  • <form> for data entry                                   │
│  • <label> for form fields                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ARIA Attributes                                            │
│  • aria-label on icon buttons                              │
│  • role="alert" for status badges (can be added)           │
│  • aria-modal on modal dialog (implicit)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Keyboard Navigation                                        │
│  • Tab through all interactive elements                    │
│  • Enter/Space to activate buttons                         │
│  • Escape to close modal                                   │
│  • Form field focus management                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Visual Feedback                                            │
│  • Focus rings on interactive elements                     │
│  • Hover states for buttons                                │
│  • Transition animations                                   │
│  • Status color coding                                     │
└─────────────────────────────────────────────────────────────┘
```
