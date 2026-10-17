import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  AddPaymentSchema,
  DeletePaymentSchema,
  UpdatePaymentSchema,
  addPayment,
  deletePayment,
  getDashboardData,
  updatePayment,
  type DashboardSession,
  type PaymentDb,
} from '@/components/dashboard/dashboard.server'

type PaymentType = 'credit_card' | 'loan' | 'recurring_bill'
type AddInput = Parameters<typeof addPayment>[2]
type UpdateInput = Parameters<typeof updatePayment>[2]

const PAYMENT_TYPES: PaymentType[] = ['credit_card', 'loan', 'recurring_bill']
const USER_ID = 'user-1'
const OTHER_USER_ID = 'user-2'
// Noon on May 12, 2026 in New York, where the tests run unless a block says
// otherwise.
const NOW = new Date('2026-05-12T16:00:00.000Z')

/** A stored due date: UTC midnight of the given calendar day. */
const utc = (day: string) => new Date(`${day}T00:00:00.000Z`)

const verifiedSession: DashboardSession = {
  user: {
    id: USER_ID,
    emailVerified: true,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  },
}

// ---------------------------------------------------------------------------
// Fake Prisma client — every table method is a spy that resolves to an empty
// result unless a test says otherwise
// ---------------------------------------------------------------------------
const createFakeDb = () => {
  const table = () => ({
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })
  const tables = {
    credit_card: table(),
    loan: table(),
    recurring_bill: table(),
  }
  return { tables, db: tables as unknown as PaymentDb }
}

type FakeTables = ReturnType<typeof createFakeDb>['tables']

/** Every database call made, as "table.method" (e.g. "loan.update"). */
const dbCalls = (tables: FakeTables) =>
  Object.entries(tables).flatMap(([table, methods]) =>
    Object.entries(methods).flatMap(([method, fn]) =>
      fn.mock.calls.map(() => `${table}.${method}`),
    ),
  )

// Stored rows, shaped like the Prisma models
const cardRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'card-1',
  userId: USER_ID,
  name: 'Sapphire',
  provider: '••••4589',
  amountDue: 100,
  dueDate: utc('2026-05-20'),
  minimumPayment: 25,
  status: 'Due Soon',
  createdAt: utc('2026-01-01'),
  updatedAt: utc('2026-01-01'),
  ...overrides,
})

const loanRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'loan-1',
  userId: USER_ID,
  name: 'Auto Loan',
  provider: 'Honda Finance',
  monthlyPayment: 300,
  nextPayment: utc('2026-05-20'),
  remainingBalance: 9000,
  autoPay: false,
  createdAt: utc('2026-01-01'),
  updatedAt: utc('2026-01-01'),
  ...overrides,
})

const billRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'bill-1',
  userId: USER_ID,
  name: 'Netflix',
  provider: 'Netflix',
  amount: 15,
  dueDate: utc('2026-05-20'),
  category: 'Streaming',
  frequency: 'monthly',
  autoPay: false,
  createdAt: utc('2026-01-01'),
  updatedAt: utc('2026-01-01'),
  ...overrides,
})

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

// Reading a UTC-midnight due date as a local time moves it back a day west of
// UTC, so run in New York by default to catch that.
useTimezone('America/New_York')

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
  // Failed writes are logged; keep the test output clean.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

it('runs west of UTC, where due dates are most likely to shift a day', () => {
  expect(NOW.getTimezoneOffset()).toBe(240)
})

