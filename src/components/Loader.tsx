import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from 'cn'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const BOOT_STAGES = [
  'mounting filesystem',
  'resolving api origin',
  'tls handshake complete',
  'GET /public/portfolio',
  'decoding json payload',
  'hydrating sections',
  'ready',
]

export function Spinner({ className }: { className?: string }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const spin = window.setInterval(
      () => setFrame((f) => (f + 1) % SPINNER_FRAMES.length),
      90,
    )
    return () => window.clearInterval(spin)
  }, [])

  return (
    <span
      aria-hidden="true"
      className={cn(
        'font-mono leading-none font-bold text-primary drop-shadow-[0_0_16px_currentColor]',
        className,
      )}
    >
      {SPINNER_FRAMES[frame]}
    </span>
  )
}

export function BootLoader({
  title = 'loading portfolio',
  compact = false,
}: {
  title?: string
  compact?: boolean
}) {
  const [frame, setFrame] = useState(0)
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const spin = window.setInterval(
      () => setFrame((f) => (f + 1) % SPINNER_FRAMES.length),
      90,
    )
    const step = window.setInterval(
      () => setStage((s) => Math.min(s + 1, BOOT_STAGES.length - 1)),
      620,
    )
    const bar = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? 6 + Math.random() * 14 : p + 4 + Math.random() * 13))
    }, 240)

    return () => {
      window.clearInterval(spin)
      window.clearInterval(step)
      window.clearInterval(bar)
    }
  }, [])

  const percent = Math.min(99, Math.round(progress))

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center px-4',
        compact ? 'py-10' : 'min-h-[72vh] py-16',
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <span className="absolute -top-1 -left-1 z-10 h-4 w-4 border-t-2 border-l-2 border-primary" aria-hidden="true" />
        <span className="absolute -top-1 -right-1 z-10 h-4 w-4 border-t-2 border-r-2 border-primary" aria-hidden="true" />
        <span className="absolute -bottom-1 -left-1 z-10 h-4 w-4 border-b-2 border-l-2 border-primary" aria-hidden="true" />
        <span className="absolute -bottom-1 -right-1 z-10 h-4 w-4 border-b-2 border-r-2 border-primary" aria-hidden="true" />

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/85 shadow-2xl shadow-foreground/10 backdrop-blur">
          <div className="animate-scanline pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" aria-hidden="true" />
            <span className="ml-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              portfolio.sh
            </span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
              live
            </span>
          </div>

          <div className="relative px-5 py-6 sm:px-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-5xl leading-none font-bold text-primary drop-shadow-[0_0_18px_currentColor]">
                {SPINNER_FRAMES[frame]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-dot text-2xl leading-none font-black text-foreground uppercase">
                  {title}
                </p>
                <p className="mt-1.5 truncate font-mono text-xs text-muted-foreground">
                  <span className="text-primary">&gt;</span> {BOOT_STAGES[stage]}
                  <span className="caret ml-1 inline-block h-[0.85em] w-[0.45ch] translate-y-[0.1em] rounded-[1px] bg-primary" aria-hidden="true" />
                </p>
              </div>
              <span className="font-mono text-lg font-bold tabular-nums text-foreground/70">
                {percent}
                <span className="text-primary">%</span>
              </span>
            </div>

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={title} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
              <motion.div
                className="relative h-full rounded-full bg-primary"
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <span className="animate-shimmer absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent" aria-hidden="true" />
              </motion.div>
            </div>

            <ul className="mt-5 space-y-1 font-mono text-[11px] text-muted-foreground">
              {BOOT_STAGES.slice(0, Math.max(stage, 1) + 1).map((line, i) => {
                const done = i < stage
                return (
                  <li key={line} className="flex items-center gap-2">
                    <span className={done ? 'text-primary' : 'text-muted-foreground/50'}>
                      {done ? '[ok]' : '[..]'}
                    </span>
                    <span className={done ? 'text-foreground/70' : ''}>{line}</span>
                    {i === stage ? (
                      <span className="caret inline-block h-[0.9em] w-[0.4ch] rounded-[1px] bg-primary" aria-hidden="true" />
                    ) : null}
                  </li>
                )
              })}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              <AnimatePresence mode="popLayout">
                {['h2c', 'tls/1.3', 'json', 'no-cache'].map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border border-border px-2 py-0.5"
                  >
                    {tag}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="dot-dense relative h-1.5 w-full opacity-60" aria-hidden="true" />
        </div>
      </motion.div>
    </div>
  )
}

export function InlineLoader({ label = 'fetching' }: { label?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-20">
      <Spinner className="text-4xl" />
      <p className="font-mono text-sm text-muted-foreground">
        <span className="text-primary">&gt;</span> {label}
        <span className="caret ml-1 inline-block h-[0.9em] w-[0.45ch] translate-y-[0.1em] rounded-[1px] bg-primary" aria-hidden="true" />
      </p>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <span className="animate-indeterminate block h-full w-1/3 rounded-full bg-primary" />
      </div>
    </div>
  )
}

export function TopProgress({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary shadow-[0_0_12px] shadow-primary"
          aria-hidden="true"
        >
          <span className="animate-indeterminate block h-full w-1/3 bg-primary-foreground/70" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
