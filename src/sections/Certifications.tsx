import { motion } from 'framer-motion'
import { BadgeCheck, ExternalLink } from 'lucide-react'
import { Section } from '../components/Section'
import { usePortfolio } from '../hooks/usePortfolio'
import { formatDate } from '../lib/format'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'

export function Certifications() {
  const { data } = usePortfolio()
  const certifications = data?.certifications ?? []

  if (certifications.length === 0) return null

  return (
    <Section id="certifications" index="06" title="Certifications" subtitle="// credentials & courses i've completed">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {certifications.map((cert) => (
          <motion.div key={cert.id} variants={itemFadeUp} className="flex">
            <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/50">
              <div
                className="dot-dense pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="relative flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-mono text-sm leading-snug font-bold text-foreground">
                    {cert.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  {formatDate(cert.issue_date)}
                </span>
                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-primary transition-colors hover:text-primary/70"
                  >
                    verify
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}