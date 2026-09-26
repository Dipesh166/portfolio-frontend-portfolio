import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '../components/Section'
import { usePortfolio } from '../hooks/usePortfolio'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'

export function Achievements() {
  const { data } = usePortfolio()
  const achievements = data?.achievements ?? []

  if (achievements.length === 0) return null

  return (
    <Section id="achievements" index="07" title="Achievements" subtitle="// milestones & honors along the way">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2"
      >
        {achievements.map((achievement) => (
          <motion.div key={achievement.id} variants={itemFadeUp} className="flex">
            <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/50">
              <div
                className="dot-dense pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-3">
                <span className="rounded-lg bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
                  #{achievement.title.toLowerCase().replace(/\s+/g, '-') || 'award'}
                </span>
                {achievement.url ? (
                  <a
                    href={achievement.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    aria-label="Open achievement link"
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-sm font-black text-primary"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                )}
              </div>

              <div className="relative mt-3">
                <h3 className="font-mono text-sm font-bold text-foreground">{achievement.title}</h3>
                {achievement.date ? (
                  <p className="mt-0.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                    {achievement.date}
                  </p>
                ) : null}
                {achievement.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {achievement.description}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}