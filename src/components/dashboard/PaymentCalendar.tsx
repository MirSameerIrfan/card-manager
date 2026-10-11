import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { EventContentArg, EventInput } from '@fullcalendar/core'
import { useMemo } from 'react'
import { toDateKey } from './dashboard-utils'

type PaymentCalendarItem = {
  date: Date | string
  amount: number
  type: 'credit_card' | 'loan' | 'recurring_bill'
}

type PaymentCalendarProps = {
  payments: PaymentCalendarItem[]
  className?: string
}

type DayAggregate = {
  dateKey: string
  count: number
  total: number
  types: {
    credit_card: number
    loan: number
    recurring_bill: number
  }
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

const renderEventContent = (eventInfo: EventContentArg) => {
  const { total, count, types } = eventInfo.event.extendedProps as DayAggregate
  const parts = [
    types.credit_card ? `${types.credit_card} card` : null,
    types.loan ? `${types.loan} loan` : null,
    types.recurring_bill ? `${types.recurring_bill} bill` : null,
  ].filter(Boolean)

  return (
    <div className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold leading-tight text-emerald-700">
      <div>{formatCurrency(total)}</div>
      <div className="text-[10px] font-medium text-emerald-700/80">
        {count} due{parts.length ? ` • ${parts.join(' • ')}` : ''}
      </div>
    </div>
  )
}

export function PaymentCalendar({ payments, className }: PaymentCalendarProps) {
  const events = useMemo<EventInput[]>(() => {
    // Due dates are UTC midnight, so compare calendar days rather than instants.
    const now = new Date()
    const todayKey = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-')

    const aggregates = payments.reduce<Record<string, DayAggregate>>((acc, item) => {
      const date = new Date(item.date)
      if (Number.isNaN(date.getTime())) return acc

      const key = toDateKey(date)
      if (key < todayKey) return acc
      if (!acc[key]) {
        acc[key] = {
          dateKey: key,
          count: 0,
          total: 0,
          types: { credit_card: 0, loan: 0, recurring_bill: 0 },
        }
      }

      acc[key].count += 1
      acc[key].total += item.amount
      acc[key].types[item.type] += 1

      return acc
    }, {})

    return Object.values(aggregates).map((day) => ({
      title: `${formatCurrency(day.total)} • ${day.count} payment${
        day.count === 1 ? '' : 's'
      } due`,
      start: day.dateKey,
      allDay: true,
      display: 'block',
      extendedProps: day,
    }))
  }, [payments])

  return (
    <div className={className}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        dayMaxEvents={1}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        events={events}
        eventContent={renderEventContent}
      />
    </div>
  )
}
