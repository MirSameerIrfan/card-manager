import type { ComponentType } from 'react'
import { Pencil, Trash } from 'lucide-react'

export type PaymentStatus = 'Paid' | 'Due Soon' | 'Overdue' | 'Auto-Pay'

export type PaymentCardProps = {
  name: string
  provider: string
  amount: string
  date: string
  status: PaymentStatus
  icon: ComponentType<{ className?: string }>
  frequency?: string
  onEdit?: () => void
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
  frequency,
  onEdit,
  onDelete,
  isDeleting = false,
}: PaymentCardProps) {
  const theme = themeByStatus[status]

  return (
    <div className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50">
      {onEdit || onDelete ? (
        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
          {onEdit ? (
            <button
              onClick={onEdit}
              className="rounded-lg p-2 text-gray-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
              title="Edit Payment"
            >
              <Pencil className="h-4 w-4" />
            </button>
          ) : null}
          {onDelete ? (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
              title="Delete Payment"
            >
              <Trash className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${theme.bg}`}>
            <Icon className={`h-6 w-6 ${theme.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-sm font-medium text-gray-500">{provider}</p>
            {frequency && (
              <span className="mt-1 inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold capitalize text-violet-600 border border-violet-200">
                {frequency}
              </span>
            )}
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
