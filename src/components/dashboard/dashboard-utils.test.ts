import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  formatDate,
  countDueThisWeekMonday,
  getPaymentStatus,
  getUpcomingStats,
  parseDueDate,
  toDateKey,
} from './dashboard-utils'

// Due dates are stored as UTC midnight of their calendar day, so build test
// dates the same way. Local midnight is the previous UTC day east of UTC.
const storedDay = (offsetDays: number) => {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays))
}

// ---------------------------------------------------------------------------
// formatDate — must never shift the calendar day due to timezone
// ---------------------------------------------------------------------------
describe('formatDate', () => {
  it('displays the correct calendar day for a UTC-midnight ISO string', () => {
    // Stored as UTC midnight — must show May 12, not May 11 in any timezone
    const result = formatDate('2026-05-12T00:00:00.000Z')
    expect(result).toContain('May')
    expect(result).toContain('12')
  })

  it('handles Date objects without shifting the day', () => {
    const d = new Date('2026-01-18T00:00:00.000Z')
    const result = formatDate(d)
    expect(result).toContain('Jan')
    expect(result).toContain('18')
  })

  it('handles end-of-month dates without overflow', () => {
    const result = formatDate('2026-01-31T00:00:00.000Z')
    expect(result).toContain('Jan')
    expect(result).toContain('31')
  })
})

// ---------------------------------------------------------------------------
// getPaymentStatus — overdue, due-soon, auto-pay logic
// ---------------------------------------------------------------------------
describe('getPaymentStatus', () => {
  const todayMidnight = storedDay(0)
  const yesterday = storedDay(-1)
  const tomorrow = storedDay(1)

  it('returns Overdue for a past date regardless of autoPay', () => {
    expect(getPaymentStatus(yesterday.toISOString(), true)).toBe('Overdue')
    expect(getPaymentStatus(yesterday.toISOString(), false)).toBe('Overdue')
  })

  it('returns Auto-Pay for a future date when autoPay is true', () => {
    expect(getPaymentStatus(tomorrow.toISOString(), true)).toBe('Auto-Pay')
  })

  it('returns Due Soon for a future date when autoPay is false', () => {
    expect(getPaymentStatus(tomorrow.toISOString(), false)).toBe('Due Soon')
  })

  it('returns Due Soon or Auto-Pay (not Overdue) for today', () => {
    const status = getPaymentStatus(todayMidnight.toISOString(), false)
    expect(status).not.toBe('Overdue')
  })

  it('returns Auto-Pay (not Overdue) for today with autoPay true', () => {
    expect(getPaymentStatus(todayMidnight.toISOString(), true)).toBe('Auto-Pay')
  })
})

// ---------------------------------------------------------------------------
// countDueThisWeekMonday — only future/today dates in the Mon–Sun window
// ---------------------------------------------------------------------------
describe('countDueThisWeekMonday', () => {
  const todayMidnight = storedDay(0)
  const yesterday = storedDay(-1)

  it('does not count past dates', () => {
    expect(countDueThisWeekMonday([{ date: yesterday }])).toBe(0)
  })

  it('counts today', () => {
    expect(countDueThisWeekMonday([{ date: todayMidnight }])).toBe(1)
  })

  it('returns 0 for empty list', () => {
    expect(countDueThisWeekMonday([])).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// parseDueDate / toDateKey — due dates are stored as UTC midnight
// ---------------------------------------------------------------------------
describe('parseDueDate', () => {
  it('parses a date input value as UTC midnight', () => {
    expect(parseDueDate('2026-05-12')?.toISOString()).toBe('2026-05-12T00:00:00.000Z')
  })

  it('round-trips through toDateKey and formatDate without shifting the day', () => {
    const stored = parseDueDate('2026-01-31')
    expect(stored).not.toBeNull()
    expect(toDateKey(stored!)).toBe('2026-01-31')
    expect(formatDate(stored!)).toBe('Jan 31, 2026')
  })

  it('rejects values that are not a real calendar day', () => {
    expect(parseDueDate('')).toBeNull()
    expect(parseDueDate('2026-02-30')).toBeNull()
    expect(parseDueDate('2026-05-12T12:00:00.000Z')).toBeNull()
    expect(parseDueDate('12/05/2026')).toBeNull()
  })
})

describe('toDateKey', () => {
  it('reads the calendar day from the UTC parts of a stored date', () => {
    expect(toDateKey('2026-05-12T00:00:00.000Z')).toBe('2026-05-12')
    expect(toDateKey(new Date('2026-12-31T00:00:00.000Z'))).toBe('2026-12-31')
  })
})

// ---------------------------------------------------------------------------
// getUpcomingStats — stat card totals by the user's calendar day
// ---------------------------------------------------------------------------

/** Set `TZ` for the enclosing describe block and restore it afterwards. */
const useTimezone = (timeZone: string) => {
  let previous: string | undefined
  beforeAll(() => {
    previous = process.env.TZ
    process.env.TZ = timeZone
  })
  afterAll(() => {
    if (previous === undefined) delete process.env.TZ
    else process.env.TZ = previous
  })
}

describe('getUpcomingStats', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns zeros when there are no payments', () => {
    expect(getUpcomingStats([])).toEqual({
      totalDue: 0,
      upcomingPaymentsCount: 0,
      autoPayCount: 0,
    })
  })

  it('leaves overdue payments out and counts auto-pay among the rest', () => {
    expect(
      getUpcomingStats([
        { date: storedDay(-1), amount: 1, autoPay: true },
        { date: storedDay(0), amount: 10, autoPay: false },
        { date: storedDay(0), amount: 100, autoPay: true },
        { date: storedDay(30), amount: 1000, autoPay: true },
      ]),
    ).toEqual({ totalDue: 1110, upcomingPaymentsCount: 3, autoPayCount: 2 })
  })

  // Payments due yesterday, today and tomorrow, stored as UTC midnight. Only
  // today and tomorrow count, by the user's day whatever their timezone: at
  // 23:30 in New York it is already the next day in UTC, where the server
  // used to compute these totals (#38).
  describe.each([
    ['Pacific/Pago_Pago', 660],
    ['America/Los_Angeles', 420],
    ['America/New_York', 240],
    ['UTC', 0],
    ['Asia/Kolkata', -330],
    ['Pacific/Kiritimati', -840],
  ])('in %s', (timeZone, offsetMinutes) => {
    useTimezone(timeZone)

    it('is running in that timezone', () => {
      expect(new Date(2026, 4, 12, 12).getTimezoneOffset()).toBe(offsetMinutes)
    })

    it.each([
      [0, 30],
      [12, 0],
      [23, 30],
    ])('counts payments due today or later at %i:%i local time on May 12', (hours, minutes) => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date(2026, 4, 12, hours, minutes))

      expect(
        getUpcomingStats([
          { date: new Date('2026-05-11T00:00:00.000Z'), amount: 1, autoPay: true },
          { date: new Date('2026-05-12T00:00:00.000Z'), amount: 10, autoPay: true },
          { date: new Date('2026-05-13T00:00:00.000Z'), amount: 100, autoPay: false },
        ]),
      ).toEqual({ totalDue: 110, upcomingPaymentsCount: 2, autoPayCount: 1 })
    })
  })
})
