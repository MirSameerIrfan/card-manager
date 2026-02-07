import { redirect } from '@tanstack/react-router'
import { getSessionFn } from '@/utils/auth.functions'

const isRedirectError = (
  error: unknown,
): error is { isRedirect: boolean } =>
  typeof error === 'object' &&
  error !== null &&
  'isRedirect' in error &&
  (error as { isRedirect?: boolean }).isRedirect === true

export async function redirectIfAuthenticated(to: string = '/dashboard') {
  try {
    const session = await getSessionFn()
    if (session?.user) {
      throw redirect({ to })
    }
  } catch (error) {
    // Re-throw redirects, swallow session lookup errors to allow guest routes.
    if (error instanceof Response || isRedirectError(error)) {
      throw error
    }
  }
}
