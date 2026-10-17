import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/components/auth/password-reset-utils'

/** The error authClient.* calls resolve with (better-fetch adds `status`). */
export type AuthClientError = {
  status?: number
  code?: string
  message?: string
}

/**
 * Message to show for an authClient error on the login and profile pages.
 * Unknown errors show better-auth's own message, or the fallback.
 */
export function getAuthErrorMessage(
  error: AuthClientError | null | undefined,
  fallback: string,
): string {
  if (!error) return fallback

  // better-auth's rate limiter answers 429 on /api/auth/* in production.
  if (error.status === 429) {
    return 'Too many requests. Please wait a minute and try again.'
  }

  switch (error.code) {
    case 'INVALID_PASSWORD':
      return 'Current password is incorrect.'
    case 'PASSWORD_TOO_SHORT':
      return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    case 'PASSWORD_TOO_LONG':
      return `New password must be at most ${MAX_PASSWORD_LENGTH} characters.`
  }

  // /change-email reports this with a message but no error code.
  if (error.message?.toLowerCase().includes('email is the same')) {
    return 'Please enter a different email address.'
  }

  return error.message || fallback
}
