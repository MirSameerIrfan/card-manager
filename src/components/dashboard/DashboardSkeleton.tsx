function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-3 w-24 rounded-full bg-gray-100" />
          <div className="h-8 w-28 rounded-xl bg-gray-200" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-gray-100" />
      </div>
    </div>
  )
}

function SkeletonPaymentCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gray-100" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-100" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-gray-100" />
          <div className="h-5 w-20 rounded bg-gray-200" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-3 w-16 rounded bg-gray-100" />
          <div className="h-6 w-20 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

function SkeletonSectionTitle() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gray-100" />
        <div className="h-6 w-36 rounded bg-gray-200" />
        <div className="h-5 w-8 rounded-full bg-gray-100" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="h-3 w-24 rounded-full bg-emerald-100" />
            <div className="h-10 w-64 rounded-2xl bg-gray-200" />
            <div className="h-5 w-80 rounded-xl bg-gray-100" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-12 w-40 rounded-xl bg-gray-100" />
            <div className="h-12 w-36 rounded-xl bg-emerald-200" />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </section>

        <section className="space-y-6">
          <SkeletonSectionTitle />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonPaymentCard />
            <SkeletonPaymentCard />
            <SkeletonPaymentCard />
          </div>
        </section>

        <section className="space-y-6">
          <SkeletonSectionTitle />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonPaymentCard />
            <SkeletonPaymentCard />
            <SkeletonPaymentCard />
          </div>
        </section>

        <section className="space-y-6">
          <SkeletonSectionTitle />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonPaymentCard />
            <SkeletonPaymentCard />
            <SkeletonPaymentCard />
          </div>
        </section>
      </div>
    </main>
  )
}
