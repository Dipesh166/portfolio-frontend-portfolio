import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Section } from '../components/Section'
import { usePortfolio } from '../hooks/usePortfolio'
import { formatDateRange } from '../lib/format'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'

export function Education() {
  const { data } = usePortfolio()
  const education = data?.education ?? []

  if (education.length === 0) return null

  return (
    <Section id="education" index="05" title="Education" subtitle="// my academic background">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2"
      >
        {education.map((edu) => (
          <motion.div key={edu.id} variants={itemFadeUp} className="flex">
            <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/50">
              <div
                className="dot-dense pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 font-mono text-sm font-black text-primary">
                    &lt;/&gt;
                  </span>
                  <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground">
                    {formatDateRange(edu.start_date, edu.end_date, false)}
                  </span>
                </div>

                <div className="mt-2">
                  <h3 className="font-mono text-base leading-snug font-bold text-foreground">
                    {edu.institution}
                  </h3>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-primary">
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                  </p>
                </div>

                {edu.grade ? (
                  <span className="mt-1 inline-flex w-fit rounded-md border border-primary/40 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                    cgpa: {edu.grade}
                  </span>
                ) : null}

                {edu.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {edu.description}
                  </p>
                ) : null}

                {edu.location ? (
                  <p className="mt-auto flex items-center gap-1.5 pt-3 font-mono text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
                    {edu.location}
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