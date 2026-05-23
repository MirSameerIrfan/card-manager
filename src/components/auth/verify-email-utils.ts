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
