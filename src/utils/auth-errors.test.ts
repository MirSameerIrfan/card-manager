import { describe, expect, it } from 'vitest'
import { getAuthErrorMessage } from './auth-errors'

describe('getAuthErrorMessage', () => {
  it('returns the fallback when there is no error', () => {
    expect(getAuthErrorMessage(null, 'Fallback.')).toBe('Fallback.')
    expect(getAuthErrorMessage(undefined, 'Fallback.')).toBe('Fallback.')
  })

  it('explains rate limiting', () => {
    expect(getAuthErrorMessage({ status: 429, message: 'Too many requests' }, 'Fallback.')).toBe(
      'Too many requests. Please wait a minute and try again.',
    )
  })

  it('maps better-auth password error codes', () => {
    expect(getAuthErrorMessage({ status: 400, code: 'INVALID_PASSWORD' }, 'Fallback.')).toBe(
      'Current password is incorrect.',
    )
    expect(getAuthErrorMessage({ status: 400, code: 'PASSWORD_TOO_SHORT' }, 'Fallback.')).toContain(
      'at least 8',
    )
    expect(getAuthErrorMessage({ status: 400, code: 'PASSWORD_TOO_LONG' }, 'Fallback.')).toContain(
      'at most 128',
    )
  })

  it('explains an unchanged email', () => {
    expect(getAuthErrorMessage({ status: 400, message: 'Email is the same' }, 'Fallback.')).toBe(
      'Please enter a different email address.',
    )
  })

  it("shows better-auth's message for other errors, or the fallback", () => {
    expect(getAuthErrorMessage({ status: 401, message: 'Unauthorized' }, 'Fallback.')).toBe(
      'Unauthorized',
    )
    expect(getAuthErrorMessage({ status: 500 }, 'Fallback.')).toBe('Fallback.')
  })
})
