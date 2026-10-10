export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 128

/**
 * Maps better-auth error codes (from the reset link redirect or the
 * reset-password API) to messages shown on the /auth/reset-password page.
 */
export function getResetPasswordErrorMessage(code?: string | null): string {
  switch (code) {
    case 'INVALID_TOKEN':
    case 'invalid_token':
      return 'This password reset link is invalid or has expired. Please request a new one.'
    case 'PASSWORD_TOO_SHORT':
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    case 'PASSWORD_TOO_LONG':
      return `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`
    default:
      return 'We could not reset your password. Please request a new reset link.'
  }
}

export function validateNewPassword(password: string): string | undefined {
  if (!password) return 'Password is required'
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters`
  }
  return undefined
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | undefined {
  if (!confirmation) return 'Please confirm your password'
  if (password !== confirmation) return 'Passwords do not match'
  return undefined
}
