import { describe, expect, it } from 'vitest'
import {
  getResetPasswordErrorMessage,
  validateNewPassword,
  validatePasswordConfirmation,
} from './password-reset-utils'

describe('getResetPasswordErrorMessage', () => {
  it('explains an invalid or expired link', () => {
    for (const code of ['INVALID_TOKEN', 'invalid_token']) {
      const msg = getResetPasswordErrorMessage(code)
      expect(msg).toContain('invalid or has expired')
      expect(msg).toContain('request a new one')
    }
  })

  it('explains password length errors', () => {
    expect(getResetPasswordErrorMessage('PASSWORD_TOO_SHORT')).toContain('at least 8')
    expect(getResetPasswordErrorMessage('PASSWORD_TOO_LONG')).toContain('at most 128')
  })

  it('falls back to a generic message that leaks no details', () => {
    for (const code of ['USER_NOT_FOUND', 'something_else', '', null, undefined]) {
      expect(getResetPasswordErrorMessage(code)).toBe(
        'We could not reset your password. Please request a new reset link.',
      )
    }
  })
})

describe('validateNewPassword', () => {
  it('requires a password', () => {
    expect(validateNewPassword('')).toBe('Password is required')
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(validateNewPassword('1234567')).toContain('at least 8')
  })

  it('rejects passwords longer than 128 characters', () => {
    expect(validateNewPassword('a'.repeat(129))).toContain('at most 128')
  })

  it('accepts passwords at both length limits', () => {
    expect(validateNewPassword('12345678')).toBeUndefined()
    expect(validateNewPassword('a'.repeat(128))).toBeUndefined()
  })
})

describe('validatePasswordConfirmation', () => {
  it('requires a confirmation', () => {
    expect(validatePasswordConfirmation('password1234', '')).toBe(
      'Please confirm your password',
    )
  })

  it('rejects a confirmation that differs', () => {
    expect(validatePasswordConfirmation('password1234', 'password12345')).toBe(
      'Passwords do not match',
    )
  })

  it('accepts a matching confirmation', () => {
    expect(validatePasswordConfirmation('password1234', 'password1234')).toBeUndefined()
  })
})
