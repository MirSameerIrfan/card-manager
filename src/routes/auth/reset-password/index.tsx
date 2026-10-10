import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPasswordPage } from '@/components/auth/ResetPasswordPage'

// better-auth validates the emailed link at /api/auth/reset-password/:token and
// redirects here with either ?token= (valid) or ?error= (invalid or expired).
const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/auth/reset-password/')({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage,
})
