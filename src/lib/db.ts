// src/lib/db.ts
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Create a singleton instance of PrismaClient
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  })
} else {
  // In development, use a global variable to preserve the client across HMR
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      }),
    })
  }

  prisma = globalForPrisma.prisma
}

export { prisma }