// ---------------------------------------------------------------------------
// Auth gate — every function needs a session with a verified email, and must
// reject before touching the database
// ---------------------------------------------------------------------------
describe('auth gate', () => {
  const rejectedSessions: Array<[string, DashboardSession]> = [
    ['no session', null],
    ['an undefined session', undefined],
    ['a session without a user', { user: null }],
    [
      'an unverified email',
      { user: { id: USER_ID, emailVerified: false } },
    ],
    [
      'a missing emailVerified flag',
      {
        user: { id: USER_ID, emailVerified: undefined as unknown as boolean },
      },
    ],
    [
      'a truthy but non-boolean emailVerified',
      { user: { id: USER_ID, emailVerified: 'true' as unknown as boolean } },
    ],
  ]

  type Call = (db: PaymentDb, session: DashboardSession) => Promise<unknown>
  const calls: Array<[string, Call]> = [
    ['getDashboardData', (db, session) => getDashboardData(db, session)],
    ...PAYMENT_TYPES.flatMap((type): Array<[string, Call]> => [
      [
        `addPayment (${type})`,
        (db, session) =>
          addPayment(db, session, {
            type,
            name: 'Name',
            provider: 'Provider',
            amount: 10,
            date: '2026-05-20',
          }),
      ],
      [
        `updatePayment (${type})`,
        (db, session) =>
          updatePayment(db, session, {
            id: 'payment-1',
            type,
            name: 'Name',
            provider: 'Provider',
            amount: 10,
            date: '2026-05-20',
          }),
      ],
      [
        `deletePayment (${type})`,
        (db, session) => deletePayment(db, session, { id: 'payment-1', type }),
      ],
    ]),
  ]

  describe.each(calls)('%s', (_name, call) => {
    it.each(rejectedSessions)(
      'throws Unauthorized for %s without touching the database',
      async (_label, session) => {
        const { tables, db } = createFakeDb()
        await expect(call(db, session)).rejects.toThrow('Unauthorized')
        expect(dbCalls(tables)).toEqual([])
      },
    )
  })
})

