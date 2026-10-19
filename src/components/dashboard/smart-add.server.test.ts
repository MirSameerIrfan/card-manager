import { describe, expect, it, vi } from 'vitest'
import {
  ExtractPaymentSchema,
  SMART_ADD_DAILY_LIMIT,
  SMART_ADD_MODEL,
  extractPayment,
} from '@/components/dashboard/smart-add.server'
import type { DashboardSession } from '@/components/dashboard/dashboard.server'

const NOW = new Date('2026-10-19T15:00:00.000Z')
const session: DashboardSession = { user: { id: 'user-1', emailVerified: true } }
const textInput = { text: 'Hydro One bill. Amount due $84.20 by Nov 3.', today: '2026-10-19' }

const fakeDb = (used = 0) => {
  const count = vi.fn().mockResolvedValue(used)
  const create = vi.fn().mockResolvedValue({})
  return { count, create, db: { ai_request: { count, create } } as never }
}

/** A Messages API response whose tool call carries `input`. */
const claudeReply = (input: unknown) =>
  vi.fn().mockResolvedValue(
    Response.json({
      content: [{ type: 'tool_use', id: 'toolu_1', name: 'record_payment', input }],
    }),
  )

const sentBody = (fetchFn: ReturnType<typeof vi.fn>) =>
  JSON.parse(fetchFn.mock.calls[0][1].body as string)

describe('extractPayment', () => {
  it('rejects an unverified user before touching the database or Claude', async () => {
    const { db, count } = fakeDb()
    const fetchFn = claudeReply({ found: true })
    await expect(
      extractPayment(db, { user: { id: 'user-1', emailVerified: false } }, textInput, {
        apiKey: 'key',
        fetchFn,
      }),
    ).rejects.toThrow('Unauthorized')
    expect(count).not.toHaveBeenCalled()
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('says Smart add is unavailable when no API key is configured', async () => {
    const { db, create } = fakeDb()
    const fetchFn = claudeReply({ found: true })
    const result = await extractPayment(db, session, textInput, { apiKey: '', fetchFn })
    expect(result).toEqual({ success: false, error: "Smart add isn't available right now." })
    expect(create).not.toHaveBeenCalled()
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('stops at the daily limit, counting the last 24 hours', async () => {
    const { db, count, create } = fakeDb(SMART_ADD_DAILY_LIMIT)
    const fetchFn = claudeReply({ found: true })

    const result = await extractPayment(db, session, textInput, { apiKey: 'key', fetchFn, now: NOW })

    expect(count).toHaveBeenCalledWith({
      where: { userId: 'user-1', createdAt: { gt: new Date('2026-10-18T15:00:00.000Z') } },
    })
    expect(result).toEqual({
      success: false,
      error: `You've used Smart add ${SMART_ADD_DAILY_LIMIT} times in the last 24 hours. Please try again later.`,
    })
    expect(create).not.toHaveBeenCalled()
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('records the request, then asks Claude with a forced tool call', async () => {
    const { db, create } = fakeDb(SMART_ADD_DAILY_LIMIT - 1)
    const fetchFn = claudeReply({ found: false })

    await extractPayment(db, session, textInput, { apiKey: 'secret-key', fetchFn, now: NOW })

    expect(create).toHaveBeenCalledWith({ data: { userId: 'user-1' } })
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('https://api.anthropic.com/v1/messages')
    expect(init.headers).toMatchObject({ 'x-api-key': 'secret-key', 'anthropic-version': '2023-06-01' })
    const body = sentBody(fetchFn)
    expect(body.model).toBe(SMART_ADD_MODEL)
    expect(body.tool_choice).toEqual({ type: 'tool', name: 'record_payment' })
    expect(body.system).toContain('Today is 2026-10-19')
    expect(body.messages[0].content[0]).toEqual({
      type: 'text',
      text: `<document>\n${textInput.text}\n</document>`,
    })
  })

  it.each([
    ['image/png', 'image'],
    ['application/pdf', 'document'],
  ] as const)('sends a %s file as a base64 %s block', async (mediaType, blockType) => {
    const { db } = fakeDb()
    const fetchFn = claudeReply({ found: false })

    await extractPayment(
      db,
      session,
      { file: { mediaType, data: 'QUJD' }, today: '2026-10-19' },
      { apiKey: 'key', fetchFn },
    )

    expect(sentBody(fetchFn).messages[0].content[0]).toEqual({
      type: blockType,
      source: { type: 'base64', media_type: mediaType, data: 'QUJD' },
    })
  })

  it('returns the fields Claude found, dropping ones that are not valid', async () => {
    const { db } = fakeDb()
    const fetchFn = claudeReply({
      found: true,
      type: 'recurring_bill',
      name: `  Hydro One ${'x'.repeat(200)}`,
      provider: 'Hydro One',
      amount: 84.2,
      dueDate: '2026-11-03',
      minimumPayment: -5, // not a valid amount: dropped
      category: 'Utilities',
      frequency: 'weekly', // not one of ours: dropped
    })

    const result = await extractPayment(db, session, textInput, { apiKey: 'key', fetchFn })

    expect(result.success).toBe(true)
    expect(result.payment).toEqual({
      type: 'recurring_bill',
      name: `Hydro One ${'x'.repeat(90)}`,
      provider: 'Hydro One',
      amount: 84.2,
      dueDate: '2026-11-03',
      category: 'Utilities',
    })
  })

  it.each([
    ['says it is not a bill', { found: false }],
    ['returns a malformed tool call', { amount: 5 }],
  ])('returns an error when Claude %s', async (_label, input) => {
    const { db } = fakeDb()
    const result = await extractPayment(db, session, textInput, {
      apiKey: 'key',
      fetchFn: claudeReply(input),
    })
    expect(result).toEqual({
      success: false,
      error: "Claude couldn't find a payment in that. Try a clearer photo, or paste the text.",
    })
  })

  it('throws when the API call fails, so the error reaches Sentry', async () => {
    const { db } = fakeDb()
    const fetchFn = vi.fn().mockResolvedValue(new Response('invalid x-api-key', { status: 401 }))
    await expect(
      extractPayment(db, session, textInput, { apiKey: 'bad', fetchFn }),
    ).rejects.toThrow('Anthropic API 401: invalid x-api-key')
  })
})

describe('ExtractPaymentSchema', () => {
  const file = { mediaType: 'image/jpeg', data: 'QUJD' }

  it.each([
    ['text', { text: 'A bill' }],
    ['a file', { file }],
  ])('accepts %s with a calendar day', (_label, input) => {
    expect(ExtractPaymentSchema.safeParse({ ...input, today: '2026-10-19' }).success).toBe(true)
  })

  it.each([
    ['both text and a file', { text: 'A bill', file, today: '2026-10-19' }],
    ['neither', { today: '2026-10-19' }],
    ['blank text', { text: '   ', today: '2026-10-19' }],
    ['a file type Claude cannot read', { file: { ...file, mediaType: 'image/heic' }, today: '2026-10-19' }],
    ['a file over the size limit', { file: { ...file, data: 'A'.repeat(6_000_000) }, today: '2026-10-19' }],
    ['a missing day', { text: 'A bill' }],
  ])('rejects %s', (_label, input) => {
    expect(ExtractPaymentSchema.safeParse(input).success).toBe(false)
  })
})
