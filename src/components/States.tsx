import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { motion } from 'framer-motion'
import { fadeIn } from '../lib/motion'

export function PageLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="h-28 w-28 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
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