// ---------------------------------------------------------------------------
// getDashboardData — reads all three tables and derives the stat tiles
// ---------------------------------------------------------------------------
describe('getDashboardData', () => {
  it("queries each table for the user's rows, ordered by its own due-date column", async () => {
    const { tables, db } = createFakeDb()
    await getDashboardData(db, verifiedSession)

    expect(tables.credit_card.findMany).toHaveBeenCalledWith({
      where: { userId: USER_ID },
      orderBy: { dueDate: 'asc' },
    })
    expect(tables.loan.findMany).toHaveBeenCalledWith({
      where: { userId: USER_ID },
      orderBy: { nextPayment: 'asc' },
    })
    expect(tables.recurring_bill.findMany).toHaveBeenCalledWith({
      where: { userId: USER_ID },
      orderBy: { dueDate: 'asc' },
    })
    expect(dbCalls(tables)).toEqual([
      'credit_card.findMany',
      'loan.findMany',
      'recurring_bill.findMany',
    ])
  })

  it('returns the rows unchanged together with the user', async () => {
    const { tables, db } = createFakeDb()
    const creditCards = [cardRow()]
    const loans = [loanRow()]
    const recurringBills = [billRow()]
    tables.credit_card.findMany.mockResolvedValue(creditCards)
    tables.loan.findMany.mockResolvedValue(loans)
    tables.recurring_bill.findMany.mockResolvedValue(recurringBills)

    const result = await getDashboardData(db, verifiedSession)

    expect(result.user).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    })
    expect(result.creditCards).toBe(creditCards)
    expect(result.loans).toBe(loans)
    expect(result.recurringBills).toBe(recurringBills)
  })

  it('returns null for a missing name or email', async () => {
    const { db } = createFakeDb()
    const result = await getDashboardData(db, {
      user: { id: USER_ID, emailVerified: true },
    })
    expect(result.user).toEqual({ name: null, email: null })
  })

  it('returns zeroed stats when there are no payments', async () => {
    const { db } = createFakeDb()
    const result = await getDashboardData(db, verifiedSession)
    expect(result.stats).toEqual({
      totalDue: 0,
      upcomingPaymentsCount: 0,
      autoPayCount: 0,
    })
  })

  it("totals each table's own amount column", async () => {
    const { tables, db } = createFakeDb()
    // amountDue, monthlyPayment and amount — not minimumPayment or remainingBalance
    tables.credit_card.findMany.mockResolvedValue([
      cardRow({ amountDue: 100, minimumPayment: 25 }),
    ])
    tables.loan.findMany.mockResolvedValue([
      loanRow({ monthlyPayment: 300, remainingBalance: 9000 }),
    ])
    tables.recurring_bill.findMany.mockResolvedValue([billRow({ amount: 15 })])

    const result = await getDashboardData(db, verifiedSession)

    expect(result.stats.totalDue).toBe(415)
    expect(result.stats.upcomingPaymentsCount).toBe(3)
  })

  it('leaves past-due payments out of every stat', async () => {
    const { tables, db } = createFakeDb()
    tables.credit_card.findMany.mockResolvedValue([
      cardRow({ id: 'card-past', dueDate: utc('2026-05-11'), amountDue: 1 }),
      cardRow({ id: 'card-today', dueDate: utc('2026-05-12'), amountDue: 100 }),
    ])
    tables.loan.findMany.mockResolvedValue([
      loanRow({
        id: 'loan-past',
        nextPayment: utc('2026-04-30'),
        monthlyPayment: 2,
        autoPay: true,
      }),
      loanRow({
        id: 'loan-next',
        nextPayment: utc('2026-06-01'),
        monthlyPayment: 300,
        autoPay: true,
      }),
    ])
    tables.recurring_bill.findMany.mockResolvedValue([
      billRow({
        id: 'bill-past',
        dueDate: utc('2025-12-31'),
        amount: 4,
        autoPay: true,
      }),
      billRow({ id: 'bill-today', dueDate: utc('2026-05-12'), amount: 15 }),
    ])

    const result = await getDashboardData(db, verifiedSession)

    expect(result.stats).toEqual({
      totalDue: 415,
      upcomingPaymentsCount: 3,
      autoPayCount: 1,
    })
  })

  it('counts auto-pay from the loan and bill flags only, never credit cards', async () => {
    const { tables, db } = createFakeDb()
    // Credit cards have no autoPay column; a stored status does not count.
    tables.credit_card.findMany.mockResolvedValue([
      cardRow({ status: 'Auto-Pay' }),
    ])
    tables.loan.findMany.mockResolvedValue([
      loanRow({ id: 'loan-auto', autoPay: true }),
      loanRow({ id: 'loan-manual', autoPay: false }),
    ])
    tables.recurring_bill.findMany.mockResolvedValue([
      billRow({ id: 'bill-auto', autoPay: true }),
    ])

    const result = await getDashboardData(db, verifiedSession)

    expect(result.stats.autoPayCount).toBe(2)
    expect(result.stats.upcomingPaymentsCount).toBe(4)
  })

  // Every table gets one payment due yesterday, today and tomorrow (stored as
  // UTC midnight). Only today and tomorrow count, whatever the timezone and
  // time of day — comparing the stored instant to local midnight instead
  // would drop "today" west of UTC.
  describe.each([
    ['Pacific/Pago_Pago', 660],
    ['America/Los_Angeles', 420],
    ['America/New_York', 240],
    ['UTC', 0],
    ['Asia/Tokyo', -540],
    ['Pacific/Kiritimati', -840],
  ])('UTC-midnight due dates in %s', (timeZone, offsetMinutes) => {
    useTimezone(timeZone)

    it('is running in that timezone', () => {
      expect(new Date(2026, 4, 12, 12).getTimezoneOffset()).toBe(offsetMinutes)
    })

    it.each([
      [0, 30],
      [12, 0],
      [23, 30],
    ])(
      'counts payments due today or later at %i:%i local time on May 12',
      async (hours, minutes) => {
        vi.setSystemTime(new Date(2026, 4, 12, hours, minutes))
        const { tables, db } = createFakeDb()
        const days = [
          ['2026-05-11', 1],
          ['2026-05-12', 10],
          ['2026-05-13', 100],
        ] as const
        tables.credit_card.findMany.mockResolvedValue(
          days.map(([day, amount]) =>
            cardRow({ id: `card-${day}`, dueDate: utc(day), amountDue: amount }),
          ),
        )
        tables.loan.findMany.mockResolvedValue(
          days.map(([day, amount]) =>
            loanRow({
              id: `loan-${day}`,
              nextPayment: utc(day),
              monthlyPayment: amount,
              autoPay: true,
            }),
          ),
        )
        tables.recurring_bill.findMany.mockResolvedValue(
          days.map(([day, amount]) =>
            billRow({
              id: `bill-${day}`,
              dueDate: utc(day),
              amount,
              autoPay: true,
            }),
          ),
        )

        const result = await getDashboardData(db, verifiedSession)

        expect(result.stats).toEqual({
          totalDue: 330,
          upcomingPaymentsCount: 6,
          autoPayCount: 4,
        })
      },
    )
  })

  describe("'today' on a UTC server", () => {
    useTimezone('UTC')

    // KNOWN ISSUE (documents current behaviour): "today" is the server's
    // calendar day, while PaymentCard status and the "due this week" text use
    // the browser's. At 9pm on May 11 in New York it is already May 12 in UTC
    // (Netlify), so a bill due May 11 shows "Due Soon" on its card but is left
    // out of Total Upcoming and Upcoming Payments.
    it("uses the server's calendar day, not the user's", async () => {
      vi.setSystemTime(new Date('2026-05-12T01:00:00.000Z'))
      const { tables, db } = createFakeDb()
      tables.recurring_bill.findMany.mockResolvedValue([
        billRow({ dueDate: utc('2026-05-11'), amount: 40 }),
      ])

      const result = await getDashboardData(db, verifiedSession)

      expect(result.stats).toEqual({
        totalDue: 0,
        upcomingPaymentsCount: 0,
        autoPayCount: 0,
      })
    })
  })
})

