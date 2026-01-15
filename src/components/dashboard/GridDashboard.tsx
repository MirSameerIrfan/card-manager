import { CreditCard, Loan, Bill } from '@/types/payment'
import { CreditCardCard } from './CreditCardCard'
import { LoanCard } from './LoanCard'
import { BillCard } from './BillCard'

interface GridDashboardProps {
  creditCards: CreditCard[]
  loans: Loan[]
  bills: Bill[]
}

export function GridDashboard({ creditCards, loans, bills }: GridDashboardProps) {
  return (
    <div className="space-y-12">
      {/* Credit Cards Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Credit Cards</h2>
          <span className="text-sm text-gray-600">{creditCards.length} cards</span>
        </div>
        {creditCards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map((card) => (
              <CreditCardCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No credit cards added yet</p>
          </div>
        )}
      </section>

      {/* Loans Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Loans</h2>
          <span className="text-sm text-gray-600">{loans.length} loans</span>
        </div>
        {loans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No loans added yet</p>
          </div>
        )}
      </section>

      {/* Bills Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bills</h2>
          <span className="text-sm text-gray-600">{bills.length} bills</span>
        </div>
        {bills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No bills added yet</p>
          </div>
        )}
      </section>
    </div>
  )
}
