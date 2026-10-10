-- These tables were originally created outside of migrations, so a fresh
-- database could not be built from the migration history. Every statement is
-- idempotent so this is a no-op on databases that already have them.

-- CreateTable
CREATE TABLE IF NOT EXISTS "credit_card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "minimumPayment" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_card_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "credit_card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "loan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "monthlyPayment" DOUBLE PRECISION NOT NULL,
    "nextPayment" TIMESTAMP(3) NOT NULL,
    "remainingBalance" DOUBLE PRECISION NOT NULL,
    "autoPay" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable ("frequency" is added by the next migration)
CREATE TABLE IF NOT EXISTS "recurring_bill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "autoPay" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_bill_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "recurring_bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "credit_card_userId_idx" ON "credit_card"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "loan_userId_idx" ON "loan"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "recurring_bill_userId_idx" ON "recurring_bill"("userId");
