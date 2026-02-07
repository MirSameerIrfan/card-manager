import type { ComponentType } from 'react'
import { Trash } from 'lucide-react'

export type PaymentStatus = 'Paid' | 'Due Soon' | 'Overdue' | 'Auto-Pay'

export type PaymentCardProps = {
  name: string
  provider: string
  amount: string
  date: string
  status: PaymentStatus
  icon: ComponentType<{ className?: string }>
  onDelete?: () => void
  isDeleting?: boolean
}

const themeByStatus: Record<
  PaymentStatus,
  { bg: string; text: string; border: string }
> = {
  Paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Due Soon': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Overdue: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Auto-Pay': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
}

export function PaymentCard({
  name,
  provider,
  amount,
  date,
  status,
  icon: Icon,
  onDelete,
  isDeleting = false,
}: PaymentCardProps) {
  const theme = themeByStatus[status]

  return (
    <div className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50">
      {onDelete ? (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Delete Payment"
        >
          <Trash className="w-4 h-4" />
        </button>
      ) : null}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${theme.bg}`}>
            <Icon className={`h-6 w-6 ${theme.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-sm font-medium text-gray-500">{provider}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Amount</p>
          <p className="mt-0.5 text-lg font-black text-gray-900">{amount}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {status === 'Auto-Pay' ? 'Next Payment' : 'Due Date'}
          </p>
          <div
            className={`mt-1 inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${theme.bg} ${theme.text} ${theme.border}`}
          >
            {date}
          </div>
        </div>
      </div>
    </div>
  )
}
