import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, LayoutGrid, List, Calendar } from 'lucide-react'
import { GridDashboard } from '@/components/dashboard/GridDashboard'
import { ListDashboard } from '@/components/dashboard/ListDashboard'
import { TimelineDashboard } from '@/components/dashboard/TimelineDashboard'
import { AddPaymentModal } from '@/components/dashboard/AddPaymentModal'
import { dummyCreditCards, dummyLoans, dummyBills } from '@/data/dummyPayments'

export const Route = createFileRoute('/dashboard')({ component: Dashboard })

type DashboardView = 'grid' | 'list' | 'timeline'

function Dashboard() {
  const [view, setView] = useState<DashboardView>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header with view switcher */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your credit cards, loans, and bills</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View switcher */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setView('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    view === 'grid'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid size={18} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    view === 'list'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={18} />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setView('timeline')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    view === 'timeline'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar size={18} />
                  <span className="hidden sm:inline">Timeline</span>
                </button>
              </div>

              {/* Add Payment CTA */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'grid' && (
          <GridDashboard
            creditCards={dummyCreditCards}
            loans={dummyLoans}
            bills={dummyBills}
          />
        )}
        {view === 'list' && (
          <ListDashboard
            creditCards={dummyCreditCards}
            loans={dummyLoans}
            bills={dummyBills}
          />
        )}
        {view === 'timeline' && (
          <TimelineDashboard
            creditCards={dummyCreditCards}
            loans={dummyLoans}
            bills={dummyBills}
          />
        )}
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
