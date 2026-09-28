import { Button } from './ui/button'
import { BootLoader, Spinner } from './Loader'
import { Skeleton, SkeletonText } from './ui/skeleton'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/motion'

function SectionHeadingSkeleton() {
  return (
    <div className="mb-10 flex flex-col gap-4">
      <Skeleton className="h-6 w-32 rounded-lg" />
      <Skeleton className="h-11 w-64 rounded-xl sm:h-14 sm:w-80" />
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-3 w-52" />
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-4 w-3/4" />
        <SkeletonText lines={3} />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="w-full">
      <BootLoader title="loading portfolio" compact />

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6" aria-hidden="true">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start gap-6">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-12 w-64 sm:h-16 sm:w-80" />
            <Skeleton className="h-8 w-52 rounded-lg" />
            <SkeletonText lines={4} className="max-w-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
            <div className="absolute -inset-4 rounded-[2.5rem] border border-dashed border-primary/25" />
            <Skeleton className="aspect-square w-full rounded-[2rem]" />
          </div>
        </div>

        <div className="mt-20">
          <SectionHeadingSkeleton />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DetailLoading({ path }: { path?: string }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Spinner className="text-base" />
        <span className="truncate">
          <span className="text-primary">&gt;</span> {path ?? 'loading project'}
        </span>
      </div>

      <Skeleton className="mb-5 h-5 w-24 rounded-lg" />
      <Skeleton className="mb-4 h-10 w-2/3 rounded-xl sm:h-14" />
      <Skeleton className="mb-3 h-4 w-1/2" />

      <div className="mt-6 mb-10 flex gap-3">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      <Skeleton className="mb-10 aspect-video w-full rounded-2xl" />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Skeleton className="mb-5 h-6 w-48" />
          <SkeletonText lines={9} />
        </div>
        <div className="dot-dense relative overflow-hidden rounded-2xl border border-border bg-card p-6">
          <Skeleton className="mb-4 h-3 w-24" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export function ErrorScreen({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-xl">
        &#9888;
      </span>
      <h2 className="text-xl font-bold text-foreground">Couldn&apos;t load portfolio</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </motion.div>
  )
}
