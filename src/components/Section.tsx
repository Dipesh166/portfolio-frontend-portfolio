import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from 'cn'
import { fadeUp, viewportOnce } from '../lib/motion'

type SectionProps = {
  id: string
  index?: string
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export function Section({ id, index, title, subtitle, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('relative scroll-mt-24 py-20 sm:py-24', className)}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <header className="mb-12 flex flex-col gap-4">
          <span className="flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.3em] text-primary uppercase">
            <span className="inline-flex h-6 items-center justify-center rounded-md border border-primary/40 bg-primary/10 px-1.5 text-[10px]">
              {index ?? '··'}
            </span>
            {id}
            <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
          </span>

          <h2 className="flex items-center font-dot text-4xl font-black tracking-tight text-foreground uppercase sm:text-6xl">
            {title}
            <span
              className="caret ml-2 inline-block h-[0.85em] w-[0.5ch] translate-y-[0.12em] rounded-[2px] bg-primary"
              aria-hidden="true"
            />
          </h2>

          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-16 bg-primary/60" />
            <span className="h-px flex-1 bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/25" />
          </div>

          {subtitle ? <p className="font-mono text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>
      </motion.div>
      {children}
    </section>
  )
}