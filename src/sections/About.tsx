import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Section } from '../components/Section'
import { usePortfolio } from '../hooks/usePortfolio'
import { containerStagger, itemFadeUp, viewportOnce } from '../lib/motion'

export function About() {
  const { data } = usePortfolio()
  const profile = data?.profile

  if (!profile) return null

  const infoItems = [
    { icon: MapPin, label: 'location', value: profile.location },
    { icon: Mail, label: 'email', value: profile.email },
    { icon: Phone, label: 'phone', value: profile.phone },
  ].filter((item) => item.value)

  const paragraphs = profile.about
    ? profile.about.split('\n').filter(Boolean)
    : [profile.short_bio].filter(Boolean)

  return (
    <Section id="about" index="01" title="About" subtitle="// a little about who i am and what i do">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.25fr_0.75fr]"
      >
        <motion.div variants={itemFadeUp} className="flex flex-col gap-5">
          <div className="relative border-l-2 border-primary/60 pl-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-foreground/85 [&:not(:last-child)]:mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="rounded-md border border-border bg-card/70 px-2.5 py-1">
              <span className="text-primary">&gt;</span> open to opportunities
            </span>
            {profile.availability ? (
              <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                available
              </span>
            ) : null}
          </div>
        </motion.div>

        <motion.div variants={itemFadeUp}>
          <div className="dot-grid relative overflow-hidden rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">
              <span>profile.readout</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            </div>
            <ul className="flex flex-col gap-3 text-sm">
              {infoItems.map((item) => (
                <li key={item.label}>
                  <span className="mb-0.5 block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {item.label}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs text-foreground/85">
                    <item.icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span className="truncate">{item.value}</span>
                  </span>
                </li>
              ))}
              <li>
                <span className="mb-0.5 block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  status
                </span>
                <span className="flex items-center gap-2 font-mono text-xs text-foreground/85">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                  {profile.availability ? 'available for work' : 'busy right now'}
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  )
}