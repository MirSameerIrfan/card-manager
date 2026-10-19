/**
 * Maps better-auth error codes to human-readable messages shown
 * on the /auth/verify-email page.
 */
export function getVerifyEmailErrorMessage(code: string): string {
  switch (code) {
    case 'token_expired':
    case 'EXPIRED_TOKEN':
      return 'Your verification link has expired. Please sign in and request a new one.'
    case 'invalid_token':
    case 'INVALID_TOKEN':
      return 'This verification link is invalid. Please request a new one.'
    case 'user_not_found':
    case 'USER_NOT_FOUND':
      return 'No account was found for this link. Please sign up again.'
    default:
      return 'Email verification failed. Please request a new verification link from the sign-in page.'
  }
}

/**
 * The message for a verification error code in /auth/login?error=, or null.
 * Only better-auth's codes count: anything else (a stray parameter, or text
 * someone put in a link) is ignored instead of showing a verification error.
 */
export function getLoginVerificationErrorMessage(code: string | undefined): string | null {
  switch (code) {
    case 'token_expired':
      return 'Your verification link has expired. Please request a new one below.'
    case 'invalid_token':
      return 'Your verification link is invalid. Please request a new one below.'
    case 'user_not_found':
      return 'No account was found for this verification link. Please sign up again.'
    default:
      return null
  }
}
