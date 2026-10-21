import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('auth emails', () => {
  it.each([
    ['verification', sendVerificationEmail, 'Verify your email for MoneyScope'],
    ['password reset', sendPasswordResetEmail, 'Reset your MoneyScope password'],
  ] as const)('sends the %s email through Resend, replies going to the contact inbox', async (_label, send, subject) => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetch = vi.fn().mockResolvedValue(new Response('{}'))
    vi.stubGlobal('fetch', fetch)

    await send({ user: { email: 'ada@example.com' }, url: 'https://money-scope.app/x?a=1&b="2"' })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe('https://api.resend.com/emails')
    const body = JSON.parse(fetch.mock.calls[0][1].body as string)
    expect(body).toMatchObject({ to: ['ada@example.com'], subject, reply_to: 'info@money-scope.app' })
    expect(body.html).toContain('href="https://money-scope.app/x?a=1&amp;b=&quot;2&quot;"')
  })

  it('logs the link instead of emailing when no Resend key is set', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    await sendVerificationEmail({ user: { email: 'ada@example.com' }, url: 'https://x.test/verify' })

    expect(fetch).not.toHaveBeenCalled()
    expect(info).toHaveBeenCalledWith('[Auth] Verification link for ada@example.com: https://x.test/verify')
  })

  it('throws when Resend rejects the email', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('quota', { status: 429 })))
    await expect(
      sendPasswordResetEmail({ user: { email: 'ada@example.com' }, url: 'https://x.test' }),
    ).rejects.toThrow('Failed to send email: 429 quota')
  })
})