// ---------------------------------------------------------------------------
// addPayment — maps the common input onto each table's columns
// ---------------------------------------------------------------------------
describe('addPayment', () => {
  const common = {
    name: 'Name',
    provider: 'Provider',
    amount: 120,
    date: '2026-05-20',
  }
  // Every optional field set, so each branch has to pick only its own.
  // Due dates must come out as UTC midnight of the chosen day even though the
  // tests run west of UTC.
  const everyField = {
    ...common,
    minimumPayment: 35,
    remainingBalance: 12000,
    status: 'Overdue',
    category: 'Internet',
    autoPay: true,
    frequency: 'biweekly',
  } as const

  const cases: Array<{
    type: PaymentType
    full: Record<string, unknown>
    defaults: Record<string, unknown>
  }> = [
    {
      type: 'credit_card',
      full: {
        amountDue: 120,
        dueDate: utc('2026-05-20'),
        minimumPayment: 35,
        status: 'Overdue',
      },
      defaults: {
        amountDue: 120,
        dueDate: utc('2026-05-20'),
        minimumPayment: 0,
        status: 'Due Soon',
      },
    },
    {
      type: 'loan',
      full: {
        monthlyPayment: 120,
        nextPayment: utc('2026-05-20'),
        remainingBalance: 12000, // was always stored as 0 before #31
        autoPay: true,
      },
      defaults: {
        monthlyPayment: 120,
        nextPayment: utc('2026-05-20'),
        remainingBalance: 0,
        autoPay: false,
      },
    },
    {
      type: 'recurring_bill',
      full: {
        amount: 120,
        dueDate: utc('2026-05-20'),
        category: 'Internet',
        autoPay: true,
        frequency: 'biweekly',
      },
      defaults: {
        amount: 120,
        dueDate: utc('2026-05-20'),
        category: 'Utilities',
        autoPay: false,
        frequency: 'monthly',
      },
    },
  ]

  describe.each(cases)('$type', ({ type, full, defaults }) => {
    it('writes only its own columns, with userId and updatedAt', async () => {
      const { tables, db } = createFakeDb()
      const result = await addPayment(db, verifiedSession, {
        ...everyField,
        type,
      })

      expect(result).toEqual({ success: true })
      expect(dbCalls(tables)).toEqual([`${type}.create`])
      expect(tables[type].create).toHaveBeenCalledWith({
        data: {
          userId: USER_ID,
          name: 'Name',
          provider: 'Provider',
          ...full,
          updatedAt: NOW,
        },
      })
    })

    it('fills in defaults for omitted optional fields', async () => {
      const { tables, db } = createFakeDb()
      await addPayment(db, verifiedSession, { ...common, type })

      expect(tables[type].create).toHaveBeenCalledWith({
        data: {
          userId: USER_ID,
          name: 'Name',
          provider: 'Provider',
          ...defaults,
          updatedAt: NOW,
        },
      })
    })
  })

  it('returns a failure result and logs when the insert fails', async () => {
    const { tables, db } = createFakeDb()
    const error = new Error('connection reset')
    tables.loan.create.mockRejectedValue(error)

    const result = await addPayment(db, verifiedSession, {
      ...common,
      type: 'loan',
    })

    expect(result).toEqual({ success: false, error: 'Failed to add payment' })
    expect(console.error).toHaveBeenCalledWith('Failed to add payment', error)
  })
})

