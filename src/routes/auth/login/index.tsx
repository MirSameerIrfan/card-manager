import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { redirectIfAuthenticated } from '@/utils/route-guards'
import { LoginPage } from '@/components/auth/LoginPage'

const loginSearchSchema = z.object({
  error: z.string().optional(),
})

export const Route = createFileRoute('/auth/login/')({
  validateSearch: loginSearchSchema,
  beforeLoad: async () => redirectIfAuthenticated(),
  component: LoginPage,
})
