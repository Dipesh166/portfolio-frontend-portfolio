import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Section } from '../components/Section'
import { usePortfolio } from '../hooks/usePortfolio'
import { formatDateRange } from '../lib/format'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'

export function Experience() {
  const { data } = usePortfolio()
  const experiences = data?.experiences ?? []

  if (experiences.length === 0) return null

  return (
    <Section id="experience" index="04" title="Experience" subtitle="// where i've worked & what i did">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative mx-auto max-w-3xl"
      >
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] border-l-2 border-dotted border-border"
        />
        <div className="flex flex-col gap-8">
          {experiences.map((exp) => (
            <motion.div key={exp.id} variants={itemFadeUp} className="relative pl-10">
              <span className="absolute top-2 left-0 grid h-4 w-4 place-items-center">
                <span className="absolute h-4 w-4 rounded-full border-2 border-primary bg-background" aria-hidden="true" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              </span>

              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/50">
                <div
                  className="dot-dense pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="relative mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold text-primary">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5">
                    {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                  </span>
                  {exp.is_current ? (
                    <span className="flex items-center gap-1.5 rounded-md bg-primary px-2 py-0.5 text-primary-foreground">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-current" aria-hidden="true" />
                      current
                    </span>
                  ) : null}
                </div>

                <h3 className="font-mono text-base font-bold text-foreground">{exp.position}</h3>
                <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                  {exp.company}
                  {exp.employment_type ? `  //  ${exp.employment_type}` : ''}
                </p>

                {exp.location ? (
                  <p className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
                    {exp.location}
                  </p>
                ) : null}

                {exp.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">{exp.description}</p>
                ) : null}

                {exp.technologies.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-accent/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}