// ---------------------------------------------------------------------------
// updatePayment — ownership check, then a column-mapped update
// ---------------------------------------------------------------------------
describe('updatePayment', () => {
  const common = {
    id: 'payment-1',
    name: 'Renamed',
    provider: 'New Provider',
    amount: 80,
    date: '2026-06-02',
  }

  const cases: Array<{
    type: PaymentType
    existing: Record<string, unknown>
    input: Partial<UpdateInput>
    expected: Record<string, unknown>
  }> = [
    {
      type: 'credit_card',
      existing: cardRow({ id: 'payment-1' }),
      input: { minimumPayment: 40, status: 'Overdue', remainingBalance: 1 },
      expected: {
        amountDue: 80,
        dueDate: utc('2026-06-02'),
        minimumPayment: 40,
        status: 'Overdue',
      },
    },
    {
      type: 'loan',
      existing: loanRow({ id: 'payment-1' }),
      input: { remainingBalance: 8000, autoPay: true, minimumPayment: 1 },
      expected: {
        monthlyPayment: 80,
        nextPayment: utc('2026-06-02'),
        remainingBalance: 8000,
        autoPay: true,
      },
    },
    {
      type: 'recurring_bill',
      existing: billRow({ id: 'payment-1' }),
      input: {
        category: 'Internet',
        autoPay: true,
        frequency: 'biweekly',
        remainingBalance: 1,
      },
      expected: {
        amount: 80,
        dueDate: utc('2026-06-02'),
        category: 'Internet',
        autoPay: true,
        frequency: 'biweekly',
      },
    },
  ]

  describe.each(cases)('$type', ({ type, existing, input, expected }) => {
    it('rejects a payment that does not exist, without writing', async () => {
      const { tables, db } = createFakeDb()
      tables[type].findUnique.mockResolvedValue(null)

      const result = await updatePayment(db, verifiedSession, {
        ...common,
        ...input,
        type,
      })

      expect(result).toEqual({ success: false, error: 'Payment not found' })
      expect(tables[type].findUnique).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
      })
      expect(dbCalls(tables)).toEqual([`${type}.findUnique`])
    })

    it("rejects another user's payment, without writing", async () => {
      const { tables, db } = createFakeDb()
      tables[type].findUnique.mockResolvedValue({
        ...existing,
        userId: OTHER_USER_ID,
      })

      const result = await updatePayment(db, verifiedSession, {
        ...common,
        ...input,
        type,
      })

      expect(result).toEqual({ success: false, error: 'Payment not found' })
      expect(dbCalls(tables)).toEqual([`${type}.findUnique`])
    })

    it("updates the owner's payment with its own columns and a fresh updatedAt", async () => {
      const { tables, db } = createFakeDb()
      tables[type].findUnique.mockResolvedValue(existing)

      const result = await updatePayment(db, verifiedSession, {
        ...common,
        ...input,
        type,
      })

      expect(result).toEqual({ success: true })
      expect(dbCalls(tables)).toEqual([`${type}.findUnique`, `${type}.update`])
      expect(tables[type].update).toHaveBeenCalledWith({
        where: { id: 'payment-1' },
        data: {
          name: 'Renamed',
          provider: 'New Provider',
          ...expected,
          updatedAt: NOW,
        },
      })
    })

    it('returns a failure result and logs when the write fails', async () => {
      const { tables, db } = createFakeDb()
      const error = new Error('connection reset')
      tables[type].findUnique.mockResolvedValue(existing)
      tables[type].update.mockRejectedValue(error)

      const result = await updatePayment(db, verifiedSession, {
        ...common,
        type,
      })

      expect(result).toEqual({
        success: false,
        error: 'Failed to update payment',
      })
      expect(console.error).toHaveBeenCalledWith(
        'Failed to update payment',
        error,
      )
    })
  })

  it('resets an omitted credit card minimum payment to 0 and status to Due Soon', async () => {
    const { tables, db } = createFakeDb()
    tables.credit_card.findUnique.mockResolvedValue(
      cardRow({ id: 'payment-1', minimumPayment: 25, status: 'Overdue' }),
    )

    await updatePayment(db, verifiedSession, { ...common, type: 'credit_card' })

    expect(tables.credit_card.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      data: expect.objectContaining({
        minimumPayment: 0,
        status: 'Due Soon',
      }),
    })
  })

  it("keeps a loan's stored remaining balance when none is sent", async () => {
    const { tables, db } = createFakeDb()
    tables.loan.findUnique.mockResolvedValue(
      loanRow({ id: 'payment-1', remainingBalance: 9000, autoPay: true }),
    )

    await updatePayment(db, verifiedSession, { ...common, type: 'loan' })

    expect(tables.loan.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      // autoPay is not kept: an omitted flag turns auto-pay off
      data: expect.objectContaining({
        remainingBalance: 9000,
        autoPay: false,
      }),
    })
  })

  it('saves a remaining balance of 0 rather than keeping the stored one', async () => {
    const { tables, db } = createFakeDb()
    tables.loan.findUnique.mockResolvedValue(
      loanRow({ id: 'payment-1', remainingBalance: 9000 }),
    )

    await updatePayment(db, verifiedSession, {
      ...common,
      type: 'loan',
      remainingBalance: 0,
    })

    expect(tables.loan.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      data: expect.objectContaining({ remainingBalance: 0 }),
    })
  })

  it('defaults an omitted bill frequency, category and auto-pay', async () => {
    const { tables, db } = createFakeDb()
    tables.recurring_bill.findUnique.mockResolvedValue(
      billRow({
        id: 'payment-1',
        frequency: 'biweekly',
        category: 'Streaming',
        autoPay: true,
      }),
    )

    await updatePayment(db, verifiedSession, {
      ...common,
      type: 'recurring_bill',
    })

    expect(tables.recurring_bill.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' },
      data: expect.objectContaining({
        frequency: 'monthly',
        category: 'Utilities',
        autoPay: false,
      }),
    })
  })

  it('returns a failure result when the ownership lookup fails', async () => {
    const { tables, db } = createFakeDb()
    tables.loan.findUnique.mockRejectedValue(new Error('timeout'))

    const result = await updatePayment(db, verifiedSession, {
      ...common,
      type: 'loan',
    })

    expect(result).toEqual({ success: false, error: 'Failed to update payment' })
    expect(tables.loan.update).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// deletePayment — the delete itself is scoped to the user
// ---------------------------------------------------------------------------
describe('deletePayment', () => {
  it.each(PAYMENT_TYPES)(
    'deletes the %s by id and userId',
    async (type) => {
      const { tables, db } = createFakeDb()

      const result = await deletePayment(db, verifiedSession, {
        id: 'payment-1',
        type,
      })

      expect(result).toEqual({ success: true })
      expect(dbCalls(tables)).toEqual([`${type}.delete`])
      expect(tables[type].delete).toHaveBeenCalledWith({
        where: { id: 'payment-1', userId: USER_ID },
      })
    },
  )

  it.each(PAYMENT_TYPES)(
    'returns a failure result when no %s matches (missing or not yours)',
    async (type) => {
      const { tables, db } = createFakeDb()
      // Prisma throws P2025 when the where clause matches no row
      const error = new Error('No record was found for a delete.')
      tables[type].delete.mockRejectedValue(error)

      const result = await deletePayment(db, verifiedSession, {
        id: 'someone-elses-payment',
        type,
      })

      expect(result).toEqual({
        success: false,
        error: 'Failed to delete payment',
      })
      expect(console.error).toHaveBeenCalledWith(
        'Failed to delete payment',
        error,
      )
    },
  )
})

// ---------------------------------------------------------------------------
// Input schemas — what the server functions accept before any handler runs
// ---------------------------------------------------------------------------
describe('AddPaymentSchema', () => {
  const valid: AddInput = {
    type: 'loan',
    name: 'Auto Loan',
    provider: 'Honda Finance',
    amount: 300,
    date: '2026-05-20',
  }

  it.each(PAYMENT_TYPES)('accepts a minimal %s', (type) => {
    expect(AddPaymentSchema.safeParse({ ...valid, type }).success).toBe(true)
  })

  it('accepts every optional field and a zero amount', () => {
    const result = AddPaymentSchema.safeParse({
      ...valid,
      amount: 0,
      minimumPayment: 0,
      remainingBalance: 0,
      status: 'Due Soon',
      category: 'Utilities',
      autoPay: true,
      frequency: 'biweekly',
    })
    expect(result.success).toBe(true)
  })

  it('drops keys it does not know, such as userId', () => {
    const parsed = AddPaymentSchema.parse({ ...valid, userId: OTHER_USER_ID })
    expect(parsed).not.toHaveProperty('userId')
  })

  it.each([
    ['an unknown type', { type: 'mortgage' }],
    ['a missing name', { name: undefined }],
    ['an empty name', { name: '' }],
    ['an empty provider', { provider: '' }],
    ['a negative amount', { amount: -1 }],
    ['an amount sent as a string', { amount: '300' }],
    ['NaN as the amount', { amount: Number.NaN }],
    ['an infinite amount', { amount: Number.POSITIVE_INFINITY }],
    ['a negative minimum payment', { minimumPayment: -5 }],
    ['a negative remaining balance', { remainingBalance: -5 }],
    ['an unknown frequency', { frequency: 'weekly' }],
    ['a non-boolean autoPay', { autoPay: 'yes' }],
    ['a missing date', { date: undefined }],
    ['an empty date', { date: '' }],
    ['a day that does not exist', { date: '2026-02-30' }],
    ['a full ISO timestamp', { date: '2026-05-20T00:00:00.000Z' }],
    ['a US-style date', { date: '05/20/2026' }],
  ])('rejects %s', (_label, override) => {
    expect(AddPaymentSchema.safeParse({ ...valid, ...override }).success).toBe(
      false,
    )
  })
})

describe('UpdatePaymentSchema', () => {
  const valid: UpdateInput = {
    id: 'payment-1',
    type: 'recurring_bill',
    name: 'Netflix',
    provider: 'Netflix',
    amount: 15,
    date: '2026-05-20',
  }

  it('accepts a payment with an id', () => {
    expect(UpdatePaymentSchema.safeParse(valid).success).toBe(true)
  })

  it('requires an id', () => {
    expect(
      UpdatePaymentSchema.safeParse({ ...valid, id: undefined }).success,
    ).toBe(false)
  })

  it('keeps the add rules for amount and date', () => {
    expect(UpdatePaymentSchema.safeParse({ ...valid, amount: -1 }).success).toBe(
      false,
    )
    expect(
      UpdatePaymentSchema.safeParse({ ...valid, date: '2026-13-01' }).success,
    ).toBe(false)
  })

  it('drops keys it does not know, such as userId', () => {
    const parsed = UpdatePaymentSchema.parse({ ...valid, userId: OTHER_USER_ID })
    expect(parsed).not.toHaveProperty('userId')
  })
})

describe('DeletePaymentSchema', () => {
  it.each(PAYMENT_TYPES)('accepts an id and the %s type', (type) => {
    expect(DeletePaymentSchema.safeParse({ id: 'payment-1', type }).success).toBe(
      true,
    )
  })

  it.each([
    ['a missing id', { type: 'loan' }],
    ['a missing type', { id: 'payment-1' }],
    ['an unknown type', { id: 'payment-1', type: 'mortgage' }],
  ])('rejects %s', (_label, input) => {
    expect(DeletePaymentSchema.safeParse(input).success).toBe(false)
  })
})
