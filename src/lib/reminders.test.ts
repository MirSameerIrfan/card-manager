import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendPaymentReminderEmails } from '@/lib/email'
import {
  getCronToken,
  isCronRequest,
  sendPaymentReminders,
} from '@/lib/reminders'

const utc = (day: string) => new Date(`${day}T00:00:00.000Z`)

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('isCronRequest', () => {
  const request = (authorization?: string) =>
    new Request('http://localhost/api/cron/reminders', {
      method: 'POST',
      headers: authorization ? { authorization } : {},
    })

  it('accepts the token derived from the secret', () => {
    expect(isCronRequest(request(`Bearer ${getCronToken('s3cret')}`), 's3cret')).toBe(true)
  })

  it.each([
    ['no header', undefined],
    ['a token from another secret', `Bearer ${getCronToken('other')}`],
    ['the secret itself', 'Bearer s3cret'],
    ['the token without "Bearer"', getCronToken('s3cret')],
  ])('rejects %s', (_label, authorization) => {
    expect(isCronRequest(request(authorization), 's3cret')).toBe(false)
  })

  it('rejects everything when no secret is configured', () => {
    expect(isCronRequest(request(`Bearer ${getCronToken('')}`), '')).toBe(false)
  })
})

describe('sendPaymentReminders', () => {
  const fakeDb = (users: unknown[] = []) => {
    const findMany = vi.fn().mockResolvedValue(users)
    return { findMany, db: { user: { findMany } } as never }
  }

  it('asks for opted-in, verified users with non-auto-pay payments due today through 3 days ahead (UTC)', async () => {
    const { db, findMany } = fakeDb()
    // 23:30 UTC is still May 12 in UTC
    await sendPaymentReminders(db, new Date('2026-05-12T23:30:00.000Z'), vi.fn())

    const due = { gte: utc('2026-05-12'), lte: utc('2026-05-15') }
    expect(findMany).toHaveBeenCalledWith({
      where: {
        emailVerified: true,
        paymentReminders: true,
        OR: [
          { credit_card: { some: { dueDate: due } } },
          { loan: { some: { nextPayment: due, autoPay: false } } },
          { recurring_bill: { some: { dueDate: due, autoPay: false } } },
        ],
      },
      select: {
        email: true,
        credit_card: {
          where: { dueDate: due },
          select: { name: true, amountDue: true, dueDate: true },
        },
        loan: {
          where: { nextPayment: due, autoPay: false },
          select: { name: true, monthlyPayment: true, nextPayment: true },
        },
        recurring_bill: {
          where: { dueDate: due, autoPay: false },
          select: { name: true, amount: true, dueDate: true },
        },
      },
    })
  })

  it("sends each user one email listing their payments by due date", async () => {
    const { db } = fakeDb([
      {
        email: 'ada@example.com',
        credit_card: [{ name: 'Sapphire', amountDue: 100, dueDate: utc('2026-05-15') }],
        loan: [{ name: 'Auto Loan', monthlyPayment: 300.5, nextPayment: utc('2026-05-13') }],
        recurring_bill: [{ name: 'Netflix', amount: 15, dueDate: utc('2026-05-12') }],
      },
    ])
    const send = vi.fn()

    const result = await sendPaymentReminders(db, new Date('2026-05-12T13:00:00.000Z'), send)

    expect(result).toEqual({ sent: 1 })
    expect(send).toHaveBeenCalledWith([
      {
        email: 'ada@example.com',
        items: [
          'Netflix: $15.00 due May 12, 2026',
          'Auto Loan: $300.50 due May 13, 2026',
          'Sapphire: $100.00 due May 15, 2026',
        ],
      },
    ])
  })
})

describe('sendPaymentReminderEmails', () => {
  const reminder = (n: number) => ({ email: `user${n}@example.com`, items: ['Rent: $1.00 due May 12, 2026'] })

  it('sends through the batch endpoint, 100 emails per request', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetch = vi.fn().mockResolvedValue(new Response('{}'))
    vi.stubGlobal('fetch', fetch)

    await sendPaymentReminderEmails(Array.from({ length: 101 }, (_, n) => reminder(n)))

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch.mock.calls[0][0]).toBe('https://api.resend.com/emails/batch')
    const bodies = fetch.mock.calls.map(([, init]) => JSON.parse(init.body as string))
    expect(bodies.map((body) => body.length)).toEqual([100, 1])
    expect(bodies[1][0].to).toEqual(['user100@example.com'])
    expect(bodies[1][0].reply_to).toBe('info@money-scope.app')
  })

  it('escapes payment names in the HTML', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetch = vi.fn().mockResolvedValue(new Response('{}'))
    vi.stubGlobal('fetch', fetch)

    await sendPaymentReminderEmails([
      { email: 'ada@example.com', items: ['<img src=x onerror=alert(1)>: $1.00 due May 12, 2026'] },
    ])

    const [email] = JSON.parse(fetch.mock.calls[0][1].body as string)
    expect(email.html).toContain('<li>&lt;img src=x onerror=alert(1)&gt;: $1.00 due May 12, 2026</li>')
    expect(email.html).not.toContain('<img')
  })

  it('throws when Resend rejects the batch', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('quota', { status: 429 })))

    await expect(sendPaymentReminderEmails([reminder(1)])).rejects.toThrow(
      'Failed to send email: 429 quota',
    )
  })
})
