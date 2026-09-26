import { motion } from 'framer-motion'
import { cn } from 'cn'
import { Section } from '../components/Section'
import { usePortfolio } from '../hooks/usePortfolio'
import { resolveUrl } from '../lib/api'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'
import type { Skill } from '../lib/types'

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category || 'Other'
    ;(acc[key] ??= []).push(skill)
    return acc
  }, {})
}

function levelToDots(level?: string): number {
  const value = (level ?? '').trim().toLowerCase()
  const map: Record<string, number> = {
    basic: 1,
    beginner: 1,
    fundamental: 1,
    intermediate: 3,
    mid: 3,
    moderate: 3,
    advanced: 4,
    strong: 4,
    pro: 4,
    proficient: 4,
    expert: 5,
    master: 5,
  }
  if (value in map) return map[value]
  const parsed = Number.parseInt(value, 10)
  if (!Number.isNaN(parsed)) return Math.max(1, Math.min(5, Math.round(parsed / 20)))
  return 3
}

export function Skills() {
  const { data } = usePortfolio()
  const skills = data?.skills ?? []

  if (skills.length === 0) return null

  const grouped = groupByCategory(skills)

  return (
    <Section id="skills" index="02" title="Skills" subtitle="// tools & technologies i work with">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto flex max-w-5xl flex-col gap-10"
      >
        {Object.entries(grouped).map(([category, items]) => (
          <motion.div key={category} variants={itemFadeUp} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-primary uppercase">
                {category}
              </span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              <span className="font-mono text-xs text-muted-foreground">
                [{items.length}] entries
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((skill) => {
                const dots = levelToDots(skill.level)
                return (
                  <motion.div key={skill.id} variants={itemFadeUp}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-4 transition-colors duration-300 hover:border-primary/50">
                      <div
                        className="dot-dense pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      <div className="relative flex items-center gap-3">
                        {skill.image ? (
                          <img
                            src={resolveUrl(skill.image.url)}
                            alt={skill.image.alt || skill.name}
                            className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-border"
                          />
                        ) : skill.icon ? (
                          <img
                            src={skill.icon}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-border"
                          />
                        ) : (
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-sm font-black text-primary">
                            {skill.name.charAt(0)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-foreground">{skill.name}</p>
                          <p className="truncate font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                            {skill.level || 'skill'}
                          </p>
                        </div>
                      </div>
                      <div className="relative mt-4 flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                              i < dots ? 'bg-primary' : 'bg-foreground/15',
                            )}
                          />
                        ))}
                        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                          {dots}/5
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}