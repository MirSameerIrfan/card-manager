export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

/**
 * Format a date stored as UTC midnight (e.g. "2026-05-12T00:00:00.000Z").
 * We parse it as a local date-only string to avoid timezone shifting the day.
 */
export const formatDate = (date: Date | string) => {
  // Extract the date portion in UTC to avoid timezone offset shifting the day
  const iso = new Date(date).toISOString() // e.g. "2026-05-12T00:00:00.000Z"
  const [year, month, day] = iso.split('T')[0].split('-').map(Number)
  // Build a local date at noon to avoid any DST edge cases
  return new Date(year, month - 1, day, 12).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Calendar day ("YYYY-MM-DD") of a stored due date, read from its UTC parts.
 */
export const toDateKey = (date: Date | string) =>
  new Date(date).toISOString().slice(0, 10)

/**
 * Parse a date input value ("YYYY-MM-DD") into the UTC-midnight Date we store.
 * Returns null for anything that is not a real calendar day.
 */
export const parseDueDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || toDateKey(date) !== value) return null
  return date
}

/**
 * The due date one period after a stored due date: two weeks later for
 * biweekly bills, otherwise the same day next month. A day the next month
 * doesn't have becomes its last day (Jan 31 -> Feb 28), and stays there.
 */
export const nextDueDate = (date: Date | string, frequency = 'monthly') => {
  const next = new Date(date)
  if (frequency === 'biweekly') {
    next.setUTCDate(next.getUTCDate() + 14)
    return next
  }
  const day = next.getUTCDate()
  next.setUTCDate(1)
  next.setUTCMonth(next.getUTCMonth() + 1)
  const lastDay = new Date(
    Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0),
  ).getUTCDate()
  next.setUTCDate(Math.min(day, lastDay))
  return next
}

export const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export const getFirstName = (nameOrEmail?: string | null) => {
  if (!nameOrEmail) return 'there'
  if (nameOrEmail.includes('@')) {
    const [local] = nameOrEmail.split('@')
    return local || 'there'
  }
  return nameOrEmail.split(' ')[0] || 'there'
}

/**
 * Normalize any date to local midnight (date-only, no time component).
 * For dates stored as UTC midnight (from Postgres), we extract the UTC date
 * parts to avoid the timezone offset shifting the day backward.
 */
const normalizeDate = (date: Date | string) => {
  const iso = new Date(date).toISOString()
  const [year, month, day] = iso.split('T')[0].split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Get the Monday-to-Sunday week range based on today's local date.
 */
const getWeekRangeMonday = () => {
  const localToday = new Date()
  const start = new Date(localToday.getFullYear(), localToday.getMonth(), localToday.getDate())

  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

/**
 * Count payments due within the current Monday–Sunday week that are also
 * today or in the future.
 */
export const countDueThisWeekMonday = (items: Array<{ date: Date | string }>) => {
  const localToday = new Date()
  const today = new Date(localToday.getFullYear(), localToday.getMonth(), localToday.getDate())
  const { start, end } = getWeekRangeMonday()

  return items.filter((item) => {
    const dueDate = normalizeDate(item.date)
    return dueDate >= today && dueDate >= start && dueDate <= end
  }).length
}

/**
 * Derive the display status for a payment.
 * - Overdue: due date is strictly before today (regardless of autoPay)
 * - Auto-Pay: autoPay is on and due date is today or future
 * - Due Soon: autoPay is off and due date is today or future
 */
export const getPaymentStatus = (
  dueDate: Date | string,
  autoPay: boolean,
): 'Due Soon' | 'Overdue' | 'Auto-Pay' => {
  const localToday = new Date()
  const today = new Date(localToday.getFullYear(), localToday.getMonth(), localToday.getDate())
  const due = normalizeDate(dueDate)

  if (due < today) {
    return 'Overdue'
  }
  return autoPay ? 'Auto-Pay' : 'Due Soon'
}

/**
 * Totals for the stat cards: every payment that is not Overdue, by the same
 * browser-local "today" as getPaymentStatus.
 */
export const getUpcomingStats = (
  items: Array<{ date: Date | string; amount: number; autoPay: boolean }>,
) => {
  const upcoming = items.filter(
    (item) => getPaymentStatus(item.date, item.autoPay) !== 'Overdue',
  )
  return {
    totalDue: upcoming.reduce((sum, item) => sum + item.amount, 0),
    upcomingPaymentsCount: upcoming.length,
    autoPayCount: upcoming.filter((item) => item.autoPay).length,
  }
}
