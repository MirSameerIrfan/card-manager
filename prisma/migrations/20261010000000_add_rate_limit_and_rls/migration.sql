-- CreateTable (better-auth rate limit storage)
CREATE TABLE "rateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "lastRequest" BIGINT NOT NULL,

    CONSTRAINT "rateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rateLimit_key_idx" ON "rateLimit"("key");

-- Row level security: the app connects as the table owner, which bypasses RLS.
-- Enabling it with no policies blocks every other role, including the public
-- Data API roles that Supabase exposes for the "public" schema.
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rateLimit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credit_card" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recurring_bill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
